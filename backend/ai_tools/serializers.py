from rest_framework import serializers

class StoryBuilderSerializer(serializers.Serializer):
    project_title = serializers.CharField(required=True)
    objective = serializers.CharField(required=True)
    feature = serializers.CharField(required=True)

class StoryBuilderResponseSerializer(serializers.Serializer):
    story_summary = serializers.CharField()
    completion_checks = serializers.ListField(child=serializers.CharField())
    suggested_tasks = serializers.ListField(child=serializers.CharField())