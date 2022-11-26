from django_filters import ModelMultipleChoiceFilter, AllValuesMultipleFilter, MultipleChoiceFilter
from django_filters.rest_framework import FilterSet

from api.enum import ReportStatus
from api.models import Report, Area


class ReportFilter(FilterSet):
    # allow to filter for multiple status value by repeating &status=xx
    status = MultipleChoiceFilter(field_name='annotation__status', lookup_expr='exact', choices=ReportStatus.get_model_choices())
    area = ModelMultipleChoiceFilter(field_name='annotation__area', lookup_expr='exact', queryset=Area.objects.filter(active=True).all())

    class Meta:
        model = Report
        fields = {
            'timestamp_creation': ['gte', 'lte'],
            # 'annotation__area': ['exact']
        }


class ReportFilterByAreaName(FilterSet):
    # allow to filter for multiple status value by repeating &status=xx
    # status = MultipleChoiceFilter(field_name='annotation__status', lookup_expr='exact', choices=ReportStatus.get_model_choices())
    area = ModelMultipleChoiceFilter(field_name='annotation__area__name', lookup_expr='exact', queryset=Area.objects.filter(active=True).all())

    class Meta:
        model = Report
        fields = {
            # 'timestamp_creation': ['gte', 'lte'],
            # 'annotation__area': ['exact']
        }
