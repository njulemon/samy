from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin

from api.forms import CustomUserCreationForm, CustomUserChangeForm
from api.models import CustomUser, Report, Votes, KeyValidator, RestPassword, ReportImage, AuthorizedMail, Area, \
    ReportAnnotation, ReportAnnotationComment, Notifications, Document, TokenURL


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active', 'is_coordinator', 'date_joined')
    list_filter = ('email', 'is_staff', 'is_active', 'is_coordinator')
    fieldsets = (
        (None, {'fields': ('email', 'password', 'first_name', 'last_name', 'alias')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
        ('Notifications', {'fields': ('notifications',)}),
        ('Coordinator', {'fields': ('is_coordinator', 'coordinator_area')})
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email', 'alias')
    ordering = ('email',)


class AreaAdmin(admin.ModelAdmin):
    search_fields = ('name',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Report)
admin.site.register(Votes)
admin.site.register(KeyValidator)
admin.site.register(RestPassword)
admin.site.register(ReportImage)
admin.site.register(AuthorizedMail)
admin.site.register(Area, AreaAdmin)
admin.site.register(ReportAnnotation)
admin.site.register(ReportAnnotationComment)
admin.site.register(Notifications)
admin.site.register(Document)
admin.site.register(TokenURL)

