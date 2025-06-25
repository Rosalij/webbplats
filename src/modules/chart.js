"use strict";
import { fetchData } from './weather.js';
import { loadSunriseSunset } from './weather.js';
/**
 * Reads weather data and creates a Chart.js chart.
 * @param {number} latitude
 * @param {number} longitude
 * @param {Object} result - Weather API response object.
 */
export async function readWeatherData(latitude, longitude) {
	try {
		const result = await fetchData(latitude, longitude);
		if (result && result.daily) {
			const sunrise = result.daily.sunrise[0];
			const sunset = result.daily.sunset[0];
			const dates = result.daily.time;
			const tempsmax = result.daily.temperature_2m_max;
			const tempsmin = result.daily.temperature_2m_min;
			const windSpeed = result.daily.wind_speed_10m_max;
			const rain = result.daily.rain_sum;
			const snow = result.daily.snowfall_sum;
			const uvIndex = result.daily.uv_index_max;

			loadSunriseSunset(sunrise, sunset);
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
								drawOnChartArea: false 
							}
						},
						'y-snow': {
							display: false 
						},
						'y-wind': {
							display: false 
						},
						'y-uv': {
							display: false  
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