from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from ..models import Task
from ..serializers.task_serializer import TaskSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        objective_id = self.request.query_params.get('objective')
        project_id = self.request.query_params.get('project')
        if objective_id:
            return Task.objects.filter(objective=objective_id)
        if project_id:
            return Task.objects.filter(objective__project=project_id)
        return Task.objects.filter(objective__project__team=self.request.user.team)

    def get_serializer_context(self):
        return {"request": self.request}


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(objective__project__team=self.request.user.team)

    def get_serializer_context(self):
        return {"request": self.request}