function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours};`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function displayForecast(response) {
  console.log(response);
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  let days = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
  };
  console.log(Object.entries(days));
  Object.entries(days).forEach((day) => {
    let dailyData = response.data.daily[day[0]];
    forecastHTML =
      forecastHTML +
      `<div class="col-2">
            <div class="weather-forecast-date">${day[1]}</div>
            <img src="${dailyData.condition.icon}"
            alt=""
            width="42"
            />
            <div class="weather-forecast-temperatures">
              <span class="weather-forecast-temperature-max">${Math.round(
                dailyData.temperature.maximum
              )}<sup>° </sup></span> | 
              <span class="weather-forecast-temperature-min">${Math.round(
                dailyData.temperature.minimum
              )} <sup>° </sup></span>
            </div>
          </div>     
        `;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&key=01a64498f22b2eofd20ad4ct64f7e0a3&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  let date = new Date();
  let currentDay = date.getDay();

  let todaysData = response.data.daily[currentDay];
  celciusTemperature = todaysData.temperature.day;

  temperatureElement.innerHTML = Math.round(celciusTemperature);
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = todaysData.condition.description;
  humidityElement.innerHTML = todaysData.temperature.humidity;
  windElement.innerHTML = Math.round(todaysData.wind.speed);
  dateElement.innerHTML = formatDate(todaysData.time * 1000);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${todaysData.condition.icon}.png`
  );
  iconElement.setAttribute("alt", todaysData.condition.icon);

  getForecast(response.data.coordinates);
}
function search(city) {
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=01a64498f22b2eofd20ad4ct64f7e0a3&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let fahrenheitTemperature = (celciusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}
function displayCelsiusTemperature(event) {
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celciusTemperature);
}
let celciusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("New York");
displayForecast();
