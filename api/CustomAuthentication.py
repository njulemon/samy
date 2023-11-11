import binascii
import datetime
import os

import pytz
from django.contrib.auth.models import User
from rest_framework import authentication
from rest_framework import exceptions

from api.models import TokenURL, CustomUser


class TokenURLAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):

        token_expiration_days = 3

        token = request.query_params.get('token', None)
        if token is None:
            # no token, no auth
            return None
        try:
            token = TokenURL.objects.get(token=token)
            if  datetime.datetime.now(tz=pytz.UTC) - token.timestamp < datetime.timedelta(days=token_expiration_days):
                user = token.user
            else:
                token.delete()
                raise exceptions.AuthenticationFailed('Token is expired')
        except TokenURL.DoesNotExist:
            raise exceptions.AuthenticationFailed('No such token')

        return (user, None)


def create_token(user: CustomUser):
    token = TokenURL.objects.create(
        user=user,
        token=binascii.hexlify(os.urandom(50)).decode()
    )