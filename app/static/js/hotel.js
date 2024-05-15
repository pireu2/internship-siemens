function bookRoom(id){
    fetch(`/book_room/${id}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            room_id: id
        })
    })
    .then(response => {
        if (!response.ok){
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const button = document.getElementById(`bookButton${id}`);
        const availabilityText = document.getElementById(`availabilityText${id}`);

        button.classList.add('disabled');
        availabilityText.innerHTML = 'Not Available';
    })
    .catch((error) => {
        alert('Error:', error.message);
    });
}