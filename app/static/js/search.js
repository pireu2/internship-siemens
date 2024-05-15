function getLocation() {
    document.getElementById('location').value = 'Getting location...';
    document.getElementById('searchButton').disabled = true;
    document.getElementById('searchButton').classList.add('disabled');
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        document.getElementById('location').value = 'Latitude: '+ latitude + '   ' + 'Longitude: ' + longitude;
        document.getElementById('searchButton').disabled = false;
        document.getElementById('searchButton').classList.remove('disabled');
    });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}

function updateRadiusSlider(value){
    document.getElementById('radius').value = value * 10;
}

function updateNumberRadius(value){
    document.getElementById('radiusInput').value = value / 10;
}

function displayHotels(hotels){
    const hotelsList = document.getElementById('hotelsList');
    hotelsList.innerHTML = '';
    if (hotels.length === 0){
        const hotelItem = document.createElement('li');
        hotelItem.innerHTML = 'No hotels found';
        hotelsList.appendChild(hotelItem);
        return;
    }
    hotels.forEach(hotel => {
        const hotelItem = document.createElement('li');
        hotelItem.innerHTML = hotel.name + ' - ' + hotel.latitude + ' - ' + hotel.longitude + ' - ' + hotel.distance + ' km';
        hotelItem.addEventListener('click', function(){
            window.location.href = '/hotel/' + hotel.id;
        });
        hotelsList.appendChild(hotelItem);
    });
}

function search(){
    const location = document.getElementById('location').value;
    const radius = document.getElementById('radiusInput').value;

    const latitude = location.split(' ')[1];
    const longitude = location.split(' ')[5];

    fetch('/search/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            radius: radius
        })
    })
    .then(response => response.json())
    .then(data => {
        displayHotels(data.hotels);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('radius').value = 10;
    document.getElementById('radiusInput').value = 1;
    getLocation();
});