from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ( 
            "id", 
            "username", 
            "email", 
            "password", 
            "created_at", 
            "team"
            )
        extra_kwargs = {
            "id": {"read_only": True},
            "username": {"required": True},
            "email": {"required": True},
            "password": {"required": True, "write_only": True},
            "created_at": {"read_only": True},
            "team": {"required": False},
        }


class CreateAccountSerializer(serializers.ModelSerializer):
    class Meta:        
        model = User
        fields = ("username", "email", "password")
        extra_kwargs = {
            "password": {"write_only": True},
        }