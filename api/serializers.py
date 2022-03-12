from django.contrib.auth.hashers import make_password
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from api import Tools
from api.enum import ReportUserType, ReportCategory1, ReportCategory2
from api.models import Report, CustomUser, Votes, RestPassword, ReportImage


class ReportImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportImage
        fields = '__all__'


class ReportImageSerializerNoUser(serializers.ModelSerializer):
    class Meta:
        model = ReportImage
        fields = ['image']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ['password']


class NewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ['is_superuser', 'is_staff', 'groups', 'user_permissions', 'date_joined', 'last_login', 'is_active']


class VotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Votes
        fields = '__all__'


class ReportSerializer(serializers.ModelSerializer):
    user_type = serializers.CharField(source='get_user_type_display')
    category_1 = serializers.CharField(source='get_category_1_display')
    category_2 = serializers.CharField(source='get_category_2_display')
    owner = serializers.IntegerField(source='owner.id')

    class Meta:
        model = Report
        fields = '__all__'

    def create(self, validated_data):

        return Report.objects.create(
            user_type=ReportUserType.get_enum(validated_data["get_user_type_display"]).value,
            category_1=ReportCategory1.get_enum(validated_data["get_category_1_display"]).value,
            category_2=ReportCategory2.get_enum(validated_data["get_category_2_display"]).value,
            owner=CustomUser.objects.get(id=validated_data["owner"]["id"]),
            latitude=validated_data["latitude"],
            longitude=validated_data["longitude"],
            image=validated_data['image'],
            comment=validated_data['comment'] if 'comment' in validated_data.keys() else None
        )


class ReportSerializerHyperLink(serializers.HyperlinkedModelSerializer):
    user_type = serializers.CharField(source='get_user_type_display')
    category_1 = serializers.CharField(source='get_category_1_display')
    category_2 = serializers.CharField(source='get_category_2_display')
    owner = serializers.IntegerField(source='owner.id')
    image = serializers.HyperlinkedRelatedField(view_name='report-image-detail', read_only=True)
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Report
        fields = '__all__'


class RestPasswordSerializer(serializers.Serializer):
    """
    Provides a way to post the email when requesting to reset the password and create in the DB a
    pair (account, key) that should be sent to the user in order to reset the password.
    """

    email = serializers.EmailField()
    key = serializers.CharField(max_length=100, required=False)

    def update(self, instance, validated_data):
        raise NotImplementedError

    def validate(self, attrs):

        account = attrs.get('account')

        if not account:
            raise ValidationError('account with email provided does not exist')

        return attrs

    def to_internal_value(self, data):

        email = data.get('email')
        key = Tools.key_generate(64)

        try:
            account = CustomUser.objects.get(email=email)
        except ObjectDoesNotExist:
            account = None

        return {
            'account': account,
            'key': key
        }

    def to_representation(self, instance):
        return {
            'email': instance.account.email
        }

    def create(self, validated_data):
        obj, _ = RestPassword.objects.get_or_create(account=validated_data['account'])
        obj.key = validated_data['key']
        obj.save()
        return obj


class CreateResetPasswordSerializer(serializers.Serializer):
    """
    Provides a way to post the email when requesting to reset the password and create in the DB a
    pair (account, key) that should be sent to the user in order to reset the password.
    """

    email = serializers.EmailField()
    key = serializers.CharField(max_length=100, required=False)

    def update(self, instance, validated_data):
        raise NotImplementedError

    def validate(self, attrs):

        account = attrs.get('account')

        if not account:
            raise ValidationError('account with email provided does not exist')

        return attrs

    def to_internal_value(self, data):

        email = data.get('email')
        key = Tools.key_generate(64)

        try:
            account = CustomUser.objects.get(email=email)
        except ObjectDoesNotExist:
            account = None

        return {
            'account': account,
            'key': key
        }

    def to_representation(self, instance):
        return {
            'email': instance.account.email
        }

    def create(self, validated_data):
        obj, _ = RestPassword.objects.get_or_create(account=validated_data['account'])
        obj.key = validated_data['key']
        obj.save()
        return obj


class UserPasswordSerializer(serializers.Serializer):
    """
    Provides a way to post the email when requesting to reset the password and create in the DB a
    pair (account, key) that should be sent to the user in order to reset the password.
    """

    password = serializers.CharField(max_length=20)
    key = serializers.CharField(max_length=100, required=False)

    def validate(self, attrs):

        password = attrs.get('password')
        key = attrs.get('key')

        if not password:
            raise ValidationError('password not provided')

        if not key:
            raise ValidationError('key not provided')

        try:
            account = self.instance
            key_obj = RestPassword.objects.get(account=account)
        except ObjectDoesNotExist:
            raise ValidationError('Account or key does not exist in the DB.')

        if key != key_obj.key:
            raise ValidationError('Key is not valid')

        return attrs

    def to_internal_value(self, data):

        key = data.get('key')
        password = data.get('password')

        return {
            'key': key,
            'password': password
        }

    def to_representation(self, instance):
        return {
            'pk_user': instance.pk
        }

    def update(self, instance, validated_data):
        password = make_password(validated_data['password'])
        key = validated_data['key']
        try:
            key_obj = RestPassword.objects.get(account=instance)
            if key_obj.key != key:
                raise ObjectDoesNotExist
            instance.password = password
            instance.save()
        except ObjectDoesNotExist:
            # do not update
            pass

        return instance

    def create(self, validated_data):
        raise NotImplementedError
