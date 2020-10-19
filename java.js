// elements
const inputEl = document.getElementById("city-input");
const searchEl = document.getElementById("searchBtn");
const historyEl = document.getElementById("history");
const clearEl = document.getElementById("clear-history");
const cityEl = document.getElementById("city-name");
const temperatureEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");
const UVElement = document.getElementById("UV-index");
const pictureEl = document.getElementById("weather-pic");
const forecastEls = document.querySelectorAll(".days");

function pageGenerate() {

  
    const APIKey = "4c56979874845d3177ce813ce4e4b00f"
  
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
      
    function getWeather(cityName) {
      let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`;
      axios.get(queryURL)
  
      .then(function(response){          
        const currentDate = new Date(response.data.dt*1000);
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
  

        cityEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
        let weatherPic = response.data.weather[0].icon;

        pictureEl.setAttribute("src",`https://openweathermap.org/img/wn/${weatherPic}@2x.png`);

        pictureEl.setAttribute("alt",response.data.weather[0].description);
     
        temperatureEl.innerHTML = "Temperature: " + degree(response.data.main.temp) + " &#176F";
        
        humidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
        
        windSpeedEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
  
      
      let latitude = response.data.coord.lat;
      let longitude = response.data.coord.lon;
      let UVQueryURL = `https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${latitude}&lon=${longitude}&appid=${APIKey}&cnt=1`;
      axios.get(UVQueryURL)
      .then(function(response){
        let UVIndex = document.createElement("span");
        UVIndex.setAttribute("class","badge badge-danger");
        UVIndex.innerHTML = response.data[0].value;
        UVElement.innerHTML = "UV Index: ";
        UVElement.append(UVIndex);
      });
  
      
      let cityID = response.data.id;
      let forecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${APIKey}`;
      axios.get(forecastQueryURL)
      .then(function(response){
        for (i=0; i<forecastEls.length; i++) {
            forecastEls[i].innerHTML = "";
            const forecastIndex = i * 8 + 4;
            const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
            const forecastDay = forecastDate.getDate();
            const forecastMonth = forecastDate.getMonth() + 1;
            const forecastYear = forecastDate.getFullYear();
            const forecastDateEl = document.createElement("p");
          
            forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
            forecastEls[i].append(forecastDateEl);
            const forecastWeatherEl = document.createElement("img");
  
            forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
            forecastWeatherEl.setAttribute("alt",response.data.list[forecastIndex].weather[0].description);
            forecastEls[i].append(forecastWeatherEl);
            const forecastTempEl = document.createElement("p");
  
            forecastTempEl.innerHTML = "Temp: " + degree(response.data.list[forecastIndex].main.temp) + " &#176F";
            forecastEls[i].append(forecastTempEl);
            const forecastHumidityEl = document.createElement("p");
  
            forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
            forecastEls[i].append(forecastHumidityEl);
            }
        })
      });  
    }
  
    searchEl.addEventListener("click",function() {
      const searchTerm = inputEl.value;
  
      getWeather(searchTerm);
      searchHistory.push(searchTerm);
      localStorage.setItem("search",JSON.stringify(searchHistory));
      renderSearchHistory();
    }) 
  
    clearEl.addEventListener("click",function() {
      searchHistory = [];
      localStorage.clear();
      renderSearchHistory();
    })
  
    function degree(K) {
      return Math.floor((K - 273.15) * 1.8 + 32);
    }
  
    function renderSearchHistory() {
      historyEl.innerHTML = "";
      for (let i = 0; i < searchHistory.length; i++) {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("type","text");
        historyItem.setAttribute("readonly",true);
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click",function() {
          getWeather(historyItem.value);
        })
        historyEl.append(historyItem);
      }
    }
  
    renderSearchHistory();
    if (searchHistory.length > 0) {
      getWeather(searchHistory[searchHistory.length - 1]);
    }
  }
  
  pageGenerate();