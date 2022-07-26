# written by Nicolas on 2022-05-01

from django.db import migrations, models, IntegrityError

from api import enum


def load_notifications(apps, schema_editor):
    Notifications = apps.get_model('api', 'Notifications')

    for item in enum.Notifications:
        try:
            Notifications.objects.create(
                name=item.name
            )
        except IntegrityError:
            print('Notification : ' + item.name + ' already exists.')


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0011_auto_20220501_2313'),
    ]

    operations = [
        migrations.RunPython(load_notifications),
    ]
