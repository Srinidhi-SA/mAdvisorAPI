# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-08-29 19:37
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0009_score_dataset'),
    ]

    operations = [
        migrations.CreateModel(
            name='Robo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, default='', max_length=300)),
                ('slug', models.SlugField(blank=True)),
                ('config', models.TextField(default='{}')),
                ('data', models.TextField(default='{}')),
                ('column_data_raw', models.TextField(default='{}')),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('deleted', models.BooleanField(default=False)),
                ('analysis_done', models.BooleanField(default=False)),
                ('bookmarked', models.BooleanField(default=False)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('customer_dataset', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='customer_dataset', to='api.Dataset')),
                ('historical_dataset', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='historical_dataset', to='api.Dataset')),
                ('market_dataset', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='market_dataset', to='api.Dataset')),
            ],
            options={
                'ordering': ['-created_at', '-updated_at'],
            },
        ),
        migrations.AlterModelOptions(
            name='score',
            options={'ordering': ['-created_at', '-updated_at']},
        ),
    ]
