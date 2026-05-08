from django.urls import path, include
from .views import TeamListCreateView, TeamDetailView, JoinTeamView, LeaveTeamView

urlpatterns = [
    path('teams/', TeamListCreateView.as_view(), name='team_list_create'),
    path('teams/<int:pk>/', TeamDetailView.as_view(), name='team_detail'),
    path('teams/<int:pk>/join/', JoinTeamView.as_view(), name='team_join'),
    path('teams/<int:pk>/leave/', LeaveTeamView.as_view(), name='team_leave'),
]