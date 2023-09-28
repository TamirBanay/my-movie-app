# serializers.py
from rest_framework import serializers
from .models import MovieILike

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieILike
        fields = '__all__'
