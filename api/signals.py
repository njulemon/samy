from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Report, CustomUser, Alert, Area

def find_area_for_point(lat, lng):
    from shapely.geometry import Point, shape

    point = Point(lng, lat)

    for area in Area.objects.all():
        try:
            boundary = area.boundary
            if boundary.get('type') == 'Feature':
                boundary = boundary['geometry']
            polygon = shape(boundary)
            if polygon.contains(point):
                return area
        except Exception as e:
            continue
    return None

@receiver(post_save, sender=Report)
def notify_coordinator(sender, instance, created, **kwargs):
    if not created:
        return

    area = find_area_for_point(instance.latitude, instance.longitude)

    if not area:
        return

    coordinators = CustomUser.objects.filter(
        is_coordinator=True,
        is_active=True,
        coordinator_area=area
    )

    alerts = [
        Alert(
            user=coordinator,
            report=instance,
            message="Nouveau point noir signalé"
        )
        for coordinator in coordinators
    ]
    Alert.objects.bulk_create(alerts)

