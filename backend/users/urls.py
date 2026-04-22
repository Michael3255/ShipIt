from django.urls import path
from .views import CreateUserView, UserDetailsView

urlpatterns = [
    path('users/signup/', CreateUserView.as_view(), name='create_user'),
    path('users/<int:pk>/', UserDetailsView.as_view(), name='user_details'),
]