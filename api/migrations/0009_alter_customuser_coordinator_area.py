# Generated by Django 3.2.9 on 2022-04-12 18:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_auto_20220410_1135'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='coordinator_area',
            field=models.ManyToManyField(blank=True, default=None, to='api.Area'),
        ),
    ]