# movie_app/models.py
from django.db import models

class MovieILike(models.Model):
    tmdb_id = models.IntegerField(unique=True)  # Unique TMDB ID
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.title