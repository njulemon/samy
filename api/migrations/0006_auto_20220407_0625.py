# Generated by Django 3.2.9 on 2022-04-07 04:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20220407_0619'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reportannotation',
            name='in_charge',
            field=models.SmallIntegerField(choices=[(0, 'IC_IN_CHARGE_NONE'), (1, 'IC_MUNICIPALITY'), (2, 'IC_REGION')], default=0),
        ),
        migrations.AlterField(
            model_name='reportannotation',
            name='status',
            field=models.SmallIntegerField(choices=[(0, 'RS_STATUS_NONE'), (1, 'RS_REPORTED'), (2, 'RS_CLASSIFIED'), (3, 'RS_REPORTED_TO_AUTHORITIES'), (4, 'RS_NOT_RELEVANT'), (5, 'RS_REPORT_IN_PROGRESS'), (6, 'RS_SOLVED')], default=1),
        ),
    ]
