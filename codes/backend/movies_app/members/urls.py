# members/urls.py

from django.urls import path
from .views import LoginView,UserDetailView,LogoutView


urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('user/<int:user_id>/',UserDetailView.as_view(), name='user_detail'),
    path('logout/', LogoutView.as_view(), name='logout'),



    

]
