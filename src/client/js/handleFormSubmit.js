// make sure to export the function you would like to import

const errorElement = document.getElementById('errorFeedback');



function handleFormSubmit(event) {
    errorElement.innerText = '';
    event.preventDefault();

    // take the value entered in the input
    let locationInput = document.getElementById('locationInput').value;
    let dateInput = document.getElementById('dateInput').value;
    let endDateInput = document.getElementById('dateInputEnd').value;

    // validate the form input
    if (!validateLocation(locationInput)) {
        // update error layout
        errorElement.innerText = 'Not valid.';
        return;
    }

    // send it to the server ( to get info through the API )
    Client.postData('/location-info', {locationInput: locationInput, dateInput: dateInput, endDateInput:endDateInput})
        .then((response) => {
            // update layout with result from server:
            console.log(response);
        });


}

function validateLocation(value) {
    if(value.length > 1){
        return true;
    }

    return false;
}

module.exports = {
    handleFormSubmit
} ;