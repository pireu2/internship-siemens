function cancelReservation(reservation_id){
    const reservationElement = document.getElementById(`reservation${reservation_id}`);
    const checkInTimeString = reservationElement.dataset.checkInTime;
    const checkInDateString = reservationElement.dataset.checkInDate;

    const currentDate = new Date();

    const checkInDate = new Date(`${checkInDateString}T` + checkInTimeString);

    const difference = checkInDate - currentDate;
    console.log(checkInDate);
    console.log(currentDate);
    console.log(difference);

    if(difference < 2 * 60 * 60 * 1000 || difference < 0){
        document.getElementById('error').innerText = 'You cannot cancel the reservation less than two hours before check-in';
        return;
    }


    url = `/cancel/`;

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
        }
        else{
            return response.text().then(text => {
                throw new Error(text);
            })
        }
    })
    .catch(error => {
        document.getElementById('error').innerText = error.message;
    });
}

function rescheduleReservation(reservation_id){
    const checkIn = document.getElementById(`checkIn${reservation_id}`).value;
    const checkOut = document.getElementById(`checkOut${reservation_id}`).value;



}