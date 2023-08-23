from django.contrib import admin

from turiki.models import UserAccount, Team, Tournament, Match, Participant, Chat, Lobby, MapBan

# Регистриция моделей на админ панели django (/admin)
admin.site.register(UserAccount)
admin.site.register(Tournament)
admin.site.register(Team)
admin.site.register(Match)
admin.site.register(Participant)
admin.site.register(Chat)
admin.site.register(Lobby)
admin.site.register(MapBan)
