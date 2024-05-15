from django.db import models

# Create your models here.

class Hotel(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name
    

class Room(models.Model):
    SINGLE = 1
    DOUBLE = 2
    SUITE = 3
    MATRIMONIAL = 4
    ROOM_TYPES = [
        (SINGLE, 'Single'),
        (DOUBLE, 'Double'),
        (SUITE, 'Suite'),
        (MATRIMONIAL, 'Matrimonial'),
    ]

    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    room_number = models.IntegerField
    type = models.IntegerField(choices=ROOM_TYPES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)

    def get_type_display(self):
        return dict(self.ROOM_TYPES)[self.type]

    def __str__(self):
        return f'Room {self.room_number} - {self.get_type_display} at {self.hotel.name}'