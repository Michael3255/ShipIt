from rest_framework import serializers
from .models import Objective


class ObjectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objective
        fields = [
            'id',
            'title',
            'description',
            'owner',
            'status',
            'due_date',
            'project',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']