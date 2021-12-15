from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .enum import ReportUserType, ReportCategory1, ReportCategory2
from .managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    # add other fields if needed.
    first_name = models.CharField(_('first name'), max_length=100)
    last_name = models.CharField(_('last name'), max_length=100)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Report(models.Model):

    user_type = models.IntegerField(choices=ReportUserType.get_model_choices())
    category_1 = models.IntegerField(choices=ReportCategory1.get_model_choices())
    category_2 = models.IntegerField(choices=ReportCategory2.get_model_choices())
