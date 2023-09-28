# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import MovieSerializer
from .models import MovieILike
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse



@api_view(['POST'])
def add_movie(request):
    if request.method == "POST":
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt  # This decorator exempts this view from CSRF protection. In production, you should use proper CSRF protection.
def remove_movie_from_favorite(request, movie_id):
    if request.method == "DELETE":
        movie = get_object_or_404(MovieILike, tmdb_id=movie_id)
        movie.delete()
        return JsonResponse({'status': 'success', 'message': 'Movie removed successfully'}, status=200)
    else:
        return HttpResponse('Method not allowed', status=405)