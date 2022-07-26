from django.contrib.auth.hashers import make_password
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from api import Tools
from api.enum import ReportUserType, ReportCategory1, ReportCategory2, ReportOperation
from api.models import Report, CustomUser, Votes, RestPassword, ReportImage, AuthorizedMail, ReportAnnotation, Area, \
    ReportAnnotationComment, Notifications, Document


class ReportImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportImage
        fields = '__all__'


class ReportAnnotationCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportAnnotationComment
        fields = '__all__'


class ReportAnnotationCommentHyperLinkSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = ReportAnnotationComment
        fields = '__all__'


class ReportAnnotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportAnnotation
        fields = '__all__'


class ReportAnnotationHyperLinkSerializer(serializers.HyperlinkedModelSerializer):
    comments = ReportAnnotationCommentHyperLinkSerializer(many=True)

    class Meta:
        model = ReportAnnotation
        fields = '__all__'
        depth = 1


class AreaHyperLinkSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField()

    class Meta:
        model = Area
        fields = '__all__'


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'


class AreaSerializerName(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ['id', 'name']


class AreaIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ['id']


class ReportAnnotationNoBoundaryHyperLinkSerializer(serializers.HyperlinkedModelSerializer):
    comments = ReportAnnotationCommentHyperLinkSerializer(many=True)
    area = AreaSerializerName()

    class Meta:
        model = ReportAnnotation
        depth = 1
        fields = '__all__'


class ReportImageSerializerNoUser(serializers.ModelSerializer):
    class Meta:
        model = ReportImage
        fields = ['image']


class UserSerializer(serializers.ModelSerializer):
    coordinator_area = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = CustomUser
        exclude = ['password']


class UserSerializerHyperLink(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ['password']


class NewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ['is_superuser', 'is_staff', 'groups', 'user_permissions', 'date_joined', 'last_login', 'is_active',
                   'is_coordinator', 'coordinator_area']


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['notifications', 'first_name', 'last_name', 'alias']


class VotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Votes
        fields = '__all__'


class NotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = '__all__'


class ReportSerializer(serializers.ModelSerializer):
    user_type = serializers.CharField(source='get_user_type_display')
    operation = serializers.CharField(source='get_operation_display')
    category_1 = serializers.CharField(source='get_category_1_display')
    category_2 = serializers.MultipleChoiceField(choices=ReportCategory2.get_model_choices_same())
    owner = serializers.IntegerField(source='owner.id', default=None)
    owner_alias = serializers.CharField(source='owner.alias', read_only=True, default="Anonymous")

    class Meta:
        model = Report
        fields = '__all__'

    def create(self, validated_data):
        return Report.objects.create(
            user_type=ReportUserType.get_enum(validated_data["get_user_type_display"]).value,
            operation=ReportOperation.get_enum(validated_data["get_operation_display"]).value,
            category_1=ReportCategory1.get_enum(validated_data["get_category_1_display"]).value,
            category_2=validated_data["category_2"],
            owner=CustomUser.objects.get(id=validated_data["owner"]["id"]),
            latitude=validated_data["latitude"],
            longitude=validated_data["longitude"],
            image=validated_data['image'],
            comment=validated_data['comment'] if 'comment' in validated_data.keys() else None
        )

    def update(self, instance, validated_data):
        instance.user_type = ReportUserType.get_enum(validated_data["get_user_type_display"]).value
        instance.operation = ReportOperation.get_enum(validated_data["get_operation_display"]).value
        instance.category_1 = ReportCategory1.get_enum(validated_data["get_category_1_display"]).value
        instance.category_2 = ReportCategory2.get_enum(validated_data["get_category_2_display"]).value
        instance.image = validated_data.get('image', None)
        instance.comment = validated_data.get('comment', instance.comment)

        instance.save()

        return instance

class ReportIdSerializer(serializers.ModelSerializer):

    class Meta:
        model = Report
        fields = ['id']

class ReportSerializerHyperLink(serializers.HyperlinkedModelSerializer):
    user_type = serializers.CharField(source='get_user_type_display')
    operation = serializers.CharField(source='get_operation_display')
    category_1 = serializers.CharField(source='get_category_1_display')
    category_2 = serializers.MultipleChoiceField(choices=ReportCategory2.get_model_choices_same())
    owner = serializers.IntegerField(source='owner.id', default=None)
    owner_alias = serializers.CharField(source='owner.alias', read_only=True, default="Anonymous")
    image = serializers.HyperlinkedRelatedField(view_name='report-image-detail', read_only=True)
    image_pk = serializers.PrimaryKeyRelatedField(source='image', allow_null=True, read_only=True)
    id = serializers.IntegerField(read_only=True)
    annotation = ReportAnnotationNoBoundaryHyperLinkSerializer()

    class Meta:
        model = Report
        fields = '__all__'
        depth = 2


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


class AuthorizedMailSerializerRead(serializers.ModelSerializer):
    class Meta:
        model = AuthorizedMail
        fields = '__all__'


class AuthorizedMailSerializerWrite(serializers.ModelSerializer):
    email = serializers.EmailField()

    class Meta:
        model = AuthorizedMail
        fields = ['email']

    def create(self, validated_data):
        email_hashed = make_password(validated_data['email'])
        auth_mail = AuthorizedMail.objects.create(email_hashed=email_hashed)
        return auth_mail


class DocumentSerializerHyperLink(serializers.HyperlinkedModelSerializer):
    reports = ReportSerializerHyperLink(many=True)
    owner = serializers.PrimaryKeyRelatedField(many=True, queryset=Area.objects.all())

    class Meta:
        model = Document
        fields = '__all__'
        depth = 1


class DocumentSerializerPatch(serializers.ModelSerializer):

    class Meta:
        model = Document
        fields = '__all__'


class DocumentSerializerNoContentHyperLink(serializers.HyperlinkedModelSerializer):
    reports = serializers.PrimaryKeyRelatedField(many=True, queryset=Report.objects.all())
    owner = serializers.PrimaryKeyRelatedField(many=True, queryset=Area.objects.all())

    class Meta:
        model = Document
        fields = ['id', 'name', 'owner', 'reports', 'url', 'timestamp_creation', 'timestamp_modification']
        depth = 1


class DocumentSerializerWithContentHyperLink(serializers.HyperlinkedModelSerializer):
    reports = serializers.PrimaryKeyRelatedField(many=True, queryset=Report.objects.all())
    owner = serializers.PrimaryKeyRelatedField(many=True, queryset=Area.objects.all())

    class Meta:
        model = Document
        fields = ['id', 'name', 'owner', 'reports', 'content', 'url', 'timestamp_creation', 'timestamp_modification']
        depth = 1