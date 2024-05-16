function validateDates(){
    const startDate = document.getElementById('checkIn').value;
    const endDate = document.getElementById('checkOut').value;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();



    if(startDate === ''){
        document.getElementById('checkIn').setCustomValidity('Please select a check in date');
        document.getElementById('checkIn').reportValidity();
        return false;
    }

    document.getElementById('checkOut').min = startDate;
    
    if(endDate === ''){
        document.getElementById('checkOut').setCustomValidity('Please select a check out date');
        document.getElementById('checkOut').reportValidity();
        return false;
    }

    if(start > end){
        document.getElementById('checkOut').setCustomValidity('Check out date must be after check in date');
        document.getElementById('checkOut').reportValidity();
        return false;
    }


    if(start.getDate() < today.getDate() || (start.getDate() === today.getDate() && today.getHours() > 12)){
        document.getElementById('checkIn').setCustomValidity('Check in date must be after today');
        document.getElementById('checkIn').reportValidity();
        return false;
    }  

    return true;
}

function bookRoom(id){
    if (!validateDates()){
        return;
    }
    
    const startDate = document.getElementById('checkIn');
    const endDate = document.getElementById('checkOut');

    const url = `/book/${id}`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            id: id,
            start_date: startDate.value,
            end_date: endDate.value
        }),
    })
    .then(response => {
        if(response.ok){
            return response.json();
        }
        else{
            return response.json().then(data => {
                throw new Error(data.message);
            });
        }
    })
    .then(data => {
        window.location.href = '/reservations';
    })
    .catch((error) => {
        document.getElementById('error').innerText = error.message;
    });
   
}

function refreshRooms(id){
    if (!validateDates()){
        return;
    }

    const startDate = document.getElementById('checkIn').value;
    const endDate = document.getElementById('checkOut').value; 

    const url= `/get_rooms/${id}/${startDate}/${endDate}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const rooms = data.rooms;
        const roomList = document.getElementById('rooms');
        roomList.innerHTML = '';
        rooms.forEach(room => {
            const li = document.createElement('li');
            li.innerHTML = `
            <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Room: ${room.room_number}</h2>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Type: ${room.type}</p>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Price: ${room.price}$</p>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400" id="availabilityText${room.id}">${room.is_available ? room.is_booked ? 'Booked' : 'Available' : 'Not Available'}</p>
            <button id="bookButton${room.id}" ${room.is_available && !room.is_booked ? 'class=" inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"' : 'class="disabled inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"'} onclick="bookRoom('${room.id}')">Book</button>
            `;
            li.classList.add('w-full', 'p-6', 'bg-white', 'border', 'border-gray-200','rounded-lg', 'shadow', 'dark:bg-gray-800', 'dark:border-gray-700');
            roomList.appendChild(li);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const hotelId = document.getElementById('hotelId').dataset.id;
    const urlParams = new URLSearchParams(window.location.search);

    var checkInParam = '';
    var checkOutParam = '';

    if(urlParams.has('check_in')){
        document.getElementById('checkIn').value = urlParams.get('check_in');
        checkInParam = document.getElementById('checkIn').value;
    }
    if(urlParams.has('check_out')){
        document.getElementById('checkOut').value = urlParams.get('check_out');
        checkOutParam = document.getElementById('checkOut').value;
    }

    const today = new Date();
    const dateString = convertDateFormat(today.toLocaleDateString());
    const checkInDate = checkInParam || dateString;
    const checkOutDate = checkOutParam || dateString;


    document.getElementById('checkIn').min = checkInDate;
    document.getElementById('checkOut').min = checkOutDate;

    refreshRooms(hotelId);
});
