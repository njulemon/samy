from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from multiselectfield import MultiSelectField
from rest_framework import fields

from . import enum
from .enum import ReportUserType, ReportCategory1, ReportCategory2, ReportOperation, InCharge, ReportStatus
from .managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    is_coordinator = models.BooleanField(default=False)
    coordinator_area = models.ManyToManyField(to="Area", default=None, blank=True)

    date_joined = models.DateTimeField(default=timezone.now)

    # add other fields if needed.
    first_name = models.CharField(_('first name'), max_length=100)
    last_name = models.CharField(_('last name'), max_length=100)

    # alias
    alias = models.CharField('pseudo', max_length=20, default='Anonymous')

    # notifications (email)
    notifications = models.ManyToManyField(to="Notifications", default=None, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['password']

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class ReportImage(models.Model):
    image = models.ImageField()
    owner = models.ForeignKey(to=CustomUser, on_delete=models.SET_NULL, null=True)


# USER RELATED
# ----------------------------------------------------------------------------------------------------------------------
class KeyValidator(models.Model):
    account = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    key = models.CharField(max_length=100)


class RestPassword(models.Model):
    account = models.OneToOneField(to=CustomUser, on_delete=models.CASCADE)
    key = models.CharField(max_length=100)


class Notifications(models.Model):
    name = models.CharField(max_length=20, unique=True)


# REPORTS RELATED
# ----------------------------------------------------------------------------------------------------------------------
class Report(models.Model):
    user_type = models.IntegerField(choices=ReportUserType.get_model_choices())
    operation = models.IntegerField(choices=ReportOperation.get_model_choices(), default=1)
    category_1 = models.IntegerField(choices=ReportCategory1.get_model_choices())
    category_2 = MultiSelectField(choices=ReportCategory2.get_model_choices_same())
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)
    timestamp_creation = models.DateTimeField(auto_now_add=True)

    # creator of the report. If user delete the account this field is set to null.
    owner = models.ForeignKey(
        to=CustomUser,
        on_delete=models.SET_NULL,
        null=True
    )
    image = models.ForeignKey(
        to=ReportImage,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        default=None
    )
    comment = models.CharField(max_length=2000, blank=True, null=True)

    annotation = models.ForeignKey(to="ReportAnnotation", on_delete=models.SET_NULL, null=True, default=None)

    def __str__(self):
        return f'{self.timestamp_creation}'


class ReportAnnotation(models.Model):
    area = models.ForeignKey(to="Area", on_delete=models.SET_NULL, null=True, default=None)
    in_charge = models.SmallIntegerField(choices=InCharge.get_model_choices(), default=0, null=True)
    status = models.SmallIntegerField(choices=ReportStatus.get_model_choices(), default=1, null=True)
    comments = models.ManyToManyField(to="ReportAnnotationComment", blank=True)
    date_start = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)


class ReportAnnotationComment(models.Model):
    comment = models.CharField(max_length=500, blank=False)
    date_start = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)


class Area(models.Model):
    name = models.CharField(max_length=30, unique=True)
    active = models.BooleanField(default=False)
    boundary = models.JSONField(default=dict)
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)

    def __str__(self):
        return f'{self.name}'


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
    email_hashed = models.CharField(max_length=128)

    def __str__(self):
        return self.email_hashed


class Document(models.Model):
    name = models.CharField(max_length=100)
    content = models.JSONField(blank=True, default=list)
    reports = models.ManyToManyField(to="Report", default=None, blank=True)
    owner = models.ManyToManyField(to='Area', default=None, blank=True)
    timestamp_creation = models.DateTimeField(auto_now_add=True)
    timestamp_modification = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'[{self.pk}] {self.name} [{self.timestamp_creation}]'
