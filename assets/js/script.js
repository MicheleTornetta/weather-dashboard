function addLocations(){

  let storedLocationEl = document.getElementById("savedLocation");
  let locations = getLocations();
  storedLocationEl.innerHTML = "";
  for(let i = 0; i < locations.length; i++){
    console.log(locations[i]);
    let listEl = document.createElement("li");
    let buttonEl = document.createElement("button");
    buttonEl.innerText = locations[i].city + "," + locations[i].state;

    buttonEl.onclick = function() {
      document.getElementById("city").value = locations[i].city;
      document.getElementById("state").value = locations[i].state;

      searchLocation();
    };

    listEl.appendChild(buttonEl);
    storedLocationEl.appendChild(listEl);
  }
}
addLocations();

const APIKey = "b8df162a76d2059ce6e51124287429ea";

let userContainerEl = document.getElementById("savedLocation");
let fetchButtonEl = document.getElementById("locationButton");
//button handler which calls search location
fetchButtonEl.addEventListener("click", searchLocation);
searchLocation();
//to get locations from local storage

function getLocations() {
  let locations = localStorage.getItem("savedLocations");
  if (locations === null) {
    locations = [];
  } else {
    locations = JSON.parse(locations);
  }
  return locations;
}


//to save the location
function saveLocation(city, state) {
  let currentLocation = getLocations();
  let location = {
    city: city, 
    state: state
  };

  let found = false;

  for (let i = 0; i < currentLocation.length; i++) {
    if (currentLocation[i].city === city && currentLocation[i].state === state) {
      found = true;
    }
  }

  if (!found) {
    currentLocation.push(location);
  }

  localStorage.setItem('savedLocations', JSON.stringify(currentLocation));

}

//city and state box
function searchLocation() {
  let forecastEl = document.getElementById("forecast5day");
  forecastEl.innerHTML = "";
  let city = document.getElementById("city").value;
  let state = document.getElementById("state").value;

  saveLocation(city, state);
  addLocations();
  let cityEl = document.getElementById("typedCity");
  cityEl.innerText=city

  //api url
  const requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "," + state + ",US&appid=" + APIKey + "&units=imperial";
  
  //get current day forcast - using [0] at the top
  
  //get 5 day forcast - using array numbers that pushes out to the next day 
  fetch(requestUrl).then(function (response) {
    response.json().then(function (weatherData) {

      const todayData = weatherData.list[0];
         
        // creating elements for data to attach too
        let currentForcastBoxEl = document.getElementById("currentWeatherBox");
        currentForcastBoxEl.innerHTML = "";
        let currentDateEl = document.createElement("p");
        let currentImageEl = document.createElement("img");
        let currentTempEl = document.createElement("p");
        let currentWindEl = document.createElement("p");
        let currentHumidityEl = document.createElement("p");

        //adding boxes divs and p's for the elements
        currentForcastBoxEl.appendChild(currentDateEl);
        currentForcastBoxEl.appendChild(currentImageEl);
        currentForcastBoxEl.appendChild(currentTempEl);
        currentForcastBoxEl.appendChild(currentWindEl);
        currentForcastBoxEl.appendChild(currentHumidityEl);

        //placing element into the html
        currentDateEl.innerText = new Date(todayData.dt * 1000).toLocaleDateString();
        currentImageEl.innerText = todayData.weather[0].icon;
        currentWindEl.innerText = "Wind Speed " + todayData.wind.speed + "MPH";
        currentTempEl.innerText = "Temperature " + todayData.main.temp + "\u00b0";
        currentHumidityEl.innerText = "Humidity " + todayData.main.humidity + "%";
        const currentImageSource =
          "http://openweathermap.org/img/w/" + todayData.weather[0].icon + ".png";
        currentImageEl.src = currentImageSource;

      const weatherIndices = [8, 16, 24, 32, 39];
      // console.log(weatherData);
      for (let i = 0; i < weatherIndices.length; i++) {
        const data = weatherData.list[weatherIndices[i]];
       
        // creating elements for data to attach too

        let weatherForcastBoxEl = document.createElement("div");
        let dateEl = document.createElement("p");
        let imageEl = document.createElement("img");
        let tempEl = document.createElement("p");
        let windEl = document.createElement("p");
        let humidityEl = document.createElement("p");

        //adding boxes divs and p's for the elements
        forecastEl.appendChild(weatherForcastBoxEl);
        weatherForcastBoxEl.appendChild(dateEl);
        weatherForcastBoxEl.appendChild(imageEl);
        weatherForcastBoxEl.appendChild(tempEl);
        weatherForcastBoxEl.appendChild(windEl);
        weatherForcastBoxEl.appendChild(humidityEl);

        //placing element into the html
        dateEl.innerText = new Date(data.dt * 1000).toLocaleDateString();
        imageEl.innerText = data.weather[0].icon;
        windEl.innerText = "Wind Speed " + data.wind.speed + "MPH";
        tempEl.innerText = "Temperature " + data.main.temp + "\u00b0";
        humidityEl.innerText = "Humidity " + data.main.humidity + "%";
        const imageSource =
          "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
        imageEl.src = imageSource;
      }
    });
  });
}
