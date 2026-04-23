from django.test import TestCase
from rest_framework.test import APIRequestFactory

from users.models import User
from teams.models import Team
from board.models import Project, Objective, Task, Comment
from board.serializers import CommentSerializer


class CommentSerializerTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

        self.team_a = Team.objects.create(title="Team A")
        self.team_b = Team.objects.create(title="Team B")

        self.user_a = User.objects.create_user(
            username="user_a",
            email="user_a@example.com",
            password="password123",
            team=self.team_a,
        )
        self.user_b = User.objects.create_user(
            username="user_b",
            email="user_b@example.com",
            password="password123",
            team=self.team_b,
        )

        self.project_a = Project.objects.create(
            title="Project A",
            description="Team A project",
            owner=self.user_a,
            team=self.team_a,
        )
        self.project_b = Project.objects.create(
            title="Project B",
            description="Team B project",
            owner=self.user_b,
            team=self.team_b,
        )

        self.objective_a = Objective.objects.create(
            title="Objective A",
            description="Objective for Team A",
            owner=self.user_a,
            status="To Do",
            due_date="2026-05-01",
            project=self.project_a,
        )
        self.objective_b = Objective.objects.create(
            title="Objective B",
            description="Objective for Team B",
            owner=self.user_b,
            status="To Do",
            due_date="2026-05-01",
            project=self.project_b,
        )

        self.task_a = Task.objects.create(
            title="Task A",
            description="Task for Team A",
            status="To Do",
            due_date="2026-05-10",
            assigned_user=self.user_a,
            objective=self.objective_a,
        )
        self.task_b = Task.objects.create(
            title="Task B",
            description="Task for Team B",
            status="To Do",
            due_date="2026-05-10",
            assigned_user=self.user_b,
            objective=self.objective_b,
        )

    def test_comment_serializer_returns_expected_fields(self):
        comment = Comment.objects.create(
            body="Looks good",
            task=self.task_a,
            user=self.user_a,
        )

        serializer = CommentSerializer(comment)
        data = serializer.data

        self.assertIn("id", data)
        self.assertIn("body", data)
        self.assertIn("task", data)
        self.assertIn("task_detail", data)
        self.assertIn("user", data)
        self.assertIn("created_at", data)

        self.assertEqual(data["body"], "Looks good")
        self.assertEqual(data["task"], self.task_a.id)
        self.assertEqual(data["task_detail"]["id"], self.task_a.id)
        self.assertEqual(data["task_detail"]["title"], self.task_a.title)
        self.assertEqual(data["task_detail"]["status"], self.task_a.status)

    def test_comment_serializer_accepts_valid_data(self):
        request = self.factory.post("/")
        request.user = self.user_a

        data = {
            "body": "Valid comment",
            "task": self.task_a.id,
        }

        serializer = CommentSerializer(data=data, context={"request": request})

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_comment_serializer_rejects_blank_description(self):
        request = self.factory.post("/")
        request.user = self.user_a

        data = {
            "body": "   ",
            "task": self.task_a.id,
        }

        serializer = CommentSerializer(data=data, context={"request": request})

        self.assertFalse(serializer.is_valid())
        self.assertIn("body", serializer.errors)

    def test_comment_serializer_rejects_task_from_other_team(self):
        request = self.factory.post("/")
        request.user = self.user_a

        data = {
            "body": "Wrong team comment",
            "task": self.task_b.id,
        }

        serializer = CommentSerializer(data=data, context={"request": request})

        self.assertFalse(serializer.is_valid())
        self.assertIn("task", serializer.errors)

    def test_comment_serializer_user_is_read_only(self):
        request = self.factory.post("/")
        request.user = self.user_a

        data = {
            "body": "Trying to spoof user",
            "task": self.task_a.id,
            "user": self.user_b.id,
        }

        serializer = CommentSerializer(data=data, context={"request": request})

        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertNotIn("user", serializer.validated_data)