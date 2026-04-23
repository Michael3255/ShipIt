from django.test import TestCase
from users.models import User
from teams.models import Team
from board.models import Project
from board.serializers import ProjectSerializer


class ProjectSerializerTest(TestCase):
    print("Project Tests")
    def setUp(self):
        self.team = Team.objects.create(title="Team Alpha")
        self.user = User.objects.create_user(
            username="tester",
            email="tester@example.com",
            password="password123",
            team=self.team,
        )
        self.project = Project.objects.create(
            title="Project One",
            description="Test project description",
            owner=self.user,
            team=self.team,
        )

    def test_project_serializer_returns_expected_fields(self):
        serializer = ProjectSerializer(self.project)
        data = serializer.data

        self.assertIn("id", data)
        self.assertIn("title", data)
        self.assertIn("description", data)
        self.assertIn("owner", data)
        self.assertIn("created_at", data)
        self.assertIn("objectives_count", data)

        # Only include this if team is in your serializer
        self.assertIn("team", data)

        self.assertEqual(data["title"], "Project One")
        self.assertEqual(data["description"], "Test project description")
        self.assertEqual(data["objectives_count"], 0)

    def test_project_serializer_accepts_valid_data(self):
        data = {
            "title": "Project Two",
            "description": "Another project"
        }

        serializer = ProjectSerializer(data=data)

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_project_serializer_requires_title(self):
        data = {
            "description": "Missing title"
        }

        serializer = ProjectSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("title", serializer.errors)

    def test_project_serializer_read_only_fields_are_not_writable(self):
        data = {
            "title": "Project Three",
            "description": "Trying to spoof fields",
            "owner": self.user.id,
            "created_at": "2026-01-01T00:00:00Z",
            "objectives_count": 99,
            "team": self.team.id,  # only assert this if team is read-only in serializer
        }

        serializer = ProjectSerializer(data=data)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertNotIn("owner", serializer.validated_data)
        self.assertNotIn("created_at", serializer.validated_data)
        self.assertNotIn("objectives_count", serializer.validated_data)

        # only assert this if team is read-only
        self.assertNotIn("team", serializer.validated_data)