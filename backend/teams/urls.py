from django.urls import path, include
from .views import TeamListCreateView,TeamDetailView 

urlpatterns = [
    path('teams/', TeamListCreateView.as_view(), name='team_list_create'),
    path('teams/<int:pk>/', TeamDetailView.as_view(), name='team_detail'),
]