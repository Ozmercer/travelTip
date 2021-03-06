console.log('Main!');

import locService from './services/loc.service.js'
import mapService from './services/map.service.js'

var gLoc = {};
var glocName;
var tempLoc;

window.onload = () => {
    mapService.initMap()
        .then(
            () => {
                gLoc = { lat: 32.0749831, lng: 34.9120554 }; //default
                tempLoc = gLoc;
                if (getParameterByName('lat') || getParameterByName('lng')) {
                    if (getParameterByName('lat')) gLoc.lat = +getParameterByName('lat');
                    if (getParameterByName('lng')) gLoc.lng = +getParameterByName('lng');
                    console.log('global:', gLoc);
                    newLoc(gLoc)
                }
                else updateLocation()
            }
        );
}

document.querySelector('.my-location').onclick = () => {
    mapService.moveCenter(gLoc)
    mapService.getWeather(gLoc)
}
document.querySelector('.update-location').onclick = () => {
    updateLocation()
}
document.querySelector('.mobile-icon').addEventListener('click', (ev) => {
    var elModal = document.querySelector('.weather-container')
    elModal.classList.add('front')
})

document.querySelector('.clipboard').addEventListener('click', (ev) => {
    var urlIdx = window.location.href.indexOf('?');
    var url;
    if (urlIdx < 0) url = window.location.href;
    else url = window.location.href.slice(0, urlIdx);
    var elInput = document.querySelector('.clipboard input');
    elInput.value = url + `?lat=${tempLoc.lat}&lng=${tempLoc.lng}`;
    elInput.select();
    document.execCommand("Copy");
    console.log('Copied:', elInput.value);

    var elPopup = document.querySelector('.popup');
    elPopup.classList.remove('hide');
    setTimeout(()=> {
        elPopup.classList.add('hide')
    },1000)
})


document.querySelector('form').addEventListener('submit', (ev) => {
    var elInput = document.querySelector('input')
    mapService.getCoordsByName(elInput.value)
        .then(locObj => {
            tempLoc = { lat: locObj.loc.lat, lng: locObj.loc.lng }
            mapService.addMarker(locObj.loc);
            mapService.moveCenter(locObj.loc)
            mapService.getWeather(locObj.loc)
        })
})
document.querySelector('.close-modal').addEventListener('click', (ev) => {
    var elModal = document.querySelector('.weather-container')
    elModal.classList.remove('front')
})

function updateLocation() {
    locService.getPosition()
        .then(pos => {
            let lat = pos.coords.latitude;
            let lng = pos.coords.longitude;
            gLoc = { lat, lng }
            newLoc(gLoc)
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function newLoc(loc) {
    mapService.addMarker(loc);
    mapService.moveCenter(loc);
    mapService.getLocName(loc)
        .then((name) => {
            glocName = name;
            document.querySelector('.loc').innerHTML = name;
        })
    mapService.getWeather(loc)
}

