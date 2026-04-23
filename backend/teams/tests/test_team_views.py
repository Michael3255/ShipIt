from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from teams.models import Team


class TeamViewTest(APITestCase):
    def setUp(self):
        self.team_a = Team.objects.create(title="Team Alpha")
        self.team_b = Team.objects.create(title="Team Bravo")

        # Replace these names if your urls use different names
        self.list_create_url = reverse("team_list_create")
        self.detail_url = reverse("team_detail", kwargs={"pk": self.team_a.id})

    def test_team_list_view_returns_teams(self):
        response = self.client.get(self.list_create_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["title"], self.team_a.title)

    def test_team_create_view_creates_team(self):
        data = {
            "title": "Team Charlie"
        }

        response = self.client.post(self.list_create_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 3)
        self.assertTrue(Team.objects.filter(title="Team Charlie").exists())

    def test_team_detail_view_returns_single_team(self):
        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.team_a.id)
        self.assertEqual(response.data["title"], self.team_a.title)

    def test_team_update_view_updates_team(self):
        data = {
            "title": "Team Alpha Updated"
        }

        response = self.client.put(self.detail_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.team_a.refresh_from_db()
        self.assertEqual(self.team_a.title, "Team Alpha Updated")

    def test_team_delete_view_deletes_team(self):
        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Team.objects.filter(id=self.team_a.id).exists())