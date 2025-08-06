"Use strict";
import { getCoordinates, getLocation } from './modules/geocoding.js';
import { fetchData } from './modules/weather.js';
import { readWeatherData } from './modules/chart.js';
import { fetchSurfData } from './modules/weather.js';
import { readSurfData } from './modules/chart.js';


const weatherChartEl = document.getElementById("weatherChart");
const weatherDivEl = document.querySelector(".weatherDiv");
const dataDivEl = document.querySelector(".dataDiv");
const surfDivEl = document.querySelector("#surfDiv");
const surfChartEl = document.getElementById("surfChart");

//hide elements 
if (weatherChartEl?.innerHTML === "") {
	weatherChartEl.style.display = "none";
	weatherDivEl.style.display = "none";
	dataDivEl.style.display = "none";
}

document.getElementById('searchForm').addEventListener('submit', async (e) => {
	/**
	 * Handles form submission to fetch weather data.
	 * @param {SubmitEvent} e
	 */
	e.preventDefault();

	const locationInput = (document.getElementById('locationInput'));
	const location = locationInput.value.trim();

	//if no location, show message
	if (!location) {
		alert("Please enter a location.");
		return;
	}

	const coordinates = await getCoordinates(location);
	if (!coordinates) {
		document.getElementById('locationText').textContent = 'Unable to find location.';
		return;
	}
	//show charts
	weatherChartEl.style.display = "block";
	weatherDivEl.style.display = "block";
	dataDivEl.style.display = "block";
	surfDivEl.style.display = "block";
	surfChartEl.style.display = "block";

	//update location text
	const locData = await getLocation(coordinates.latitude, coordinates.longitude);
	if (locData) {
		document.getElementById('locationText').textContent = `7 day weather for ${locData.city}, ${locData.country}`;
		let surfText = document.getElementById("locationSurfText")
		if (surfText) { surfText.innerHTML = `Surf forecast for ${locData.city}, ${locData.country}` };
	}
	// Fetch weather data and update charts
	const result = await fetchData(coordinates.latitude, coordinates.longitude);
	await readWeatherData(coordinates.latitude, coordinates.longitude, result);
	await fetchSurfData(coordinates.latitude, coordinates.longitude);
	await readSurfData(coordinates.latitude, coordinates.longitude, result);
}); 