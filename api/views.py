from django.contrib.auth import authenticate, login as django_internal_login, logout
from django.http import JsonResponse, HttpResponse, HttpResponseForbidden
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect
from rest_framework import viewsets, permissions, status, generics
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, parser_classes, permission_classes, authentication_classes, action
from rest_framework.parsers import JSONParser
from django.middleware.csrf import get_token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from api.enum import ReportUserType, map_category_1, map_category_2
from api.fr import report_form_fr, basic_terms
from api.models import Report, Votes
from api.serializers import ReportSerializer, VotesSerializer, UserSerializer


class VoteViewSetReport(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Votes.objects.all()
    serializer_class = VotesSerializer

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
    This viewset automatically provides `list` and `retrieve` actions for reports.
    """

    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    # to get csrf token
    @action(methods=['get'], detail=False)
    def csrf(self, request):
        csrf_token = get_token(request)  # provided by Middleware csrf
        # send csrf middle ware token
        return Response({'csrf_token': csrf_token})

    # to post
    def create(self, request):
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
