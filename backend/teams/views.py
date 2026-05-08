from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
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

class JoinTeamView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk):
        try:
            team = Team.objects.get(pk=pk)
        except Team.DoesNotExist:
            return Response(
                {"error": "Team not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        request.user.team = team
        request.user.save()

        return Response(
            {"message": f"Joined team {team.title}"},
            status=status.HTTP_200_OK
        )
    
class LeaveTeamView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk):
        if request.user.team_id != pk:
            return Response(
                {"error": "You are not a member of this team"},
                status=status.HTTP_400_BAD_REQUEST
            )

        request.user.team = None
        request.user.save()

        return Response(
            {"message": "You left the team"},
            status=status.HTTP_200_OK
        )