from rest_framework import permissions


class IsCoordinatorPermission(permissions.BasePermission):
    """
    Global permission check for blocked IPs.
    """

    def has_permission(self, request, view):
        try:
            if request.user.is_coordinator:
                return True
            else:
                return False
        except:
            return False