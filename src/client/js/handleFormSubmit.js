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
           let tripItem = getTripItem(response);
           addItem(tripItem);
        });
}

function getTripItem(response){
    return {
        image: response.cityImages.hits[0].largeImageURL,
        weather: {
            clouds: response.weatherData[0].clouds,
            temp: response.weatherData[0].temp,
            wind:  response.weatherData[0].wind_spd,
            description: response.weatherData[0].weather.description,
            icon : response.weatherData[0].weather.icon
        },
        location: {
            city: response.locationData.city,
            country: response.locationData.country
        },
        tripDuration: response.duration
    };
}

function addItem(tripItem){
    let tripsWrapper = document.getElementById('trips');
    let newDev = document.createElement('div');
    newDev.innerHTML = `<div class="trip-item">
                <img src="${tripItem.image}" alt="city image" id="trip-image">
                <div class="trip-info">
                    <p>City: ${tripItem.location.city}, ${tripItem.location.country}</p>
                    <p>Weather: </p>
                    <ul>
                        <li>Clouds: ${tripItem.weather.clouds}</li>
                        <li>Temp: ${tripItem.weather.temp} C° <img class="weather-icon" src="https://www.weatherbit.io/static/img/icons/${tripItem.weather.icon}.png" alt="weather icon"></li>
                        <li>Wind speed: ${tripItem.weather.wind} m/s</li>
                        <li>Description: ${tripItem.weather.description}</li>
                    </ul>
                </div>
                <div>
                    Trip duration: ${tripItem.tripDuration} days.
                </div>
            </div>`;

    tripsWrapper.appendChild(newDev);
    console.log('called');
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