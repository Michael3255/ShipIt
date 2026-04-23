from django.urls import path, include
from .views import TeamListCreateView,TeamDetailView 

urlpatterns = [
    path('team_list_create/', TeamListCreateView.as_view(), name='team_list_create'),
    path('<int:pk>/', TeamDetailView.as_view(), name='team_detail'),
]