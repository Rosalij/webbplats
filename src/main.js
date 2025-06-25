"Use strict";
import { getCoordinates, getLocation } from './modules/geocoding.js';
import { fetchData } from './modules/weather.js';
import { readWeatherData } from './modules/chart.js';

const weatherChartEl = document.getElementById("weatherChart");
const weatherDivEl = document.querySelector(".weatherDiv");
const dataDivEl = document.querySelector(".dataDiv");

// Initial hide
if (weatherChartEl?.innerHTML === "") {
	weatherChartEl.style.display = "none";
	weatherDivEl.style.display = "none";
	dataDivEl.style.display = "none";
}

document.getElementById('searchForm').addEventListener('submit', async (e) => {
	/**n
	 * Handles form submission to fetch weather data.
	 * @param {SubmitEvent} e
	 */
	e.preventDefault();

	const locationInput = /** @type {HTMLInputElement} */ (document.getElementById('locationInput'));
	const location = locationInput.value.trim();

	if (!location) {
		alert("Please enter a location.");
		return;
	}

	const coordinates = await getCoordinates(location);
	if (!coordinates) {
		document.getElementById('locationText').textContent = 'Unable to find location.';
		return;
	}

	weatherChartEl.style.display = "block";
	weatherDivEl.style.display = "block";
	dataDivEl.style.display = "block";

	const locData = await getLocation(coordinates.latitude, coordinates.longitude);
	if (locData) {
		document.getElementById('locationText').textContent = `7 day weather for ${locData.city}, ${locData.country}`;
	}

	const result = await fetchData(coordinates.latitude, coordinates.longitude);
	await readWeatherData(coordinates.latitude, coordinates.longitude, result);
});