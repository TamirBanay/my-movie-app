# serializers.py in your members app

from django.contrib.auth import get_user_model
from rest_framework import serializers

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['username', 'password']
