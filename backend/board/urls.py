from django.urls import path
from .views.project_views import ProjectListCreateView, ProjectDetailView
from .views.objective_views import ObjectiveListCreateView, ObjectiveDetailView
from .views.task_views import TaskListCreateView, TaskDetailView

urlpatterns = [
    path('projects/', ProjectListCreateView.as_view(), name='create_project'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project_detail'),

    path('objectives/', ObjectiveListCreateView.as_view(), name='create_objective'),
    path('objectives/<int:pk>/', ObjectiveDetailView.as_view(), name='objective_detail'),

    path('tasks/', TaskListCreateView.as_view(), name='create_task'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task_detail'),
]