console.log('Main!');

import locService from './services/loc.service.js'
import mapService from './services/map.service.js'

var gLoc = {};
var glocName;
var tempLoc;

// locService.getLocs()
//     .then(locs => console.log('locs', locs))

window.onload = () => {
    mapService.initMap()
        .then(
            () => {
                mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
                if (getParameterByName('lat')) gLoc.lat = +getParameterByName('lat');
                if (getParameterByName('lng')) gLoc.lng = +getParameterByName('lng');
                console.log('global:',gLoc);
                tempLoc = gLoc;
                newLoc(gLoc)
            }
        );
}

document.querySelector('.my-location').onclick = () => {
    mapService.moveCenter(gLoc)
}
document.querySelector('.update-location').onclick = () => {
    updateLocation()
}

document.querySelector('.btn1').addEventListener('click', (ev) => {
    // console.log('Aha!', ev.target);
    console.log('gLoc:', gLoc, 'loc name:', glocName)
})

document.querySelector('.clipboard').addEventListener('click', (ev) => {
    var elSpan = document.querySelector('.clipboard span');
    elSpan.innerHTML = window.location.href + `?lat=${tempLoc.lat}&amp;lng=${tempLoc.lng}`;
    console.log(elSpan.innerHTML);
    
})

document.querySelector('form').addEventListener('submit', (ev) => {
    var elInput = document.querySelector('input')
    mapService.getCoordsByName(elInput.value)
        .then(locObj => {
            tempLoc = {lat:locObj.loc.lat, lng:locObj.loc.lng}
            mapService.addMarker(locObj.loc);
            mapService.moveCenter(locObj.loc)
            mapService.getWeather(locObj.loc)
        })
})

function updateLocation() {
    console.log('Processing...');
    locService.getPosition()
        .then(pos => {
            let lat = pos.coords.latitude;
            let lng = pos.coords.longitude;
            console.log('User position is lat:', lat, 'lng:', lng);
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