# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from api.user_helper import UserSerializer
from django.contrib.auth.models import User
from django.conf import settings

from api.models import Dataset
from helper import convert_to_json, convert_time_to_human
from api.helper import get_jobserver_status


class DatasetSerializer(serializers.ModelSerializer):

    # name = serializers.CharField(max_length=100,
    #                              validators=[UniqueValidator(queryset=Dataset.objects.all())]
    #                              )

    input_file = serializers.FileField(allow_null=True, read_only=True)

    def update(self, instance, validated_data):
        instance.meta_data = validated_data.get('meta_data', instance.meta_data)
        instance.name = validated_data.get('name', instance.name)
        instance.created_by = validated_data.get('created_by', instance.created_by)
        instance.deleted = validated_data.get('deleted', instance.deleted)
        instance.bookmarked = validated_data.get('bookmarked', instance.bookmarked)
        instance.auto_update = validated_data.get('auto_update', instance.auto_update)
        instance.auto_update_duration = validated_data.get('auto_update_duration', instance.auto_update_duration)
        instance.datasource_details = validated_data.get('datasource_details', instance.datasource_details)
        instance.datasource_type = validated_data.get('datasource_type', instance.datasource_type)

        instance.save()
        return instance

    def to_representation(self, instance):
        print get_jobserver_status(instance)
        ret = super(DatasetSerializer, self).to_representation(instance)
        ret = convert_to_json(ret)
        ret = convert_time_to_human(ret)
        ret['created_by'] = UserSerializer(User.objects.get(pk=ret['created_by'])).data
        meta_data = ret.get('meta_data')
        if 'possibleAnalysis' in meta_data:
            meta_data['possibleAnalysis'] = settings.ANALYSIS_FOR_TARGET_VARIABLE

        return ret

    class Meta:
        model = Dataset
        exclude = ( 'id', 'updated_at')


class DataListSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        ret = super(DataListSerializer, self).to_representation(instance)
        ret['brief_info'] = instance.get_brief_info()
        return ret

    class Meta:
        model = Dataset
        fields = (
            "slug",
            "name",
            "created_at",
            "updated_at",
            "input_file",
            "datasource_type",
            "bookmarked",
            "analysis_done",
            "file_remote"
        )
