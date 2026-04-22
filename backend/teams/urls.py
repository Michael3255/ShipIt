from django.urls import path, include
from .views import TeamListCreateView,TeamDetailView 

urlpatterns = [
    path('create_team/', TeamListCreateView.as_view(), name='create_team'),
    path('<int:pk>/', TeamDetailView.as_view(), name='team_detail'),
]