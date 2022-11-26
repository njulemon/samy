# https://pypi.org/project/django-cors-headers/
# bottom of the page

from corsheaders.signals import check_request_enabled


def cors_allow_api_to_everyone(sender, request, **kwargs):
    return request.path.startswith("/api/report-geojson/")


check_request_enabled.connect(cors_allow_api_to_everyone)