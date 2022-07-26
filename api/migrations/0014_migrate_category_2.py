import multiselectfield
from django.core.exceptions import ObjectDoesNotExist
from django.db import migrations

from api.enum import ReportCategory2


def transfer(apps, schema_editor):
    Reports = apps.get_model('api', 'Report')

    # for tests
    # Reports.objects.create(
    #     user_type = 1,
    #     operation=1,
    #     category_1=1,
    #     category_2=2,
    #     latitude=0.0,
    #     longitude=0.0,
    # )
    #
    # Reports.objects.create(
    #     user_type=1,
    #     operation=1,
    #     category_1=1,
    #     category_2=3,
    #     latitude=0.0,
    #     longitude=0.0,
    # )
    #
    # Reports.objects.create(
    #     user_type=1,
    #     operation=1,
    #     category_1=1,
    #     category_2=4,
    #     latitude=0.0,
    #     longitude=0.0,
    # )

    ordered = dict()

    for report in Reports.objects.all():
        report.category_3 = {item[0]: item[1] for item in ReportCategory2.get_model_choices()}[report.category_2]
        report.save()


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0013_document'),
    ]

    operations = [
        migrations.AddField(
            model_name='report',
            name='category_3',
            field=multiselectfield.db.fields.MultiSelectField(
                choices=[('NONE_CAT_2', 'NONE_CAT_2'), ('LANE_HOLE', 'LANE_HOLE'),
                         ('LANE_POOR_CONDITION', 'LANE_POOR_CONDITION'), ('LANE_VANISHED_PAINT', 'LANE_VANISHED_PAINT'),
                         ('LANE_UNCLEAR_SIGNAGE', 'LANE_UNCLEAR_SIGNAGE'),
                         ('LANE_BORDER_NEED_TO_BE_LOWERED', 'LANE_BORDER_NEED_TO_BE_LOWERED'),
                         ('LANE_SLIPPERY', 'LANE_SLIPPERY'), ('LANE_TOO_THIN', 'LANE_TOO_THIN'),
                         ('LANE_CROSSING_DANGEROUS', 'LANE_CROSSING_DANGEROUS'),
                         ('LANE_PRIORITY_NOT_RESPECTED_DANGEROUS', 'LANE_PRIORITY_NOT_RESPECTED_DANGEROUS'),
                         ('LANE_CROSSWALK_MISSING', 'LANE_CROSSWALK_MISSING'), ('RACK_DAMAGED', 'RACK_DAMAGED'),
                         ('NO_BICYCLE_PATH_DANGEROUS_SITUATION', 'NO_BICYCLE_PATH_DANGEROUS_SITUATION'),
                         ('SIGNAGE__MISSING', 'SIGNAGE__MISSING'), ('SIGNAGE__BAD_CONDITION', 'SIGNAGE__BAD_CONDITION'),
                         ('INCIDENT_GLASS_ON_LANE', 'INCIDENT_GLASS_ON_LANE'),
                         ('INCIDENT_NAILS_ON_LANE', 'INCIDENT_NAILS_ON_LANE'), ('ILLEGAL_PARKING', 'ILLEGAL_PARKING')],
                max_length=376),
        ),
        migrations.RunPython(transfer),
        migrations.RemoveField('report', 'category_2'),
        migrations.RenameField('report', 'category_3', 'category_2'),
    ]
