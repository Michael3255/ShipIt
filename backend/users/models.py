from django.db import models
from django.core import validators as v
from teams.models import Team


class User(models.Model):
    username = models.CharField(max_length=50, unique=True, validators=[v.MinLengthValidator(1)])
    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name="users")

    def __str__(self):
        return f"{self.username} - {self.email}"