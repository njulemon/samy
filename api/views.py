from django.contrib.auth import authenticate, login as django_internal_login, logout
from django.http import JsonResponse, HttpResponse, HttpResponseForbidden
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import JSONParser
from django.middleware.csrf import get_token
from rest_framework.permissions import AllowAny

from api.models import Report
from api.serializers import ReportSerializer


class ReportViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `retrieve` actions.
    """

    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]


# ----------------------------------------------------------------------------------------------------------------------

@api_view(['POST', 'GET'])
@parser_classes([JSONParser])
@csrf_protect
def login_(request):
    if request.method == 'POST':
        try:
            username = request.data['username']
            password = request.data['password']
        except KeyError:
            content = {'error': 'username and/or password were not provided. '}
            return JsonResponse(content, status=403)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            django_internal_login(request, user)
            return HttpResponse(status=200)
        else:
            # Return an 'invalid login' error message.
            return HttpResponseForbidden()

    elif request.method == 'GET':
        csrf_token = get_token(request)  # provided by Middleware csrf
        # send csrf middle ware token
        return JsonResponse({'csrf_token': csrf_token})


@api_view(['GET'])
def logout_view(request):
    logout(request)
    return HttpResponse(status=200)
