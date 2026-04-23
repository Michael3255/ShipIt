from django.test import TestCase
from rest_framework.test import APIRequestFactory

from users.models import User
from teams.models import Team
from board.models import Project, Objective
from board.serializers import ObjectiveSerializer


class ObjectiveSerializerTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

        self.team_a = Team.objects.create(title="Team A")
        self.team_b = Team.objects.create(title="Team B")

        self.user_a = User.objects.create_user(
            username="usera",
            email="usera@example.com",
            password="password123",
            team=self.team_a,
        )

        self.user_b = User.objects.create_user(
            username="userb",
            email="userb@example.com",
            password="password123",
            team=self.team_b,
        )

        self.project_b = Project.objects.create(
            title="Project B",
            description="Belongs to Team B",
            owner=self.user_b,
            team=self.team_b,
        )

    def test_objective_rejects_other_team_project(self):
        request = self.factory.post("/")
        request.user = self.user_a

        data = {
            "title": "Test Objective",
            "description": "Desc",
            "status": "To Do",
            "due_date": "2026-01-01",
            "project": self.project_b.id,
        }

        serializer = ObjectiveSerializer(
            data=data,
            context={"request": request}
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("project", serializer.errors)