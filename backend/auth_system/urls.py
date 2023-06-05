"""
URL configuration for auth_system project.

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
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from turiki.views import TournamentAPIView, MatchAPIView, TeamAPIView, ChatAPIView
from rest_framework.routers import DefaultRouter
from .yasg import urlpatterns as doc_urls

# с помощью defaultrouter'а регистрируем api маршруты
tournamentRouter = DefaultRouter()
tournamentRouter.register(r'api/tournament', TournamentAPIView, basename='tournament')

matchRouter = DefaultRouter()
matchRouter.register(r'api/match', MatchAPIView, basename='match')

teamRouter = DefaultRouter()
teamRouter.register(r'api/team', TeamAPIView, basename='team')

chatRouter = DefaultRouter()
chatRouter.register(r'api/chat', ChatAPIView, basename='chat')

# Я НЕ ЗНАЮ КАК ОБЪЯСНИТЬ НО ПОРЯДОК URL ОЧЕНЬ ВАЖЕН, ЕСЛИ ПЕРЕСТАВИТЬ МОЖЕТ ВСЁ СЛОМАТЬСЯ НАХЕР!
urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.social.urls')),

]
urlpatterns += doc_urls
urlpatterns += [re_path(r'^((?!api).)*$', TemplateView.as_view(template_name='index.html'))]
urlpatterns += tournamentRouter.urls
urlpatterns += matchRouter.urls
urlpatterns += teamRouter.urls
urlpatterns += chatRouter.urls
