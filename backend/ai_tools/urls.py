from django.urls import path
from .views import StoryBuilderView

urlpatterns = [
   path('story-builder/', StoryBuilderView.as_view(), name='story-builder'), 
]