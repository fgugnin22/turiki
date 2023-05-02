from django.contrib import admin

from accounts.models import UserAccount, Team, Tournament, Match

# Register your models here.
admin.site.register(UserAccount)
admin.site.register(Tournament)
admin.site.register(Team)
admin.site.register(Match)
