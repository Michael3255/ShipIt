from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from .models import Project, Objective, Task
from .serializers import ProjectSerializer
from .objective_serializer import ObjectiveSerializer
from .task_serializer import TaskSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class ProjectListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def perform_create(self, serializer):
        user = User.objects.first()  # temporary real user
        serializer.save(owner=user)

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class ObjectiveListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Objective.objects.all()
    serializer_class = ObjectiveSerializer

class ObjectiveDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = Objective.objects.all()
    serializer_class = ObjectiveSerializer

class TaskListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = Task.objects.all()
    serializer_class = TaskSerializer