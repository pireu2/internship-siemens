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

    if(start < today){
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
        if(response.status === 200){
            window.location.href = '/reservations';
        }
        response.json()
    })
    .then(data => {
       
    })
    .catch((error) => {
        console.error('Error:', error);
    });
   
}

function refreshRooms(id){
    if (!validateDates()){
        console.log('Invalid dates');
        return;
    }

    const startDate = document.getElementById('checkIn').value;
    const endDate = document.getElementById('checkOut').value; 

    const url= `/get_rooms_by_hotel_and_date/${id}/${startDate}/${endDate}`;
    console.log(url);
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const rooms = data.rooms;
        const roomList = document.getElementById('rooms');
        roomList.innerHTML = '';
        rooms.forEach(room => {
            const li = document.createElement('li');
            li.innerHTML = `
            <h2>${room.room_number}</h2>
            <p>${room.type}</p>
            <p>${room.price}</p>
            <p id="availabilityText${room.id}">${room.is_available ? 'Available' : 'Not Available'}</p>
            <button id="bookButton${room.id}" ${room.is_available ? '' : 'class="disabled"'} onclick="bookRoom('${room.id}')">Book</button>
            `;
            li.classList.add('flex', 'flex-row', 'gap-3');
            roomList.appendChild(li);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    var dateString = today.toLocaleString().split('T')[0];
    
    dateString = dateString.split(' ')[0].replace(',', '');
    const date = dateString.split('/');
    const year = date[2];
    const month = (date[0] < 9) ? '0'+ date[0] : date[0];
    const day = date[1];
    dateString = `${year}-${month}-${day}`;
    
    document.getElementById('checkIn').min = dateString;
    document.getElementById('checkOut').min = dateString;
});
