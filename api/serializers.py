from rest_framework import serializers

from api.models import Report


class ReportSerializer(serializers.ModelSerializer):

    user_type = serializers.CharField(source='get_user_type_display')
    category_1 = serializers.CharField(source='get_category_1_display')
    category_2 = serializers.CharField(source='get_category_2_display')

    class Meta:
        model = Report
        fields = '__all__'
