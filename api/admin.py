from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin

from api.forms import CustomUserCreationForm, CustomUserChangeForm
from api.models import CustomUser, Report, Votes, KeyValidator, RestPassword, ReportImage


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('email', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('email', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Report)
admin.site.register(Votes)
admin.site.register(KeyValidator)
admin.site.register(RestPassword)
admin.site.register(ReportImage)
