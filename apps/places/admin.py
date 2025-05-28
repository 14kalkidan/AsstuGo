# from django.contrib import admin
# from .models import Place, Event, GalleryImage, Category

# admin.site.register(Place)
# admin.site.register(Event)
# admin.site.register(GalleryImage)
# admin.site.register(Category)

from django.contrib import admin
from .models import Place, Event, GalleryImage, Category

@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'latitude', 'longitude')
    list_filter = ('category',)
    search_fields = ('name', 'description')
    ordering = ('name',)
    actions = ['mark_as_featured']

    def mark_as_featured(self, request, queryset):
        queryset.update(category='featured')  # Example action
        self.message_user(request, "Selected places have been marked as featured.")
    mark_as_featured.short_description = "Mark selected places as featured"

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'start_date', 'end_date', 'category', 'status')
    list_filter = ('start_date', 'category', 'location')
    search_fields = ('title', 'description')
    date_hierarchy = 'start_date'
    ordering = ('-start_date',)

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'uploaded_by', 'created_at', 'approved')
    list_filter = ('created_at', 'approved', 'uploaded_by')
    search_fields = ('title_en', 'title_am', 'description_en', 'description_am')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)