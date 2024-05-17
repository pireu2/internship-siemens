from django.urls import path

from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", views.index, name="index"),
    path("upload/", views.upload, name="upload"),
    path("hotel/<int:id>", views.hotel, name="hotel"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("register/", views.register, name="register"),
    path("reservations/", views.reservations, name="reservations"),
    

    #API
    path("submit_feedback/<int:reservation_id>/", views.submit_feedback, name="submit_feedback"),
    path("search/", views.search, name="search"),
    path("get_rooms/<int:hotel_id>/<str:start_date>/<str:end_date>", views.get_rooms, name="get_rooms"),
    path("book/<int:room_id>", views.book, name="book"),
    path("cancel/", views.cancel, name="cancel")
]
