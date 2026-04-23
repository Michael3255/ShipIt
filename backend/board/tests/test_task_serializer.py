from django.test import TestCase
from rest_framework.test import APIRequestFactory

from users.models import User
from teams.models import Team
from board.models import Project, Objective, Task
from board.serializers import TaskSerializer


class TaskSerializerTest(TestCase):
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
        self.user_a_teammate = User.objects.create_user(
            username="user_a_teammate",
            email="user_a_teammate@example.com",
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

    def test_task_serializer_returns_expected_fields(self):
        task = Task.objects.create(
            title="Task One",
            description="Test task",
            status="To Do",
            due_date="2026-05-10",
            assigned_user=self.user_a,
            objective=self.objective_a,
        )

        serializer = TaskSerializer(task)
        data = serializer.data

        self.assertIn("id", data)
        self.assertIn("title", data)
        self.assertIn("description", data)
        self.assertIn("status", data)
        self.assertIn("due_date", data)
        self.assertIn("assigned_user", data)
        self.assertIn("objective", data)
        self.assertIn("objective_detail", data)
        self.assertIn("created_at", data)

        self.assertEqual(data["title"], "Task One")
        self.assertEqual(data["objective"], self.objective_a.id)
        self.assertEqual(data["objective_detail"]["id"], self.objective_a.id)
        self.assertEqual(data["objective_detail"]["title"], self.objective_a.title)
        self.assertEqual(data["objective_detail"]["status"], self.objective_a.status)

    def test_task_serializer_accepts_valid_data(self):
        request = self.factory.post("/")
        request.user = self.user_a

        data = {
            "title": "Valid Task",
            "description": "Good task",
            "status": "To Do",
            "due_date": "2026-05-15",
            "assigned_user": self.user_a_teammate.id,
            "objective": self.objective_a.id,
        }

        serializer = TaskSerializer(data=data, context={"request": request})

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_task_serializer_rejects_objective_from_other_team(self):
        request = self.factory.post("/")
        request.user = self.user_a

        data = {
            "title": "Bad Task",
            "description": "Wrong team objective",
            "status": "To Do",
            "due_date": "2026-05-15",
            "assigned_user": self.user_a.id,
            "objective": self.objective_b.id,
        }

        serializer = TaskSerializer(data=data, context={"request": request})

        self.assertFalse(serializer.is_valid())
        self.assertIn("objective", serializer.errors)

    def test_task_serializer_rejects_assigned_user_from_other_team(self):
        request = self.factory.post("/")
        request.user = self.user_a

        data = {
            "title": "Bad Assignment",
            "description": "Wrong team assignee",
            "status": "To Do",
            "due_date": "2026-05-15",
            "assigned_user": self.user_b.id,
            "objective": self.objective_a.id,
        }

        serializer = TaskSerializer(data=data, context={"request": request})

        self.assertFalse(serializer.is_valid())
        self.assertIn("assigned_user", serializer.errors)

    def test_task_serializer_requires_title(self):
        request = self.factory.post("/")
        request.user = self.user_a

        data = {
            "description": "Missing title",
            "status": "To Do",
            "due_date": "2026-05-15",
            "assigned_user": self.user_a.id,
            "objective": self.objective_a.id,
        }

        serializer = TaskSerializer(data=data, context={"request": request})

        self.assertFalse(serializer.is_valid())
        self.assertIn("title", serializer.errors)