"""
URL configuration for core project.

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
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from turiki_app.views import TournamentAPIView, MatchAPIView, TeamAPIView, ChatAPIView, UserAPIView
from rest_framework.routers import DefaultRouter

from . import settings
# from .yasg import urlpatterns as doc_urls

# с помощью defaultrouter'а регистрируем api маршруты
tournamentRouter = DefaultRouter()
tournamentRouter.register(r'api/v2/tournament', TournamentAPIView, basename='tournament')

matchRouter = DefaultRouter()
matchRouter.register(r'api/v2/match', MatchAPIView, basename='match')

teamRouter = DefaultRouter()
teamRouter.register('api/v2/team', TeamAPIView, basename='team')

chatRouter = DefaultRouter()
chatRouter.register(r'api/v2/chat', ChatAPIView, basename='chat')

userRouter = DefaultRouter()
userRouter.register(r'api/v2/user', UserAPIView, basename='user')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.social.urls')),

]
# urlpatterns += doc_urls
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += [re_path(r'^((?!api/v2).)*$', TemplateView.as_view(template_name='index.html'))]
urlpatterns += tournamentRouter.urls
urlpatterns += matchRouter.urls
urlpatterns += teamRouter.urls
urlpatterns += chatRouter.urls
urlpatterns += userRouter.urls
