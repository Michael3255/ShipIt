from django.db import models
from django.core import validators as v


class Team(models.Model):
    title = models.CharField(max_length=50, unique=True, validators=[v.MinLengthValidator(1)])
    

    def __str__(self):
        return self.title