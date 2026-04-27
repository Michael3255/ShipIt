from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views.project_views import ProjectListCreateView, ProjectDetailView
from .views.objective_views import ObjectiveListCreateView, ObjectiveDetailView
from .views.task_views import TaskListCreateView, TaskDetailView
from .views.auth_views import RegisterView


urlpatterns = [
    # ---------------- PROJECTS ----------------
    path('projects/', ProjectListCreateView.as_view(), name='create_project'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project_detail'),

    # ---------------- OBJECTIVES ----------------
    path('objectives/', ObjectiveListCreateView.as_view(), name='create_objective'),
    path('objectives/<int:pk>/', ObjectiveDetailView.as_view(), name='objective_detail'),

    # ---------------- TASKS ----------------
    path('tasks/', TaskListCreateView.as_view(), name='create_task'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task_detail'),

    # ---------------- AUTH (REGISTER + LOGIN) ----------------
    path('register/', RegisterView.as_view(), name='register'),

    # LOGIN (JWT)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # REFRESH TOKEN (important for future)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]