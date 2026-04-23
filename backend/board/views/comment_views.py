from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from ..models import Comment
from ..serializers.comment_serializer import CommentSerializer


class CommentListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def get_queryset(self):
        return Comment.objects.filter(task__objective__project__team=self.request.user.team)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        return {"request": self.request}


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def get_queryset(self):
        return Comment.objects.filter(task__objective__project__team=self.request.user.team)

    def get_serializer_context(self):
        return {"request": self.request}