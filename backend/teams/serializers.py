from rest_framework import serializers
from .models import Team


class TeamSerializer(serializers.ModelSerializer):
    users = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Team
        fields = (
            "id",
            "title",
            "users",
        )