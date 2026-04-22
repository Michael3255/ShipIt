from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Project, Objective, Task, Comment

User = get_user_model()


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    objectives_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "description",
            "owner",
            "created_at",
            "objectives_count",
        )
        read_only_fields = ("id", "created_at", "owner", "objectives_count")

    def get_objectives_count(self, obj):
        return obj.objectives.count()