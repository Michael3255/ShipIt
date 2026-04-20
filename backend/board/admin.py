from django.contrib import admin
from .models import Status, Project, Objective, Task, Comment

admin.site.register(Status)
admin.site.register(Project)
admin.site.register(Objective)
admin.site.register(Task)
admin.site.register(Comment)