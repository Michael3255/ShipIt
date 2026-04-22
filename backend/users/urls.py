from django.urls import path
from .views import RegisterView

urlpatterns = [
    path('users/signup/', RegisterView.as_view(), name='create_user'),
]