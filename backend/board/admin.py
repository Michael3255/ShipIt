from django.contrib import admin
from .models import Project, Objective, Task, Comment

# Register models
admin.site.register([Project, Objective, Task, Comment])