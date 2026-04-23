from django.test import TestCase

# Create your tests here.
from django.test import TestCase

from teams.models import Team
from users.models import User
from users.serializers import SignUpSerializer


class SignUpSerializerTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(title="Team Alpha")

    def test_signup_serializer_accepts_valid_data(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepassword123",
            "password_confirm": "securepassword123",
            "team": self.team.id,
        }

        serializer = SignUpSerializer(data=data)

        self.assertTrue(serializer.is_valid(), serializer.errors)

        user = serializer.save()

        self.assertEqual(user.username, "newuser")
        self.assertEqual(user.email, "newuser@example.com")
        self.assertEqual(user.team, self.team)
        self.assertTrue(user.check_password("securepassword123"))
        self.assertNotEqual(user.password, "securepassword123")

    def test_signup_serializer_rejects_mismatched_passwords(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepassword123",
            "password_confirm": "differentpassword123",
            "team": self.team.id,
        }

        serializer = SignUpSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)

    def test_signup_serializer_requires_password_confirm(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepassword123",
            "team": self.team.id,
        }

        serializer = SignUpSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("password_confirm", serializer.errors)

    def test_signup_serializer_requires_username(self):
        data = {
            "email": "newuser@example.com",
            "password": "securepassword123",
            "password_confirm": "securepassword123",
            "team": self.team.id,
        }

        serializer = SignUpSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)

    def test_signup_serializer_password_fields_are_write_only(self):
        user = User.objects.create_user(
            username="tester",
            email="tester@example.com",
            password="password123",
            team=self.team,
        )

        serializer = SignUpSerializer(user)
        data = serializer.data

        self.assertNotIn("password", data)
        self.assertNotIn("password_confirm", data)
        self.assertEqual(data["username"], "tester")
        self.assertEqual(data["email"], "tester@example.com")
        self.assertEqual(data["team"], self.team.id)