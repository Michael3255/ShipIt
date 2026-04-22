from rest_framework import serializers
from .models import Team


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = (
            "id",
            "title",
            "project",
        )
        extra_kwargs = {
            "id": {"read_only": True},
            "title": {"required": True},
            "project": {"required": False},
        }