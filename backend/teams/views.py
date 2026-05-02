from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Team
from .serializers import TeamSerializer


class TeamListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class TeamDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = Team.objects.all()
    serializer_class = TeamSerializer