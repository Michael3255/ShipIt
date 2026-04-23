
from rest_framework import serializers
from .models import Task
from .objective_serializers import ObjectiveSummarySerializer

class TaskSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model=Task
        fields=["id", "title", "status"]

class TaskSerializer(serializers.ModelSerializer):
    objective_detail = ObjectiveSummarySerializer(source="objective", read_only=True)

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'status',
            'due_date',
            'assigned_user',
            'objective',
            'objective_detail',
            'created_at',
        ]
        read_only_fields = ['id','created_at']

    def validate(self, attrs):
        objective = attrs.get("objective")
        assigned_user = attrs.get("assigned_user")
        request = self.context.get("request")

        if objective and request and objective.project.team != request.user.team:
            raise serializers.ValidationError(
                {"objective": "You can only add a task to an objective in your own team's project."}
            )
        
        if assigned_user and objective and assigned_user.team != objective.project.team:
            raise serializers.ValidationError(
                {"assigned_user": "Assigned user must belong to the same team as the project."}
            )

        return attrs