import json


from datetime import date, datetime

from django.contrib.auth import login as auth_login,logout as auth_logout, authenticate
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from .forms import UploadFileForm
from .util import import_from_json, calculate_distance, make_all_rooms_available

from .models import Hotel, Room, User, Reservation


def index(request):
    return render(request, "index.html")

def login(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect("index")
        else:
            messages.error(request, "Invalid username or password")
    return render(request, "login.html")

@login_required
def logout(request):
    auth_logout(request)
    return redirect("index")

def register(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        try:
            User.objects.get(username=username)
            messages.error(request, "Username already exists")
            return redirect("register")
        except User.DoesNotExist:
            user = User.objects.create_user(username=username, password=password)
            auth_login(request, user)
            return redirect("index")
    else:
        return render(request, "register.html")


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
        make_all_rooms_available()
        form = UploadFileForm()
    return render(request, "upload.html", {"form": form})

def hotel(request, id):
    try:
        hotel = Hotel.objects.get(id=id)
    except Hotel.DoesNotExist:
        return HttpResponse("Hotel not found", status=404)

    rooms = Room.objects.filter(hotel=hotel)
    return render(request, "hotel.html", {"hotel": hotel, "rooms": rooms})


@login_required
def reservations(request):
    reservations = Reservation.objects.filter(user=request.user)
    return render(request, "reservations.html", {"reservations": reservations})

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

    return JsonResponse({"hotels": hotels_in_radius}, status=200)



@login_required
def book(request, room_id):
    if request.method != "POST":
        return redirect("index")
    try:
        room = Room.objects.get(id=room_id)
    except Room.DoesNotExist:
        return HttpResponse("Room not found", status=404)
    if not room.is_available:
        return HttpResponse("Room is not available", status=400)
    
    data = json.loads(request.body)
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

    

    if start_date >= end_date:
        return HttpResponse("Check-out date must be after check-in date", status=400)
    if start_date < datetime.now().date():
        return HttpResponse("Check-in date must be in the future", status=400)
    if end_date < datetime.now().date():
        return HttpResponse("Check-out date must be in the future", status=400)

    if room.is_booked_for(start_date, end_date):
        reservation = Reservation(
            user=request.user, room=room, check_in=start_date, check_out=end_date
        )
        reservation.save()
        return HttpResponse("Room booked successfully", status=200)
    else:
        return HttpResponse("Room is not available for the selected dates", status=400)
        

            

def get_rooms_by_hotel_and_date(request, hotel_id, start_date, end_date):
    rooms = Room.objects.filter(hotel_id=hotel_id)
    rooms_data = []
    for room in rooms:
        if room.is_booked_for(start_date, end_date):
            rooms_data.append(
                {
                    "id": room.id,
                    "room_number": room.room_number,
                    "type": room.get_type_display(),
                    "price": room.price,
                    "is_available": room.is_available,
                }
            )
    return JsonResponse({"rooms": rooms_data}, status=200)  
    

