from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from ..models import Project
from ..serializers.project_serializer import ProjectSerializer


class ProjectListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(team=self.request.user.team)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, team=self.request.user.team)

    def get_serializer_context(self):
        return {"request": self.request}


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(team=self.request.user.team)

    def get_serializer_context(self):
        return {"request": self.request}