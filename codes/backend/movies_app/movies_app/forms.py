# movie_app/forms.py
from django import forms
from .models import MovieILike

class MovieILikeForm(forms.ModelForm):
    class Meta:
        model = MovieILike
        fields = ['tmdb_id', 'name']
