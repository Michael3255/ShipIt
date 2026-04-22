from django.contrib.auth.models import AbstractUser
from django.db import models

# custom User Model
class User(AbstractUser):
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name="users")

    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username} - {self.email}"