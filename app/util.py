import json
from .models import Hotel, Room


def import_from_json(json_data) -> bool:
    data = json.loads(json_data)
    for hotel_data in data:
        try:
            hotel = Hotel.objects.create(
                name=hotel_data['name'],
                latitude=hotel_data['latitude'],
                longitude=hotel_data['longitude']
            )
            for room_data in hotel_data['rooms']:
                Room.objects.create(
                    hotel=hotel,
                    room_number=room_data['roomNumber'],
                    type=room_data['type'],
                    price=room_data['price'],
                    is_available=room_data['isAvailable']
                )
        except Exception as e:
            print(f'Error importing data: {e}')
            return False
    return True