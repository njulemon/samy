import rest_framework.mixins
from django.contrib.auth import authenticate, login as django_internal_login, logout
from django.contrib.auth.hashers import make_password, check_password
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.http import HttpResponse

from django.views.decorators.csrf import csrf_protect
from rest_framework import viewsets, permissions, status, generics, views
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, parser_classes, permission_classes, authentication_classes, action
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.mixins import CreateModelMixin, ListModelMixin, UpdateModelMixin
from rest_framework.parsers import JSONParser, MultiPartParser
from django.middleware.csrf import get_token
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission, IsAdminUser
from rest_framework.response import Response
from templated_email import send_templated_mail

from api import Tools
from api.CustomPermissions import ActionBasedPermission, IsOwnerOrReadOnly
from api.MultiSerializerViewSet import MultiSerializerViewSet
from api.enum import ReportUserType, map_category_1, map_category_2
from api.fr import report_form_fr, basic_terms
from api.models import Report, Votes, CustomUser, KeyValidator, RestPassword, ReportImage, AuthorizedMail
from api.serializers import ReportSerializer, VotesSerializer, UserSerializer, NewUserSerializer, \
    CreateResetPasswordSerializer, UserPasswordSerializer, ReportImageSerializer, ReportSerializerHyperLink, \
    ReportImageSerializerNoUser, AuthorizedMailSerializerRead, AuthorizedMailSerializerWrite


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


class ReportViewSet(MultiSerializerViewSet):
    """
    Allowed usage : `list` all report, `get` one report, `create` report, `delete` report.
    """

    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    serializers = {
        'default': ReportSerializer,
        'list': ReportSerializerHyperLink,
        'create': ReportSerializer,
        'retrieve': ReportSerializerHyperLink,
        'update': ReportSerializer,
        'partial_update': ReportSerializer,
        'destroy': ReportSerializer
    }

    permission_classes = (IsOwnerOrReadOnly,)
    authentication_classes = [SessionAuthentication]

    # to get csrf token
    @action(methods=['get'], detail=False)
    def csrf(self, request):
        csrf_token = get_token(request)  # provided by Middleware csrf
        # send csrf middle ware token
        return Response({'csrf_token': csrf_token})

    # to post
    def create(self, request, *args, **kwargs):
        request.data["owner"] = request.user.id
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

            has_access = False
            for email_hashed_instance in AuthorizedMail.objects.all():
                if check_password(ser.validated_data['email'], email_hashed_instance.email_hashed):
                    has_access = True
                    break
            if not has_access:
                error_message = {'error': f'You are not in the list of authorized users. '
                                          f'Please contact admin by email {CustomUser.objects.filter(is_superuser=True)[0].email}'}
                return Response(status=status.HTTP_401_UNAUTHORIZED, data=error_message)

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
class PasswordForgotRequestView(viewsets.GenericViewSet, CreateModelMixin, ListModelMixin):
    """
    The 'list' does not send back anything.
    Use this method to request a password reset.
    """
    serializer_class = CreateResetPasswordSerializer
    queryset = RestPassword.objects.all()

    def list(self, request, *args, **kwargs):
        return Response('')

    def create(self, request, *args, **kwargs):
        ser = CreateResetPasswordSerializer(data=request.data)
        if ser.is_valid():
            key_object = ser.save()
            first_name = key_object.account.first_name
            pk_user = key_object.account.pk
            email = key_object.account.email
            key = key_object.key
            protocol = 'https' if request.is_secure() else 'http'
            send_templated_mail(
                template_name='reset_password',
                from_email='nicolas.julemont@gmail.com',
                recipient_list=[ser.validated_data['account'].email],
                context={
                    'first_name': first_name,
                    'link_key': f'{protocol}://{self.request.get_host()}/R/no-redirection/reset-password/{pk_user}/{key}',
                    'email': email
                })
            return Response(ser.data, status=status.HTTP_201_CREATED)
        else:
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


# ----------------------------------------------------------------------------------------------------------------------
class RestPasswordView(viewsets.GenericViewSet, UpdateModelMixin, ListModelMixin):
    """
    The 'list' does not send back anything.
    Use this method to request a password reset with this URL : /api/reset-password/{pk-account}
    """
    serializer_class = UserPasswordSerializer
    queryset = CustomUser.objects.all()

    def list(self, request, *args, **kwargs):
        return Response('')

    def update(self, request, *args, **kwargs):
        try:
            instance = CustomUser.objects.get(pk=kwargs['pk'])
        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        ser = UserPasswordSerializer(data=request.data, instance=instance)
        if ser.is_valid():
            user = ser.save()
            if user is not None:
                return Response(ser.data, status=status.HTTP_200_OK)
            else:
                return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


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


# ----------------------------------------------------------------------------------------------------------------------

class ReportImageView(viewsets.ModelViewSet):
    queryset = ReportImage.objects.all()
    serializer_class = ReportImageSerializer
    parser_classes = [MultiPartParser]

    permission_classes = (IsOwnerOrReadOnly,)
    authentication_classes = [SessionAuthentication]

    def create(self, request, *args, **kwargs):

        ser = ReportImageSerializerNoUser(data=request.data)

        if ser.is_valid():
            # we create a user based on authentication, not on data provided in the request.
            new_image = ReportImage.objects.create(
                image=ser.validated_data['image'],
                owner=request.user
            )
            response = Response(ReportImageSerializer(instance=new_image).data)
            return response
        else:
            return Response(ser.errors)


class AuthorizedMailViewSet(MultiSerializerViewSet):
    """
    To post data, you need to pass a JSON array of dictionaries.
    """
    queryset = AuthorizedMail.objects.all()
    serializer_class = AuthorizedMailSerializerRead
    serializers = {
        'default': AuthorizedMailSerializerRead,
        'list': AuthorizedMailSerializerRead,
        'create': AuthorizedMailSerializerWrite,
        'retrieve': AuthorizedMailSerializerRead,
        'update': AuthorizedMailSerializerWrite,
        'partial_update': AuthorizedMailSerializerWrite,
        'destroy': AuthorizedMailSerializerWrite
    }

    permission_classes = (IsAdminUser,)
    authentication_classes = [SessionAuthentication]

    def create(self, request, *args, **kwargs):
        ser = AuthorizedMailSerializerWrite(data=request.data, many=True)
        if ser.is_valid():
            instance = ser.save()
            ser_read = AuthorizedMailSerializerRead(instance=instance, many=True)
            return Response(ser_read.data)
        else:
            return Response(ser.errors)
