"""
URL configuration for movies_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# movies_app/urls.py

from django.contrib import admin
from django.urls import path, include
from .views import AddFavoriteView,GetFavoritesView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('members.urls')),  # This includes the members app URLs under the path 'api/'
    path('add_favorite/', AddFavoriteView.as_view(), name='add_favorite'),
    path('get_favorites/<int:user_id>/', GetFavoritesView.as_view(), name='get_favorites'),


]
