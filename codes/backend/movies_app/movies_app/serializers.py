# serializers.py
from rest_framework import serializers
from .models import Favorite ,Favorite_series # Change MovieILike to Favorite

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite  # Change MovieILike to Favorite
        fields = ['tmdb_movie_id', 'user']  # Update field names if necessary
        
        
class FavoriteMovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'
class FavoriteSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite_series
        fields = '__all__'
