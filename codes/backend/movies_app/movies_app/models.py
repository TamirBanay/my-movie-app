
from django.conf import settings
from django.db import models

class Favorite(models.Model):
    tmdb_movie_id = models.IntegerField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    class Meta:
      unique_together = ('tmdb_movie_id', 'user',)
      
      
