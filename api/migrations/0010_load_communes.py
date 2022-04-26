# Generated by Django 3.2.9 on 2022-04-17 16:35
import json
from collections import OrderedDict

from django.core.exceptions import ObjectDoesNotExist
from django.db import migrations


def load_communes(apps, schema_editor):
    Area = apps.get_model('api', 'Area')

    ordered = dict()

    with open("data/geojson/communes.geojson") as f:
        data = json.load(f)
        for row in data["features"]:
            name_french = (row["properties"]["NameFRE"])
            ordered[name_french] = row
            # some names are not right (french + flemish)
            ordered[name_french]["properties"]["name"] = name_french

    for name in sorted(ordered.keys()):
        if ordered[name]["properties"]["LangCode"] != "D":
            try:
                area = Area.objects.get(name=name)
                area.boundary = ordered[name]
                area.latitude = sum([coor[0] for coor in ordered[name]["geometry"]["coordinates"][0][0]]) \
                                / len(ordered[name]["geometry"]["coordinates"][0][0]),
                area.longitude = sum([coor[1] for coor in ordered[name]["geometry"]["coordinates"][0][0]]) \
                                 / len(ordered[name]["geometry"]["coordinates"][0][0])
                area.save()
            except ObjectDoesNotExist:
                Area.objects.create(
                    name=name,
                    active=False,
                    boundary=ordered[name],
                    latitude=sum([coor[0] for coor in ordered[name]["geometry"]["coordinates"][0][0]]) / len(
                        ordered[name]["geometry"]["coordinates"][0][0]),
                    longitude=sum([coor[1] for coor in ordered[name]["geometry"]["coordinates"][0][0]]) / len(
                        ordered[name]["geometry"]["coordinates"][0][0])
                )


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0009_auto_20220417_2130'),
    ]

    operations = [
        migrations.RunPython(load_communes),
    ]