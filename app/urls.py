from django.urls import path

from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", views.index, name="index"),
    path("upload/", views.upload, name="upload"),
    path("search/", views.search, name="search"),
    path("hotel/<int:id>", views.hotel, name="hotel"),
    path("book_room/<int:id>", views.book_room, name="book-room"),
]
