from django.urls import path
from .views import TeamListCreateView, TeamDetailView, JoinTeamView, LeaveTeamView

urlpatterns = [
    path('', TeamListCreateView.as_view(), name='team_list_create'),
    path('<int:pk>/', TeamDetailView.as_view(), name='team_detail'),
    path('<int:pk>/join/', JoinTeamView.as_view(), name='team_join'),
    path('<int:pk>/leave/', LeaveTeamView.as_view(), name='team_leave'),
]