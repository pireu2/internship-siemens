function checkTime(reservation_id){
    const reservationElement = document.getElementById(`reservation${reservation_id}`);
    const checkInTimeString = reservationElement.dataset.checkInTime;
    const checkInDateString = reservationElement.dataset.checkInDate;

    const currentDate = new Date();

    const checkInDate = new Date(`${checkInDateString}T` + checkInTimeString);

    const difference = checkInDate - currentDate;

    if(difference < 2 * 60 * 60 * 1000 || difference < 0){
        document.getElementById('error').innerText = 'You cannot cancel the reservation less than two hours before check-in';
        return false;
    }
    return true;
}



function cancelReservation(reservation_id, callback = () => {}){
    if(!checkTime(reservation_id)){
        return Promise.reject(new Error('Cannot cancel the reservation less than two hours before check-in'));
    }
    url = `/cancel/`;
    const currentDate = new Date();
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            reservation_id: reservation_id,
            current_time: currentDate.toLocaleString(),  
        }),
    })
    .then(response => {
        if(response.ok){
            document.getElementById(`reservation${reservation_id}`).remove();
            if(document.getElementById('reservations').childElementCount === 0){
                document.getElementById('reservations').innerHTML = '<li>No reservations found</li>';
            }
            callback();
        }
        else{
            return response.json().then(data => {
                throw new Error(data.message);
            });
        }
    })
    .catch(error => {
        document.getElementById('error').innerText = error.message;
    });
}

function rescheduleReservation(reservation_id,hotel_id){
    const checkIn = document.getElementById(`checkIn${reservation_id}`).innerHTML;
    const checkOut = document.getElementById(`checkOut${reservation_id}`).innerHTML;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const checkInString = convertDateFormat(checkInDate.toLocaleDateString());
    const checkOutString = convertDateFormat(checkOutDate.toLocaleDateString());

    cancelReservation(reservation_id, () => {
        window.location.href = `/hotel/${hotel_id}?check_in=${checkInString}&check_out=${checkOutString}`;
    });
}