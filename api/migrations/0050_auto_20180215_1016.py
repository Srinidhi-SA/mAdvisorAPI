# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2018-02-15 10:16
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0049_auto_20180215_0905'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='audioset',
            options={'ordering': ['-created_at', '-updated_at'], 'permissions': (('view_task', 'View task'), ('create_task', 'Create task'), ('rename_task', 'Rename task'), ('delete_task', 'Delete task'))},
        ),
        migrations.AlterModelOptions(
            name='dataset',
            options={'ordering': ['-created_at', '-updated_at'], 'permissions': (('view_task', 'View task'), ('create_task', 'Create task'), ('rename_task', 'Rename task'), ('delete_task', 'Delete task'), ('upload_from_file', 'Upload from file'), ('upload_from_mysql', 'Upload from mysql'), ('upload_from_mssql', 'Upload from mssql'), ('upload_from_hana', 'Upload from hana'), ('datavalidation', 'Data Validation'), ('subsetting_task', 'Subsetting task'))},
        ),
        migrations.AlterModelOptions(
            name='insight',
            options={'ordering': ['-created_at', '-updated_at'], 'permissions': (('view_task', 'View task'), ('create_task', 'Create task'), ('rename_task', 'Rename task'), ('delete_task', 'Delete task')), 'verbose_name': 'Signal', 'verbose_name_plural': 'Signals'},
        ),
        migrations.AlterModelOptions(
            name='robo',
            options={'ordering': ['-created_at', '-updated_at'], 'permissions': (('view_task', 'View task'), ('create_task', 'Create task'), ('rename_task', 'Rename task'), ('delete_task', 'Delete task'))},
        ),
        migrations.AlterModelOptions(
            name='score',
            options={'ordering': ['-created_at', '-updated_at'], 'permissions': (('view_task', 'View task'), ('create_task', 'Create task'), ('rename_task', 'Rename task'), ('delete_task', 'Delete task'))},
        ),
        migrations.AlterModelOptions(
            name='stockdataset',
            options={'ordering': ['-created_at', '-updated_at'], 'permissions': (('view_task', 'View task'), ('create_task', 'Create task'), ('rename_task', 'Rename task'), ('delete_task', 'Delete task'))},
        ),
        migrations.AlterModelOptions(
            name='trainer',
            options={'ordering': ['-created_at', '-updated_at'], 'permissions': (('view_task', 'View task'), ('create_task', 'Create task'), ('rename_task', 'Rename task'), ('delete_task', 'Delete task'))},
        ),
    ]
