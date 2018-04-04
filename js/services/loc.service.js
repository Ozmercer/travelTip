// ES6 Object shorthand syntax:
// var x = 9;
// var y = 8;

// var obj = {x, y};
// console.log('obj', obj);



var locs = [{lat: 11.22, lng: 22.11}]

function getLocs1() {
    return Promise.resolve(locs);
}

function getLocs() {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve('This is a getLocs resolve');
        }, 2000)
    });

}


function getPosition() {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({
                coords: {
                    latitude: 32.0896436,
                    longitude: 34.8016837
                }   
            })
        },5000)
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}



export default {
    getLocs :getLocs,
    getPosition: getPosition
}