from django.contrib import admin

from turiki.models import UserAccount, Team, Tournament, Match, Participant

# Register your models here.
admin.site.register(UserAccount)
admin.site.register(Tournament)
admin.site.register(Team)
admin.site.register(Match)
admin.site.register(Participant)
