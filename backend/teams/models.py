from django.db import models
from django.core import validators as v


class Team(models.Model):
    title = models.CharField(max_length=50, unique=True, validators=[v.MinLengthValidator(1)])
    project = models.OneToOneField(
        "projects.Project",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="team",
    )

    def __str__(self):
        return self.title