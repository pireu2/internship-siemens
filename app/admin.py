from django.contrib import admin
from .models import Hotel, Room, Reservation, User

# Register your models here.

admin.site.register(Hotel)
admin.site.register(Room)
admin.site.register(Reservation)
admin.site.register(User)
