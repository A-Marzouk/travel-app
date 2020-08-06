const errorElement = document.getElementById('errorFeedback');
let trips = getStoredTrips() ;
loadStoredTripsToDOM();

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
           addItemToDOM(tripItem);
           addItemToLocalStorage(tripItem);
        });
}

function getTripItem(response){
    return {
        id: 'tripItem_' + Math.floor(Math.random() * 1000000),
        image: response.cityImages.hits[0].largeImageURL,
        weather: {
            clouds: response.weatherData[0].clouds,
            temp: response.weatherData[0].temp,
            wind:  response.weatherData[0].wind_spd,
            description: response.weatherData[0].weather ? response.weatherData[0].weather.description : '',
            icon : response.weatherData[0].weather ? response.weatherData[0].weather.icon : ''
        },
        location: {
            city: response.locationData.city,
            country: response.locationData.country
        },
        tripDuration: response.duration
    };
}

function addItemToDOM(tripItem){
    let tripsWrapper = document.getElementById('trips');
    let newDev = document.createElement('div');
    newDev.innerHTML = `<div class="trip-item" id="tripItem_${tripItem.id}">
                <img src="${tripItem.image}" alt="city image">
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
                <div class="d-flex flex-column">
                    Trip duration: ${tripItem.tripDuration} days.
                    <button class="btn btn-primary mt-3" data-id="${tripItem.id}" id="removeTripBtn_${tripItem.id}">Remove</button>
                </div>
            </div>`;

    tripsWrapper.appendChild(newDev);
    let lineDev = document.getElementById('line-title');
    lineDev.style.display = 'block';

    let removeBtn = document.getElementById('removeTripBtn_' + tripItem.id);
    removeBtn.addEventListener('click', () => {
        removeTripItem(tripItem.id);
    });

    animationAfterAddingItem(newDev);
}

function addItemToLocalStorage(tripItem){
    trips.push(tripItem);
    localStorage.setItem( 'trips' , JSON.stringify(trips));
}

function getStoredTrips() {
    return JSON.parse(localStorage.getItem("trips") || "[]");
}

function loadStoredTripsToDOM() {
    trips.forEach( (tripItem) => {
        addItemToDOM(tripItem);
    })
}

function animationAfterAddingItem(newDev){
    let tripForm = document.getElementById('textEvaluateForm');
    tripForm.classList.add('hidden');

    // show button of add a trip
    let addTripBtn = document.getElementById('addTripBtn');
    addTripBtn.classList.add('shown');

    addTripBtn.addEventListener('click', () => {
        tripForm.classList.remove('hidden');
        addTripBtn.classList.remove('shown');
    });

    // scroll to the new added trip.
    setTimeout( () => {
        newDev.scrollIntoView({behavior: "smooth"});
    },600);
}

function validateLocation(value) {
    if(value.length > 1){
        return true;
    }

    return false;
}

function removeTripItem(tripItemID){
    // remove from array:
    trips.forEach( (tripItem, index) => {
        if (tripItem.id === tripItemID) {
            trips.splice(index, 1);
        }
    });
    // update localStorage:
    localStorage.setItem( 'trips' , JSON.stringify(trips));
    // update the DOM:
    removeTripItemFromDOM(tripItemID);
}

function removeTripItemFromDOM(tripItemID) {
    let tripItem =     document.getElementById('tripItem_' + tripItemID);
    tripItem.style.opacity = '0';
    setTimeout(() => {
        tripItem.style.display = 'none';
    },1000);
}


module.exports = {
    handleFormSubmit
} ;