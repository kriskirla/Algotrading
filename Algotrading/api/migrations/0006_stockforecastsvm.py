# Generated by Django 3.1.7 on 2021-02-23 17:29

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20210221_0123'),
    ]

    operations = [
        migrations.CreateModel(
            name='StockForecastSVM',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ticker', models.CharField(max_length=20)),
                ('year', models.DateField(default=datetime.date.today, verbose_name='Analyzing Year')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]