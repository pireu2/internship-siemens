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

function submitFeedback(reservation_id){
    const feedback = document.getElementById(`feedback${reservation_id}`).value;
    url = `/submit_feedback/${reservation_id}/`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            reservation_id: reservation_id,
            feedback: feedback,
        }),
    })
    .then(response => {
        if(response.ok){
            if (feedback === ''){
                document.getElementById(`submitButton${reservation_id}`).innerHTML = 'Submit';
            }
            else{ 
                document.getElementById(`submitButton${reservation_id}`).innerHTML = 'Change Feedback';
            };
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


function cancelReservation(reservation_id, callback = () => {}){
    if(!checkTime(reservation_id)){
        return;
    }
    url = `/cancel/`;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1) < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();

    const dateTime = `${currentYear}/${currentMonth}/${currentDay} ${currentHour}:${currentMinute}:${currentSecond}`;
    console.log(dateTime);
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            reservation_id: reservation_id,
            current_time: dateTime,  
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