from django.urls import path
from .views import RegisterView, TeamMembersView

urlpatterns = [
    path('users/signup/', RegisterView.as_view(), name='create_user'),
    path('users/team-members/', TeamMembersView.as_view(), name='team_members'),
]