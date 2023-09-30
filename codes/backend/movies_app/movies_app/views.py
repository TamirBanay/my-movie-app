# views.py
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Favorite
from .serializers import FavoriteSerializer
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views import View
import json
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404, render






def post(self, request):
        serializer = FavoriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class AddFavoriteView(APIView):

    def post(self, request):
        serializer = FavoriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@method_decorator(csrf_exempt, name='dispatch')

class RemoveFavoriteView(View):
    def delete(self, request, tmdb_movie_id, user_id):
        try:
            # Fetch the Favorite object by tmdb_movie_id and user_id
            favorite = get_object_or_404(Favorite, tmdb_movie_id=tmdb_movie_id, user__id=user_id)
            
            # Delete the favorite
            favorite.delete()
            
            return JsonResponse({'success': True, 'message': 'Movie removed from favorites successfully.'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
