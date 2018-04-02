import { GoogleMapsApi } from './gmap.class.js';

var map;
var M_KEY = 'AIzaSyAOzqtxyN_Q_x0Ceo4up_rXc5GLN8ozwdA';
var W_KEY = '3d58c64df0e014b1f5d891aaaf78be6b';


function initMap(lat = 32.0749831, lng = 34.9120554) {

    const gmapApi = new GoogleMapsApi();
    return gmapApi.load().then(() => {
        map = new google.maps.Map(
            document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
    });


}
function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: map,
    });
}

function moveCenter(lat, lng) {
    map.setCenter({ lat, lng })
}

function getLocName(loc) {
    // var name = 'being calculated'
    return axios
            .get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.lat},${loc.lng}&key=${M_KEY}`)
            .then(res => {
                var name = res.data.results['0'].formatted_address;
                // document.querySelector('.loc').innerHTML = name;
                return name
            })
}

function getWeather(loc) {
    axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lng}&units=metric&APPID=${W_KEY}`)
        .then((weather) => {
            var data = weather.data.main;
            var desc = weather.data.weather[0].description;
            var elWeather = document.querySelector('.weather');
            getLocName(loc)
                .then(name => {
                    elWeather.innerHTML = `
                        <h2>Local weather: ${desc}</h2><br>
                        <p>Temperature: ${parseInt(data.temp)}°C</p>
                        <p>Humidity: ${data.humidity}%</p>`
                    //     <p>High: ${parseInt(data.temp_max)}°C</p>
                    //     <p>Low: ${parseInt(data.temp)}°C</p>
                    // `
                })
        })
}

function getCoordsByName(name) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${name}&key=${M_KEY}`)
            .then((coords) => {
                var locName;
                var loc = coords.data.results[0].geometry.location;
                return getLocName(loc).then(name => {
                    // locName = name                    
                    return {
                        name,
                        loc,
                    }
                })
            })
}

export default {
    initMap,
    addMarker,
    moveCenter,
    getLocName,
    getCoordsByName,
    getWeather
}

