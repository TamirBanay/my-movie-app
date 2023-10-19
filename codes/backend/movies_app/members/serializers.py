# serializers.py in your members app

from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CustomUser 

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['username', 'password']
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'  # Adjust the fields list to match the fields of your CustomUser model




class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', "username",'email', 'password','isGoogleUser','googleID','isFaceBookUser','FaceBookID']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
          password = validated_data.pop('password', None)
          instance = self.Meta.model(**validated_data)
          if password is not None:
            instance.set_password(password)
            instance.save()
            return instance