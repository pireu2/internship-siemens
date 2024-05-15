import json

from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from .forms import UploadFileForm
from .util import import_from_json, calculate_distance

from .models import Hotel


def index(request):
    return render(request, "index.html")


def search(request):
    if request.method != "POST":
        return redirect("index")
    data = json.loads(request.body)
    latitude = float(data.get("latitude"))
    longitude = float(data.get("longitude"))
    radius = float(data.get("radius"))

    hotels = Hotel.objects.all()  # Assuming you have a Hotel model
    hotels_in_radius = []

    for hotel in hotels:
        hotel_latitude = float(hotel.latitude)
        hotel_longitude = float(hotel.longitude)
        distance = calculate_distance(
            latitude, longitude, hotel_latitude, hotel_longitude
        )
        if distance <= radius:
            hotels_in_radius.append(hotel)

    # Convert hotels_in_radius to a format suitable for JsonResponse
    hotels_data = [
        {"name": hotel.name, "latitude": hotel.latitude, "longitude": hotel.longitude}
        for hotel in hotels_in_radius
    ]

    return JsonResponse({"hotels": hotels_data})


def search(request):
    if request.method != "POST":
        return redirect("index")
    data = json.loads(request.body)
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    radius = data.get("radius")

    radius = float(radius)

    hotels = Hotel.objects.all()

    hotels_in_radius = [
        {
            "id": hotel.id,
            "name": hotel.name,
            "latitude": hotel.latitude,
            "longitude": hotel.longitude,
            "distance": calculate_distance(
                latitude, longitude, hotel.latitude, hotel.longitude
            ),
        }
        for hotel in hotels
        if calculate_distance(latitude, longitude, hotel.latitude, hotel.longitude)
        <= radius
    ]

    return JsonResponse({"hotels": hotels_in_radius})


def hotel(request, id):
    hotel = Hotel.objects.get(id=id)
    return render(request, "hotel.html", {"hotel": hotel})

def upload(request):
    if request.method == "POST":
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            file = request.FILES["file"]
            file = file.read().decode("utf-8")
            if not import_from_json(file):
                messages.error(request, "Error importing data")
                return redirect("upload")
            return redirect("index")
    else:
        form = UploadFileForm()
    return render(request, "upload.html", {"form": form})
