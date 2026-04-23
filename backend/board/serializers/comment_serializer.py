from rest_framework import serializers
from ..models import Comment
from .task_serializer import TaskSummarySerializer

class CommentSerializer(serializers.ModelSerializer):
    task_detail = TaskSummarySerializer(source="task", read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id',
            'body',
            'task',
            'task_detail',
            'user',
            'created_at',
        ]
        read_only_fields = ['id','created_at', 'user']

    def validate(self, attrs):
        task = attrs.get("task")
        request = self.context.get("request")

        if task and request and task.objective.project.team != request.user.team:
            raise serializers.ValidationError(
                {"task": "You can only comment on tasks in your own team's project."}
            )
        
        return attrs

    def validate_description(self, value):
        if not value.strip():
            raise serializers.ValidationError("Comment cannot be empty.")
        return value