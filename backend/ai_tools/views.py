from .serializers import StoryBuilderSerializer, StoryBuilderResponseSerializer
from .services import build_user_story_response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


# Create your views here.
class StoryBuilderView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        serializer = StoryBuilderSerializer(data=request.data)

        if serializer.is_valid():
            validated_data = serializer.validated_data
            result = build_user_story_response(validated_data)
            response_serializer = StoryBuilderResponseSerializer(result)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)