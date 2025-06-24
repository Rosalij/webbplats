"use strict";


async function getCoordinates(location) {
	try {
		const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`);
		const data = await response.json();
		if (data.results && data.results.length > 0) {
			const { latitude, longitude } = data.results[0];
			return { latitude, longitude };
		} else {
			throw new Error("Location not found");
		}
	} catch (error) {
		console.error("Geocoding error:", error);
	}
}


async function fetchData(latitude, longitude) {
	try {
		const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,sunrise,sunset,uv_index_max,snowfall_sum,rain_sum,wind_speed_10m_max,temperature_2m_min&timezone=auto`);
		if (!response.ok) {
			throw new Error(`status: ${response.status}`);
		}
		const data = await response.json();
		console.log(data);
		return data;

	} catch (error) {
		console.error('Error fetching data:', error);
	}
}

async function getLocation(latitude, longitude) {
	try {
		const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
		const data = await response.json();
		if (data && data.address) {
			const city = data.address.city || data.address.town || data.address.village || data.address.hamlet || "Unknown city";
			const country = data.address.country || "Unknown country";
			return { city, country };
		} else {
			throw new Error("Location not found");
		}
	} catch (error) {
		console.error("Reverse geocoding error:", error);
	}
}

async function readWeatherData(latitude, longitude) {
	try {
		const result = await fetchData(latitude, longitude);
		if (result && result.daily) {
			const dates = result.daily.time;
			const tempsmax = result.daily.temperature_2m_max;
			const tempsmin = result.daily.temperature_2m_min;
			const windSpeed = result.daily.wind_speed_10m_max;
			const rain = result.daily.rain_sum;
			const snow = result.daily.snowfall_sum;
			const uvIndex = result.daily.uv_index_max;

			const ctx = document.getElementById('weatherChart').getContext('2d');

			if (weatherChart) {
				weatherChart.destroy();
			}

			weatherChart = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: dates.map(date => new Date(date).toDateString()),
					datasets: [
						{
							type: 'line',
							label: 'Max Temp (°C)',
							data: tempsmax,
							borderColor: 'red',
							backgroundColor: 'red',
							yAxisID: 'y-temp',
							fill: false
						},
						{
							type: 'line',
							label: 'Min Temp (°C)',
							data: tempsmin,
							borderColor: 'orange',
							backgroundColor: 'orange',
							yAxisID: 'y-temp',
							fill: false
						},
						{
							type: 'bar',
							label: 'Snow (mm)',
							data: snow,
							backgroundColor: 'rgba(61, 59, 127, 0.6)',
							yAxisID: 'y-rain'
						},
						{
							type: 'bar',
							label: 'Rain (mm)',
							data: rain,
							backgroundColor: 'rgba(54, 162, 235, 0.6)',
							yAxisID: 'y-rain'
						},
						{
							type: 'line',
							label: 'Wind Speed (km/h)',
							data: windSpeed,
							borderColor: 'blue',
							backgroundColor: 'blue',
							yAxisID: 'y-wind',
							fill: false
						},
						{
							type: 'line',
							label: 'UV Index',
							data: uvIndex,
							borderColor: 'purple',
							backgroundColor: 'purple',
							yAxisID: 'y-uv',
							fill: false
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					interaction: {
						mode: 'index',
						intersect: false
					},
					scales: {
						x: {
							title: { display: true, text: 'Date' }
						},
						'y-temp': {
							type: 'linear',
							position: 'left',
							title: { display: true, text: 'Temperature (°C)' },
							ticks: {
								color: 'red'
							}
						},
						'y-rain': {
							type: 'linear',
							position: 'right',
							title: { display: true, text: 'Precipitation (mm)' },
							ticks: {
								color: 'rgba(54, 162, 235, 0.6)'
							},
							grid: {
								drawOnChartArea: false // only want the grid lines for one axis to show up
							}
						},
						'y-snow': {
							display: false  // hide axis line & ticks to save space
						},
						'y-wind': {
							display: false  // hide axis line & ticks to save space
						},
						'y-uv': {
							display: false  // hide axis line & ticks to save space
						}
					}
				}
			});
		}
	} catch (error) {
		console.error('Error processing weather data:', error);
	}
}
let weatherChart = null;

document.getElementById('searchForm').addEventListener('submit', async (e) => {
	e.preventDefault();
	const location = document.getElementById('locationInput').value;
	const coordinates = await getCoordinates(location);
		weatherChartEl.style.display = "block";
	weatherDivEl.style.display = "block";
	if (coordinates) {
		
		// Show city and country first (reverse geocode)
		const locData = await getLocation(coordinates.latitude, coordinates.longitude);
		if (locData) {
			document.getElementById('locationText').textContent = `7 day weather for ${locData.city}, ${locData.country}`;
		} else {
			document.getElementById('locationText').textContent = 'Location not found';
		}
		// Then fetch and render weather data
		await readWeatherData(coordinates.latitude, coordinates.longitude);
	}
});


const weatherDivEl = document.querySelector(".weatherDiv");
const weatherChartEl = document.getElementById("weatherChart");
if (weatherChartEl.innerHTML === "") {
	weatherChartEl.style.display = "none";
	weatherDivEl.style.display = "none";

}