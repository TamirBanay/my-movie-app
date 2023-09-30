# serializers.py
from rest_framework import serializers
from .models import Favorite  # Change MovieILike to Favorite

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite  # Change MovieILike to Favorite
        fields = ['tmdb_movie_id', 'user']  # Update field names if necessary