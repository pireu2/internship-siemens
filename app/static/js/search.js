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
        }, function(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    document.getElementById('location').value = "User denied the request for Geolocation.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    document.getElementById('location').value = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    document.getElementById('location').value = "The request to get user location timed out.";
                    break;
                case error.UNKNOWN_ERROR:
                    document.getElementById('location').value = "An unknown error occurred.";
                    break;
            }
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
        const hotelItem = document.createElement('div');
        hotelItem.classList.add('w-full', 'p-6', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow', 'dark:bg-gray-800', 'dark:border-gray-700');

        const hotelName = document.createElement('h5');
        hotelName.classList.add('mb-2', 'text-2xl', 'font-bold', 'tracking-tight', 'text-gray-900', 'dark:text-white');
        hotelName.textContent = hotel.name;

        const hotelLocation = document.createElement('p');
        hotelLocation.classList.add('mb-3', 'font-normal', 'text-gray-700', 'dark:text-gray-400');
        hotelLocation.textContent = `Location: ${parseFloat(hotel.latitude).toFixed(2)}, ${parseFloat(hotel.longitude).toFixed(2)}`;

        const hotelDistance = document.createElement('p');
        hotelDistance.classList.add('mb-3', 'font-normal', 'text-gray-700', 'dark:text-gray-400');
        hotelDistance.textContent = `Distance: ${parseFloat(hotel.distance).toFixed(2)} km`;

        const readMoreLink = document.createElement('a');
        readMoreLink.href = '/hotel/' + hotel.id;
        readMoreLink.classList.add('inline-flex', 'items-center', 'px-3', 'py-2', 'text-sm', 'font-medium', 'text-center', 'text-white', 'bg-blue-700', 'rounded-lg', 'hover:bg-blue-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'dark:bg-blue-600', 'dark:hover:bg-blue-700', 'dark:focus:ring-blue-800');
        readMoreLink.textContent = 'View Hotel';

        hotelItem.append(hotelName, hotelLocation, hotelDistance, readMoreLink);
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