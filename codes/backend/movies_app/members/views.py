from django.http import JsonResponse
from django.shortcuts import redirect, render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ObjectDoesNotExist
from .models import CustomUser
from django.views.decorators.http import require_POST
from django.contrib.auth import logout,login
from django.contrib import messages
from .serializers import UserSerializer
from .serializers import SignupSerializer

class LoginView(APIView):
    def post(self, request):
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user is not None:
            refresh = RefreshToken.for_user(user)
            user_data = {
                'id': user.id,
                'password': user.password,  # It's usually not a good practice to send password hashes to the frontend
                'last_login': user.last_login,
                'is_superuser': user.is_superuser,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_active': user.is_active,
                'date_joined': user.date_joined,
                # ... any other user fields you want to include
            }
            return Response({
                'user': user_data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                
            })
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class UserDetailView(APIView):

    def get(self, request, user_id):
        try:
            user = CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user)
        return Response(serializer.data)
        
class LogoutView(APIView):
    # permission_classes = (IsAuthenticated,)
    def post(self, request, *args, **kwargs):
        user = getattr(request, "user", None)
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
    
    
    
    
class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            print (user)
            return Response({
                'user': {
                    'id': user.id,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'isGoogleUser': user.isGoogleUser,   # Include the isGoogleUser field
                    'googleID': user.googleID            # Include the googleID field
                },
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
          
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
