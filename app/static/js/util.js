function convertDateFormat(dateString) {
    const dateParts = dateString.split("/");
    const month = dateParts[0].length === 1 ? `0${dateParts[0]}` : dateParts[0];
    const day = dateParts[1].length === 1 ? `0${dateParts[1]}` : dateParts[1];
    return `${dateParts[2]}-${month}-${day}`;
}
