from rest_framework import permissions
from rest_framework.permissions import AllowAny, DjangoModelPermissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `owner`.
        try:
            return (obj.owner == request.user or request.user.is_staff)
        except:
            return False


class IsLocalOwner(permissions.BasePermission):
    """
    Object-level permission to only allow a local member coordinator of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):

        # Instance must have an attribute named `owner`.
        try:
            list_areas_current_user = [item.id for item in request.user.coordinator_area.all()]
            for area_id in list_areas_current_user:
                if area_id in [item.id for item in obj.owner.all()] or request.user.is_staff:
                    return True
        except:
            return False
        return False


class IsCoordinatorOrReadOnly(permissions.BasePermission):
    """
    Allow coordinator to access dangerous method and
    other users to view them.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `owner`.
        try:
            return request.user.is_coordinator
        except:
            return False


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allow coordinator to access dangerous method and
    other users to view them.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # We just check if request user is staff.
        try:
            return request.user.is_staff
        except:
            return False


class IsUser(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):

        # Instance is of type user
        try:
            return obj == request.user
        except:
            return False


class ActionBasedPermission(AllowAny):
    """
    Grant or deny access to a view, based on a mapping in view.action_permissions
    """

    def has_permission(self, request, view):
        for klass, actions in getattr(view, 'action_permissions', {}).items():
            if view.action in actions:
                return klass().has_permission(request, view)
        return False
