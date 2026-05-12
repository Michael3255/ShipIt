from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from users.serializers import SignUpSerializer
from users.models import User

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeamMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        team = request.user.team

        if not team:
            return Response([], status=status.HTTP_200_OK)

        # return all users on the same team with id and username
        members = User.objects.filter(team=team).values('id', 'username')
        return Response(list(members), status=status.HTTP_200_OK)