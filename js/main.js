console.log('Main!');

import locService from './services/loc.service.js'
import mapService from './services/map.service.js'

var gLoc = {};
var glocName;

// locService.getLocs()
//     .then(locs => console.log('locs', locs))

window.onload = () => {
    mapService.initMap()
        .then(
            () => {
                mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
            }
        );
    updateLocation()
}

document.querySelector('.my-location').onclick = () => {
    mapService.moveCenter(gLoc.lat, gLoc.lng)
}
document.querySelector('.update-location').onclick = () => {
    updateLocation()
}

document.querySelector('.btn1').addEventListener('click', (ev) => {
    // console.log('Aha!', ev.target);
    console.log('gLoc:', gLoc, 'loc name:', glocName)
})
document.querySelector('form').addEventListener('submit', (ev) => {
    var elInput = document.querySelector('input')
    mapService.getCoordsByName(elInput.value)
        .then(locObj => {
            console.log(locObj);
            
            mapService.addMarker(locObj);
            mapService.moveCenter(locObj.loc.lat,locObj.loc.lng)
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
            mapService.addMarker(gLoc);
            mapService.moveCenter(lat, lng);
            mapService.getLocName(gLoc)
                .then((name) => {
                    glocName = name;
                })
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}