from rest_framework import serializers
from ..models import Objective
from .project_serializer import ProjectSummarySerializer

class ObjectiveSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Objective
        fields=["id", "title", "status"]

class ObjectiveSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    project_detail = ProjectSummarySerializer(source="project", read_only=True)
    tasks_total = serializers.SerializerMethodField()
    tasks_done = serializers.SerializerMethodField()

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
            'tasks_total',
            'tasks_done',
        ]
        read_only_fields = ['id', 'owner', 'project_detail', 'created_at']
    
    def get_tasks_total(self, obj):
        return obj.tasks.count()

    def get_tasks_done(self,obj):
        return obj.tasks.filter(status='Done').count()
    
    def validate(self, attrs):
        project = attrs.get("project")
        request = self.context.get("request")

        if project and request and project.team != request.user.team:
            raise serializers.ValidationError(
                {"project": "You can only add an objective to a project in your own team."}
            )

        return attrs