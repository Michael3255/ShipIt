from django.conf import settings
from django.db import models


STATUS_CHOICES = [
    ('No Status', 'No Status'),
    ('To Do', 'To Do'),
    ('In Progress', 'In Progress'),
    ('Done', 'Done'),
]


class Project(models.Model):
    title = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projects'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Objective(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='objectives'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='No Status'
    )
    due_date = models.DateField()
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='objectives'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Task(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='No Status'
    )
    due_date = models.DateField()
    assigned_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tasks'
    )
    objective = models.ForeignKey(
        Objective,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Comment(models.Model):
    description = models.TextField(blank=True)
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.user} on {self.task}'