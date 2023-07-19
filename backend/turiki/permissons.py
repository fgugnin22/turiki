from rest_framework import permissions
from rest_framework.permissions import IsAdminUser, SAFE_METHODS


class IsAdminUserOrReadOnly(IsAdminUser):
    # кастомное разрешение если админ - можно делать все, если нет - только читать
    def has_permission(self, request, view) -> bool:
        is_admin = super().has_permission(request, view)
        # Python3: is_admin = super().has_permission(request, view)
        return request.method in SAFE_METHODS or is_admin


class IsCaptainOfThisTeamOrAdmin(IsAdminUser):
    def has_permission(self, request, view) -> bool:
        try:
            is_admin = super().has_permission(request, view)
            if is_admin:
                return True
            xd = request.data["team"]["team_id"] == request.user.team.id
            return xd
        except:
            return False
