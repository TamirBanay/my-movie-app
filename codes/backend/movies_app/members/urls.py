# members/urls.py

from django.urls import path
from .views import LoginView,UserDetailView,LogoutView,SignupView


urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('user_detail/<int:user_id>/',UserDetailView.as_view(), name='user_detail'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('signup/', SignupView.as_view(), name='signup'),




    

]
