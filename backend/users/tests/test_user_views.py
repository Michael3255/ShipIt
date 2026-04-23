from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from teams.models import Team
from users.models import User


class RegisterViewTest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(title="Team Alpha")

        # Replace this with your real URL name if different
        self.url = reverse("create_user")

    def test_register_view_creates_user_and_returns_tokens(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepassword123",
            "password_confirm": "securepassword123",
            "team": self.team.id,
        }

        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("refresh", response.data)
        self.assertIn("access", response.data)

        user = User.objects.get(username="newuser")
        self.assertEqual(user.email, "newuser@example.com")
        self.assertEqual(user.team, self.team)
        self.assertTrue(user.check_password("securepassword123"))
        self.assertNotEqual(user.password, "securepassword123")

    def test_register_view_rejects_password_mismatch(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepassword123",
            "password_confirm": "differentpassword123",
            "team": self.team.id,
        }

        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_register_view_rejects_missing_username(self):
        data = {
            "email": "newuser@example.com",
            "password": "securepassword123",
            "password_confirm": "securepassword123",
            "team": self.team.id,
        }

        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)

    def test_register_view_rejects_missing_password_confirm(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepassword123",
            "team": self.team.id,
        }

        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password_confirm", response.data)