const clockElement = document.getElementById('clock');
const timeFormatSelect = document.getElementById('timeFormat');


function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    let format = timeFormatSelect.value;

    let ampm = '';
    if (format === '12') {
        ampm = hours >= 12 ? ' PM' : ' AM';
        hours = hours % 12 || 12;
    }

    const timeString = `${padZero(hours)}:${padZero(minutes)}${ampm}`;
    clockElement.textContent = timeString;
}

timeFormatSelect.addEventListener('change', updateClock);
setInterval(updateClock, 1000);
updateClock();

const dateElement = document.getElementById('date');

function updateDate() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[now.getDay()];
    const date = now.getDate();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    const dateString = `${day}, ${month} ${date}, ${year}`;
    dateElement.textContent = dateString;
}

function padZero(num) {
    return num < 10 ? '0' + num : num;
}

setInterval(updateDate, 1000);
updateDate();


const headlinesElement = document.getElementById('headlineList');

const countrySelect = document.getElementById('country');

async function fetchTopHeadlines() {
    const apiKey = 'H6FiLmxYAD9MWPe0wZIlviQVjSXE40mFmFBdS34I';
    const country = countrySelect.value;
    const url = `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&locale=${country}&limit=3`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        let headlines = '';
        for (let i = 0; i < data.data.length; i++) {
            const article = data.data[i];
            headlines += `<li>${article.title}</li>`;
        }

        headlinesElement.innerHTML = headlines;
    } catch (error) {
        const dummyHeadlines = [
            "Canada's Video Game Industry contributed $5.1 billion to GDP in 2024",
            "PowerSchool data breach has hit at least 80 Canadian school boards",
            "Supermassive Black Holes Can Create Their Own Meals, Astronomers Say"
        ];

        let headlines = '';
        for (let i = 0; i < dummyHeadlines.length; i++) {
            headlines += `<li>${dummyHeadlines[i]}</li>`;
        }

        headlinesElement.innerHTML = headlines;
    }
}

async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        data.forEach(country => {
            const option = document.createElement('option');
            option.value = country.cca2.toLowerCase();
            option.textContent = country.name.common;
            countrySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

fetchCountries();

countrySelect.addEventListener('change', fetchTopHeadlines);
fetchTopHeadlines();
setInterval(fetchTopHeadlines, 600000); // 10 minutes


const locationInput = document.getElementById('location');
const weatherInfo = document.getElementById('weatherInfo');
const weatherDescription = document.getElementById('weatherDescription');
const weatherIcon = document.getElementById('weatherIcon');
const weatherTitle = document.getElementById('weatherTitle');

async function fetchWeather() {
    const location = locationInput.value;
    const apiKey = '8cfe0a1b9876e070e6bc2b14aaa0e940';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === 200) {
            const temp = data.main.temp;
            const description = data.weather[0].description;
            const title = "Weather in " + location;
            weatherTitle.textContent = title;
            // use unicode for degree symbol, kindle bug
            weatherInfo.textContent = `${temp.toFixed(1)}\u00B0C`;
            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            weatherDescription.textContent = description;
        } else {
            weatherInfo.textContent = 'Weather data not available.';
        }
    } catch (error) {
        weatherInfo.textContent = 'Failed to load weather.';
    }
}

locationInput.addEventListener('change', fetchWeather);
fetchWeather();
setInterval(fetchWeather, 600000);

const modal = document.getElementById('settingsPopup');
const btn = document.getElementById('openSettings');
const span = document.getElementsByClassName('close')[0];

btn.onclick = function() {
    modal.style.display = 'block';
}

span.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}