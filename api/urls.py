# Create a router and register our viewsets with it.
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api import views
from api.DefaultRouterWithSimpleViews import DefaultRouterWithSimpleViews

router = DefaultRouterWithSimpleViews()
router.register(r'report', views.ReportViewSet)
router.register(r'report-form', views.ReportFormTree, basename='report-form')
router.register(r'login', views.login_, 'login')
router.register(r'logout', views.logout_view, 'logout')
router.register(r'has-access', views.has_access, 'has-access')
router.register(r'csrf', views.csrf, 'csrf')
router.register(r'get-user', views.get_user, 'get-user')
router.register(r'translation', views.TranslationViewSet, 'translation')
router.register(r'votes', views.VoteViewSetReport, 'votes')


# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls))
]
