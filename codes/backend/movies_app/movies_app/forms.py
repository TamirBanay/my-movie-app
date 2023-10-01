# movie_app/forms.py
from django import forms
from .models import Favorite

class FavoriteForm(forms.ModelForm):
    class Meta:
        model = Favorite
        fields = ['tmdb_movie_id', 'user']  # Updated field names to match the new model structure
