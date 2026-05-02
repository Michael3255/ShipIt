from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from ..models import Objective
from ..serializers.objective_serializer import ObjectiveSerializer


class ObjectiveListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ObjectiveSerializer

    def get_queryset(self):
        queryset = Objective.objects.filter(project__team=self.request.user.team)
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_serializer_context(self):
        return {"request": self.request}


class ObjectiveDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ObjectiveSerializer

    def get_queryset(self):
        return Objective.objects.filter(project__team=self.request.user.team)

    def get_serializer_context(self):
        return {"request": self.request}