import rest_framework.mixins
from django.contrib.auth import authenticate, login as django_internal_login, logout
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.http import HttpResponse

from django.views.decorators.csrf import csrf_protect
from rest_framework import viewsets, permissions, status, generics, views
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, parser_classes, permission_classes, authentication_classes, action
from rest_framework.exceptions import NotFound
from rest_framework.mixins import CreateModelMixin, ListModelMixin
from rest_framework.parsers import JSONParser
from django.middleware.csrf import get_token
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission, IsAdminUser
from rest_framework.response import Response
from templated_email import send_templated_mail

from api import Tools
from api.enum import ReportUserType, map_category_1, map_category_2
from api.fr import report_form_fr, basic_terms
from api.models import Report, Votes, CustomUser, KeyValidator
from api.serializers import ReportSerializer, VotesSerializer, UserSerializer, NewUserSerializer


class ActionBasedPermission(AllowAny):
    """
    Grant or deny access to a view, based on a mapping in view.action_permissions
    """

    def has_permission(self, request, view):
        for klass, actions in getattr(view, 'action_permissions', {}).items():
            if view.action in actions:
                return klass().has_permission(request, view)
        return False


class VoteViewSetReport(viewsets.ModelViewSet):
    queryset = Votes.objects.all()
    serializer_class = VotesSerializer

    permission_classes = (ActionBasedPermission,)
    authentication_classes = [SessionAuthentication]

    action_permissions = {
        IsAuthenticated: ['create', 'retrieve', 'partial_update', 'update'],
        IsAdminUser: ['list', 'destroy']
    }

    # retrieve has been hacked in order to return the list of votes for a report id.
    def retrieve(self, request, pk=None, *args, **kwargs):
        queryset = Votes.objects.filter(report_id=pk)
        serializer = VotesSerializer(queryset, many=True)
        return Response(serializer.data)


class VoteViewSetUser(viewsets.ViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user = request.user
        queryset = Votes.objects.filter(user=user)
        serializer = VotesSerializer(queryset, many=True)
        return Response(serializer.data)

    # @action(methods=['post', 'put'], detail=True)
    # def vote(self, request, pk=None):
    #     if request.method == 'PUT':
    #         vote = Votes.objects.get(pk=pk)
    #         serializer = VotesSerializer(vote, request)
    #         if serializer.is_valid():
    #             serializer.save()
    #     elif request.method == 'POST':
    #         serializer = VotesSerializer(request)

    # to get csrf token
    @action(methods=['get'], detail=False)
    def csrf(self, request):
        csrf_token = get_token(request)  # provided by Middleware csrf
        # send csrf middle ware token
        return Response({'csrf_token': csrf_token})


class TranslationViewSet(viewsets.ViewSet):
    """
    Allow you to get translation dic.

    """

    @action(detail=False)
    def fr(self, request):
        return Response({**report_form_fr, **basic_terms})

    def list(self, request):
        return Response(
            {'fr': 'français',
             'en': 'not implemented yet',
             'nl': 'not implemented yet'})


class ReportViewSet(viewsets.ModelViewSet):
    """
    Allowed usage : `list` all report, `get` one report, `create` report, `delete` report.
    """

    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = (ActionBasedPermission,)
    authentication_classes = [SessionAuthentication]

    action_permissions = {
        IsAuthenticated: ['list', 'create', 'retrieve'],
        IsAdminUser: ['update', 'partial_update', 'destroy']
    }

    # to get csrf token
    @action(methods=['get'], detail=False)
    def csrf(self, request):
        csrf_token = get_token(request)  # provided by Middleware csrf
        # send csrf middle ware token
        return Response({'csrf_token': csrf_token})

    # to post
    def create(self, request, *args, **kwargs):
        request.data["creator"] = request.user.email
        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors)


class ReportFormTree(viewsets.ViewSet):
    """
            This viewset provides a `list` dictionary with all the fields as a tree.
            To access `translations` of key word ask language as second argument (eg. 'fr').
    """

    def list(self, request):
        dic_return = {
            0: [item.name for item in ReportUserType],
            1: {
                user.name: [cat.name for cat in cat_list] for user, cat_list in map_category_1.items()
            },
            2: {
                user_type.name: {cat_1.name: [item.name for item in list_cat2] for cat_1, list_cat2 in
                                 cat1_dic.items()}
                for user_type, cat1_dic in map_category_2.items()
            }
        }
        return Response(dic_return)

    @action(detail=False)
    def fr(self, request):
        return Response(report_form_fr)


# ----------------------------------------------------------------------------------------------------------------------

class UserViewSet(viewsets.GenericViewSet, CreateModelMixin):
    queryset = CustomUser.objects.all()
    serializer_class = NewUserSerializer
    permission_classes = (AllowAny,)
    authentication_classes = [BasicAuthentication]

    def create(self, request, *args, **kwargs):

        ser = NewUserSerializer(data=request.data)

        if request.is_secure():
            protocol = 'https'
        else:
            protocol = 'http'

        if ser.is_valid():

            user = CustomUser.objects.create(
                first_name=ser.validated_data['first_name'],
                last_name=ser.validated_data['last_name'],
                email=ser.validated_data['email'],
                password=make_password(ser.validated_data['password']),
                is_staff=False,
                is_superuser=False,
                is_active=False
            )

            key_register = Tools.key_generate(64)

            KeyValidator.objects.create(account=user, key=key_register)

            send_templated_mail(
                template_name='registered_confirmation',
                from_email='nicolas.julemont@gmail.com',
                recipient_list=[ser.validated_data['email']],
                context={
                    'first_name': user.first_name,
                    'link_key': f'{protocol}://{self.request.get_host()}/api/key-validation/{user.pk}?key={key_register}&format=json',
                    'email': user.email
                })

            return Response(NewUserSerializer(user).data)
        else:
            return Response(ser.errors)


# ----------------------------------------------------------------------------------------------------------------------
class KeyValidationView(viewsets.GenericViewSet, rest_framework.mixins.RetrieveModelMixin, ListModelMixin):
    """
    The 'list' does not send back anything.
    Signature is /key-validation/{user.pk}?key={validation-key} to activate user.
    """

    def list(self, request, *args, **kwargs):
        return Response('')

    def retrieve(self, request, *args, **kwargs):

        key = self.request.query_params.get('key', None)
        if key is not None:
            try:
                user = KeyValidator.objects.get(key=key).account
                if user.pk != int(kwargs['pk']):
                    return Response('The user pk was not provided.')
            except (ObjectDoesNotExist, MultipleObjectsReturned, KeyError):
                return Response('The user/key combination does not exist.')
            else:
                user.is_active = True
                user.save()
                return Response('Your account is now active.')
        else:
            return Response('You did not provide any key.')


# ----------------------------------------------------------------------------------------------------------------------
@api_view(['POST', 'GET'])
@parser_classes([JSONParser])
@csrf_protect
def login_(request):
    """
    Allow to login with session auth.
    Also manage csrf cookie and csrf token (there is 2 csrf tokens !!!) when posting credentials.
    :param request:
    :return:
    """
    if request.method == 'POST':
        try:
            username = request.data['username']
            password = request.data['password']
        except KeyError:
            content = {'error': 'username and/or password were not provided. '}
            return Response(content, status=403)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            django_internal_login(request, user)
            return Response(status=200)
        else:
            # Return an 'invalid login' error message.
            return Response(status=403)

    elif request.method == 'GET':
        csrf_token = get_token(request)  # provided by Middleware csrf
        # send csrf middle ware token
        return Response({'csrf_token': csrf_token})


# ----------------------------------------------------------------------------------------------------------------------
@api_view(['GET'])
def logout_view(request):
    logout(request)
    return Response(status=200)


# ----------------------------------------------------------------------------------------------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def has_access(request):
    return Response(status=200)


# ----------------------------------------------------------------------------------------------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    return Response(UserSerializer(request.user).data)


# ----------------------------------------------------------------------------------------------------------------------
@api_view(['GET'])
def csrf(request):
    csrf_token = get_token(request)  # provided by Middleware csrf
    # send csrf middle ware token
    return Response({'csrf_token': csrf_token})
