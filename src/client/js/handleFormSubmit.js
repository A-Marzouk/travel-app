// make sure to export the function you would like to import

const errorElement = document.getElementById('errorFeedback');
const evaluationElement = document.getElementById('evaluation');
const evaluationElementWrapper = document.getElementById('evaluationWrapper');

function handleFormSubmit(event) {
    errorElement.innerText = '';
    event.preventDefault();

    // take the value entered in the input
    let locationInput = document.getElementById('locationInput').value;
    let dateInput = document.getElementById('dateInput').value;

    // validate the form input
    if (!validateLocation(locationInput)) {
        // update error layout
        errorElement.innerText = 'Not valid.';
        return;
    }

    // send it to the server ( to get info through the API )
    Client.postData('/location-info', {locationInput: locationInput, dateInput: dateInput})
        .then((response) => {
            // update layout with result from server:
            console.log(response);
            evaluationElement.innerHTML = response.locationData;
            evaluationElementWrapper.style.display = 'block';
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