from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    team = serializers.PrimaryKeyRelatedField(read_only=True)
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
        read_only_fields = ("id", "created_at", "owner", "team", "objectives_count")

    def get_objectives_count(self, obj):
        return obj.objectives.count()