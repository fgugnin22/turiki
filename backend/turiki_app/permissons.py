from rest_framework import permissions
from rest_framework.permissions import IsAdminUser, SAFE_METHODS


class IsAdminUserOrReadOnly(IsAdminUser):
    # кастомное разрешение если админ - можно делать все, если нет - только читать
    def has_permission(self, request, view) -> bool:
        is_admin = super().has_permission(request, view)
        return request.method in SAFE_METHODS or is_admin


class IsCaptainOfThisTeamOrAdmin(IsAdminUser):
    """
    Тело запроса должно включать в себя след. структуру:
    {
        "team": {
            "team_id": int
        }
    }
    """

    def has_permission(self, request, view) -> bool:
        try:
            is_admin = super().has_permission(request, view)

            if is_admin:
                return True
            # TODO: this sucks, needs to be rewritten in the near future
            try:
                players = list(view.get_object().players.values())

                is_captain = any(
                    player["team_id"] == request.user.team.id and player["team_status"] == "CAPTAIN" for player in
                    players)

                return is_captain
            except:
                pass

            try:
                xd = request.data["team"][
                         "team_id"] == request.user.team.id and request.user.team_status == "CAPTAIN"
                return xd
            except:
                pass
            return False
        except:
            # if request.user.team.id
            return False
# class IsCaptainAndPlayingThisMatch:
#     def has_permission(self, request, view) -> bool:
#         try:
#             match = view.get_object().
#         except:
#             return False
