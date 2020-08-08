// server code:
var path = require('path');
const express = require('express');
const app = express();
const axios = require('axios');

// .env config
const dotenv = require('dotenv');
dotenv.config();

/* Middleware*/
const bodyParser = require('body-parser');

// APIS
const weather_api_key = process.env.WEATHERBIT_API_KEY;
const pixabay_api_key = process.env.PIXABAY_API_KEY;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 5000;

// set dist directory for static files.
app.use(express.static('dist'));

// listen to port
let server = app.listen(PORT, function () {
    console.log('Server is listening on port 5000!')
});

// routes:
app.get('/', function (req, res) {
    res.sendFile(path.resolve('dist/index.html'));
});

app.post('/location-info', function (req, res) {
    let city = req.body.locationInput;
    let date = req.body.dateInput;
    let endDate = req.body.endDateInput;

    let tripDuration = getTripDuration(date, endDate);


    getGeoInfo(city)
        .then((geoInfo) => {
            // get the weather forecast
            getWeatherForecast(geoInfo, date)
                .then( (weatherData) => {
                    getImageOfLocation(city)
                        .then((cityImages) => {
                            res.send({locationData: geoInfo, weatherData: weatherData.data, cityImages: cityImages, duration: tripDuration});
                        });
                });
        });



});


const getGeoInfo = async (location = '') => {
    try {
        const response = await axios.get(`http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=ahmedmarzouk`);
        return {
            'lng': response.data.geonames[0].lng,
            'lat': response.data.geonames[0].lat,
            'country': response.data.geonames[0].countryName,
            'city': location,
        };
    } catch (err) {
        console.error(err);
    }
};

const getImageOfLocation = async (city = '') => {
    try {
        let url = `https://pixabay.com/api/?key=${pixabay_api_key}&q=${encodeURIComponent(city)}&image_type=photo&per_page=3`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error(err);
    }
};

const getWeatherForecast = async (geoInfo = {}, date) => {
    let days = dateDifferenceInDays(date);
    let url = `http://api.weatherbit.io/v2.0/current?key=${weather_api_key}&lat=${geoInfo.lat}&lon=${geoInfo.lng}`;
    if(days > 7){
        let lastYearDates = getLastYearDates(date);
        url = `http://api.weatherbit.io/v2.0/history/daily?key=${weather_api_key}&start_date=${lastYearDates.start}&end_date=${lastYearDates.end}&lat=${geoInfo.lat}&lon=${geoInfo.lng}` ;
    }
    try {
        const response = await axios.get(url);
        return response.data ;
    } catch (err) {
        console.error(err);
    }
};

const dateDifferenceInDays = (date) => {
    const diffTime = Math.abs(new Date() - new Date(date));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getTripDuration = (date, endDate) => {
    const diffTime = Math.abs(new Date(endDate) - new Date(date));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getLastYearDates = (date) => {
    let lastYearDate = new Date(date);
    let lastYearPlusDay = new Date(date);
    lastYearDate.setMonth(lastYearDate.getMonth() - 12);
    lastYearPlusDay.setMonth(lastYearDate.getMonth() - 12);
    lastYearPlusDay.setDate(lastYearPlusDay.getDate() + 1);

    return {
        start: lastYearDate.toISOString().split('T')[0],
        end:   lastYearPlusDay.toISOString().split('T')[0]
    };
};

module.exports = server;