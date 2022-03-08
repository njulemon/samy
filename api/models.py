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
    REQUIRED_FIELDS = ['password', 'first_name', 'last_name']

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class ReportImage(models.Model):
    image = models.ImageField()


class Report(models.Model):
    user_type = models.IntegerField(choices=ReportUserType.get_model_choices())
    category_1 = models.IntegerField(choices=ReportCategory1.get_model_choices())
    category_2 = models.IntegerField(choices=ReportCategory2.get_model_choices())
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)
    timestamp_creation = models.DateTimeField(auto_now_add=True)
    # creator of the report. If user delete the account this field is set to null.
    creator = models.ForeignKey(
        to=CustomUser,
        on_delete=models.CASCADE
    )
    image = models.ForeignKey(
        to=ReportImage,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        default=None
    )


class Votes(models.Model):
    user = models.ForeignKey(
        to=CustomUser,
        on_delete=models.CASCADE
    )
    gravity = models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])
    report = models.ForeignKey(
        to=Report,
        on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ('user', 'report',)


class AuthorizedMail(models.Model):
    email = models.EmailField(unique=True)


class KeyValidator(models.Model):
    account = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    key = models.CharField(max_length=100)


class RestPassword(models.Model):
    account = models.OneToOneField(to=CustomUser, on_delete=models.CASCADE)
    key = models.CharField(max_length=100)