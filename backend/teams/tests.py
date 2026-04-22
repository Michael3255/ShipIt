from django.test import TestCase
from .models import Team
from .serializers import TeamSerializer


class TeamSerializerTest(TestCase):
    def test_team_serializer_returns_expected_fields(self):
        team = Team.objects.create(title="Team Alpha")

        serializer = TeamSerializer(team)

        self.assertIn("id", serializer.data)
        self.assertIn("title", serializer.data)
        self.assertNotIn("project", serializer.data)
        self.assertEqual(serializer.data["title"], "Team Alpha")

    def test_team_serializer_accepts_valid_data(self):
        data = {
            "title": "Team Bravo"
        }

        serializer = TeamSerializer(data=data)

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_team_serializer_requires_title(self):
        data = {}

        serializer = TeamSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("title", serializer.errors)