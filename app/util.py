import json
from math import radians, cos, sin, sqrt, atan2
from .models import Hotel, Room


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    try:
        lat1 = float(lat1)
        lon1 = float(lon1)
        lat2 = float(lat2)
        lon2 = float(lon2)
    except ValueError:
        return 0
    R = 6378.137

    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c  # in km


def import_from_json(json_data) -> bool:
    data = json.loads(json_data)
    for hotel_data in data:
        try:
            hotel = Hotel.objects.create(
                name=hotel_data["name"],
                latitude=hotel_data["latitude"],
                longitude=hotel_data["longitude"],
            )
            for room_data in hotel_data["rooms"]:
                Room.objects.create(
                    hotel=hotel,
                    room_number=room_data["roomNumber"],
                    type=room_data["type"],
                    price=room_data["price"],
                    is_available=room_data["isAvailable"],
                )
        except Exception as e:
            print(f"Error importing data: {e}")
            return False
    return True
