from django.urls import path
from .views import RegisterView, TeamMembersView

urlpatterns = [
    path('signup/', RegisterView.as_view(), name='create_user'),
    path('team-members/', TeamMembersView.as_view(), name='team_members'),
]