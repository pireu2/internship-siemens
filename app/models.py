from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Q

# Create your models here.


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    
    def __str__(self):
        return self.username

class Hotel(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    check_in_time = models.TimeField(default='14:00:00')
    check_out_time = models.TimeField(default='12:00:00')

    def __str__(self):
        return self.name

class Room(models.Model):
    SINGLE = 1
    DOUBLE = 2
    SUITE = 3
    MATRIMONIAL = 4
    ROOM_TYPES = [
        (SINGLE, "Single"),
        (DOUBLE, "Double"),
    (SUITE, "Suite"),
        (MATRIMONIAL, "Matrimonial"),
    ]

    id = models.AutoField(primary_key=True)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="rooms")
    room_number = models.IntegerField(default=0)
    type = models.IntegerField(choices=ROOM_TYPES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)
    is_booked = models.BooleanField(default=False)

    def is_available_for(self, check_in, check_out):
        overlapping_reservations = Reservation.objects.filter(
            Q(room=self),
            Q(check_in__lte=check_out, check_out__gte=check_in)
        )
        return overlapping_reservations.count() == 0

    def get_type_display(self):
        return dict(self.ROOM_TYPES)[self.type]

    def __str__(self):
        return (
            f"Room {self.room_number} - {self.get_type_display()} at {self.hotel.name}"
        )
    
class Reservation(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reservations")
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="reservations")
    check_in = models.DateField()
    check_out = models.DateField()

    def __str__(self):
        return f"{self.user} - {self.room} - {self.check_in} - {self.check_out}"
