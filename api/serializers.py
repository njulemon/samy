from rest_framework import serializers

from api.enum import ReportUserType, ReportCategory1, ReportCategory2
from api.models import Report, CustomUser, Votes


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        exclude = ['password']

class VotesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Votes
        fields = '__all__'


class ReportSerializer(serializers.ModelSerializer):

    user_type = serializers.CharField(source='get_user_type_display')
    category_1 = serializers.CharField(source='get_category_1_display')
    category_2 = serializers.CharField(source='get_category_2_display')
    creator = serializers.EmailField(source='creator.email')

    class Meta:
        model = Report
        fields = '__all__'

    def create(self, validated_data):

        return Report.objects.create(
            user_type=ReportUserType.get_enum(validated_data["get_user_type_display"]).value,
            category_1=ReportCategory1.get_enum(validated_data["get_category_1_display"]).value,
            category_2=ReportCategory2.get_enum(validated_data["get_category_2_display"]).value,
            creator=CustomUser.objects.get(email=validated_data["creator"]["email"]),
            latitude=validated_data["latitude"],
            longitude=validated_data["longitude"]
        )
