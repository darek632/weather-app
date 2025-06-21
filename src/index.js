import "./styles.css";
import { bitchPls } from "./greeting.js";

console.log(bitchPls);


async function fetchCambridge() { 

    const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/cambridge?key=3SR4H2HGH9QR4S5TEL3GSDADS', {mode: 'cors'});
    const camData = await response.json();
    console.log(camData);

    return camData;
}




async function toRequiredData() { 

    const dataPromise = await fetchCambridge();

    const essentialData = {};

    essentialData["location"] = dataPromise.resolvedAddress;
    essentialData["tempNow"] = dataPromise.currentConditions.temp;
    essentialData["humidity"] = dataPromise.currentConditions.humidity;
    essentialData["precipitationProbability"] = dataPromise.currentConditions.precipprob;
    essentialData["sunrise"] = dataPromise.currentConditions.sunrise;
    essentialData["sunset"] = dataPromise.currentConditions.sunset;

    

    console.log(essentialData);
}


function fetchSearchLocation(location) { 
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=3SR4H2HGH9QR4S5TEL3GSDADS`;
    
    // returning the fetch chain so i can use it in an async/await function down the line
 fetch(url, {mode: 'cors'})
        .then(function(response) { 
            if(!response.ok) { 
                throw new Error(`Uh oh, something's not right. Status: ${response.status}`);
            } else {
                return response.json();
            }
        })
        .then(function(data) { 

        
            if (!data || Object.keys(data).length === 0) { 
                console.log("No location found. Please try again searching for a city or country.");

                // logic for what happens when unable to find search. likely fetch some predetermined location. 
            } else { 
                console.log("Search location:",  data);
            }
        })
        .catch(function(error) { 
            console.log("Error fetching weather:", error)
        })

}


// ABOVE CODE: PRACTICE API F() and JSON to STREAMLINED DATA f(). Does not work dynamically but starting point. below code used for actual app. 

// converting above to an await/async f

async function fetchAsSearchLocation(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=3SR4H2HGH9QR4S5TEL3GSDADS`;
    
    try { 
        const response = await  fetch(url, {mode: 'cors'});
        //check response status for network errors
        if(!response.ok) { 
            throw new Error(`Uh oh, something's not right. Status:", ${response.status}`);
        }
        // transform data to json for use
        const data = await response.json();


        //check if data is available/exists

        if(!data || Object.keys(data).length === 0) { 
            console.log("No location found. Please try again searching for a location, city or country.");

            // logic if the API request is empty
           return null;
        }

        // if it does exist then we log

        console.log("Search location:", data)
        return data;

    } catch(err) { 
        console.log("Error fetching weather:" , err.message);
        return null
    }
    


}

// fetchAsSearchLocation("rzeszow");

async function getRequiredData(searchLocation) { 

    const searchData = await fetchAsSearchLocation(searchLocation);

    if(!searchData) { 
        console.log("No valid data to use.")
        return null;
    } 


    const essentialData = {
        location: searchData.resolvedAddress,
        tempNow: searchData.currentConditions.temp,
        humidity: searchData.currentConditions.humidity,
        description: searchData.currentConditions.conditions,
        precipitationProbability: searchData.currentConditions.precipprob,
        sunrise: searchData.currentConditions.sunrise,
        sunset: searchData.currentConditions.sunset

    }

    console.log("Essential Data:" , essentialData);

    return essentialData;
}



const searchForm = document.querySelector("#search-bar");


searchForm.addEventListener("submit", async (event) => { 

    // async event so that we can use await and get the actual data we need from fetchobject
    // const sample = await fetchCambridge();
    // console.log(sample);
    event.preventDefault();
    const form = event.target;
    const search = form.elements["location-search"];
    let searchValue = search.value;
    form.elements["location-search"].value = '';
    

    // logic if search bar is empty

    if(searchValue === "") { 
        return;
    } else { 

    const result = await getRequiredData(searchValue);
    const description = result["description"];
    console.log(typeof result);

    let UiHolder = displayUI(result);
    console.log(description);
    switchToF();
    getWeatherIcon(description);
    
    }


    


    

   
    // getRequiredData();
   

});

// what does this function need as input and what will it output 
//needs the fulfilled promise of the getRequiredData with the searchvalue passed through as parameter

const card = document.querySelector("#weather-card");

function displayUI(reqData) {
    const wordy = reqData["description"];
    // get description word from object

    const UiObject = {};
   document.querySelectorAll("[data-key]").forEach( el => { 
        console.log(el);
        const key = el.dataset.key;
        console.log(key);
        el.textContent = reqData[key];


        // UIObject[key] = reqData[key];

        // UIObject[key] = reqData[key];

    })

    displaySvg(wordy);
    // use outer function to call the getSVG f and assign it to src
}

//helper function to assing the SVG to img src


function displaySvg(description) {
    const image = document.querySelector('#weather-icon');
    image.src = getWeatherIcon(description);
};

function fahrenheitToC(temp) {
    // °C = (°F - 32) × 5/9
    // °F = (°C × 9/5) + 32
    let result = (temp - 32)* (5/9);

    return result.toFixed();


}

function celciusToF(temp) { 
    let result = (temp*(9/5))+32;
    return result.toFixed();

}

const unit = document.querySelector(".temp-unit");

function changeTempUnit() { 
   
    const currentTemp = document.querySelector("#temp-now");
    let currentTempValue = Number(currentTemp.textContent); 
    console.log(currentTempValue);

    if(unit.textContent.includes("F")) { 
        currentTemp.textContent = fahrenheitToC(currentTempValue);

        unit.textContent = "°C";

    } else { 
        currentTemp.textContent = celciusToF(currentTempValue);
        unit.textContent = "°F";
    }


}

function switchToF() { 
    const radioSlider = document.querySelector("input[type='checkbox']");
    console.log(radioSlider);
    radioSlider.checked = false;
    unit.textContent = "°F";

}




const tempSwitch = document.querySelector('#temp-change');

console.log(tempSwitch);


tempSwitch.addEventListener('change', changeTempUnit);


// Load default CAMBS on page load

window.addEventListener("DOMContentLoaded",  async () => { 

    let opening = await getRequiredData("Cambridge");
    displayUI(opening);
   // this is good


});

const icons = require.context('./icons',false, /\.svg$/);

function getWeatherIcon(description) { 
    const desc = description.toLowerCase();
    const map = { 
        clear: 'day.svg',
        rain: 'rainy-4.svg',
        cloudy: 'cloudy-day-1.svg',
        overcast: 'cloudy.svg',
        snowy: 'snowy-5.svg'
    };

    const key = Object.keys(map).find(key => desc.includes(key));
    const filename = key ? map[key] : 'default.svg';

    return icons(`./${filename}`);
}

// TO DO STILL: 
// allocate specific time blocks to prevent this from dragging on. Main part of learning has been done (using APIs). 
// while other parts that i'm rusty on are important, good to keep moving forward
// SWITCH is not working properly. Don't like it 

// - CREATE RADIO BUTTONS in HTML instead of the 'fancy' switch - 25
// - CONNECT the buttons to API Call or CALC functions, reset to default on search to prevent issues - 25
//- EITHER GET API CALL USING C if radio pressed, or stick with calcs - 25
// - LOOK into DYNAMIC IMPORTS for the graphics on each search. - 25
// - APPLY dynamic imports to work with the intended graphics - match description with graphic? - 25 (possibly x2)
// - FIND SVG libary that has weather images - 25
// - FINAL STYLING UPDATES TO STICK TO WEATHER AESTHETHICS - neutral light color font, bluey bg - 25
// EXPECTED TIME TO FINISH: 4H!



















