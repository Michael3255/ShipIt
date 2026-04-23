from rest_framework import serializers
from .models import Objective
from .project_serializer import ProjectSummarySerializer

class ObjectiveSummarySerializer(serializers.ModelSerializers):
    class Meta:
        model = Objective
        fields=["id", "title", "status"]

class ObjectiveSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    project_detail = ProjectSummarySerializer(source="project", read_only=True)

    class Meta:
        model = Objective
        fields = [
            'id',
            'title',
            'description',
            'status',
            'due_date',
            'project',
            'project_detail',
            'owner',
            'created_at',
        ]
        read_only_fields = ['id', 'owner', 'project_detail', 'created_at']