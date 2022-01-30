var today = moment().format("L");
console.log(today);

var cities = [];
var cityInputEl = document.getElementById("cityInput");
var weatherContentEl = document.getElementById("weatherContent");
var citySearchEl = document.getElementById("citySearch");
var weather5DayEl = document.getElementById("fiveDay");
var searchHistoryEl = document.getElementById("searchHistory");
var currentWeatherEl = document.getElementById("currentWeather");

var getWeather = function (event) {
  event.preventDefault();
  var city = cityInputEl.value.trim();

  if (city) {
    getCityWeather(city);
    get5DayWeather(city);
    cities.push(city);
    cityInputEl.value = "";

  } else {
    alert("Please enter a City");
  }
  saveSearch();
  renderSearch();
  //searchHistory(city);
}

var saveSearch = function () {
  localStorage.setItem("cities", JSON.stringify(cities));
};

function renderSearch() {
  searchHistoryEl.innerHTML = "";
  for (var i = 0; i < cities.length; i++) {
    var button = document.createElement("button");
    button.classList = "btn-outline-secondary";
    button.setAttribute("value", cities[i]);
    button.textContent = cities[i];
    searchHistoryEl.appendChild(button);
  }
}

var getCityWeather = function (city) {
  var apiKey = "60b403ea2e2e0ddffaf71ee67603d08e";
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  fetch(apiUrl)
    .then(function (response) {
      response.json().then(function (data) {
        showWeather(data, city);
      });
    });
};

var showWeather = function (weather, cities) {

  currentWeatherEl.textContent = cities;
  currentWeatherEl.classList = "card bg-primary text-center";

  var date = document.createElement("h4");
  date.classList = "card-body text-light m-2";
  date.textContent = moment(weather.dt.value).format("MMM D, YYYY");
  currentWeatherEl.appendChild(date);

  var weatherIcon = document.createElement("img")
  weatherIcon.classList = "card-body text-center";
  weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
  currentWeatherEl.appendChild(weatherIcon);

  var tempEl = document.createElement("h5");
  tempEl.classList = "card-body text-light";
  tempEl.textContent = "Temperature: " + weather.main.temp + " °F";
  currentWeatherEl.appendChild(tempEl);

  var humidityEl = document.createElement("h6");
  humidityEl.classList = "card-body text-light";
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
  currentWeatherEl.appendChild(humidityEl);

  var windEl = document.createElement("h6");
  windEl.classList = "card-body text-light";
  windEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
  currentWeatherEl.appendChild(windEl);

  var lat = weather.coord.lat;
  var lon = weather.coord.lon;
  getUvIndex(lat, lon)
}

var getUvIndex = function (lat, lon) {
  var apiKey = "60b403ea2e2e0ddffaf71ee67603d08e";
  var apiUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
  fetch(apiUrl)
    .then(function (response) {
      response.json().then(function (data) {
        uvIndex(data)
      });
    });
  console.log(lat);
  console.log(lon);
}

var uvIndex = function (index) {
  var uvIndexEl = document.createElement("h6");
  uvIndexEl.classList = "card-body text-light";
  uvIndexEl.textContent = "UV Index: " + index.value;
  currentWeatherEl.appendChild(uvIndexEl);

  //searchHistory ()
}

var get5DayWeather = function (city) {
  var apiKey = "60b403ea2e2e0ddffaf71ee67603d08e";
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

  fetch(apiUrl)
    .then(function (response) {
      response.json().then(function (data) {
        show5DayWeather(data);
      });
    });
};

var show5DayWeather = function (weather) {
  // var element = document.getElementById("hide");
  //   Element.classList.remove("hide5Day");
  weather5DayEl.textContent = "";

  var forecast = weather.list;
  for (var i = 5; i < forecast.length; i = i + 8) {
    var dailyForecast = forecast[i];

    var forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-primary text-light m-2";
    weather5DayEl.appendChild(forecastEl);

    var forecastDate = document.createElement("h5")
    forecastDate.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
    forecastDate.classList = "card-header text-center"
    forecastEl.appendChild(forecastDate);

    var forecastIcon = document.createElement("img")
    forecastIcon.classList = "card-body text-center";
    forecastIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);
    forecastEl.appendChild(forecastIcon);

    var forecastTempEl = document.createElement("span");
    forecastTempEl.classList = "card-body text-center";
    forecastTempEl.textContent = dailyForecast.main.temp + " °F";
    forecastEl.appendChild(forecastTempEl);

    var forecastHumidityEl = document.createElement("span");
    forecastHumidityEl.classList = "card-body text-center";
    forecastHumidityEl.textContent = dailyForecast.main.humidity + "  %";
    forecastEl.appendChild(forecastHumidityEl);
  }
}

function handleSearchBtn(event) {
  var btn = event.target;
  var value = btn.getAttribute("value");
  getCityWeather(value);
  get5DayWeather(value);
  cities.push(value);
  cityInputEl.value = "";
  saveSearch();
  renderSearch();
}

searchHistoryEl.addEventListener("click", handleSearchBtn);
searchBtn.addEventListener("click", getWeather);