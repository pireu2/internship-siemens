function getLocation() {
    document.getElementById('location').value = 'Getting location...';
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        document.getElementById('location').value = 'Latitude: '+ latitude + '   ' + 'Longitude: ' + longitude;
    });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}

function updateRadiusSlider(value){
    document.getElementById('radius').value = value;
}

function updateNumberRadius(value){
    document.getElementById('radiusInput').value = value;
}

document.addEventListener('DOMContentLoaded', function() {
    getLocation();
});