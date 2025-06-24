"use strict";

async function fetchData() {
	try {
		const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,sunrise,sunset,uv_index_max,snowfall_sum,rain_sum,wind_speed_10m_max,temperature_2m_min&timezone=auto');
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

async function readWeatherData() {
	try {
		const result = await fetchData();
		if (result && result.daily) {
			const dates = result.daily.time;
			const tempsmax = result.daily.temperature_2m_max;
			const tempsmin = result.daily.temperature_2m_min;
			const windSpeed = result.daily.wind_speed_10m_max;
			const rain = result.daily.rain_sum;
			const snow = result.daily.snowfall_sum;
			const uvIndex = result.daily.uv_index_max;

			const ctx = document.getElementById('weatherChart').getContext('2d');

			new Chart(ctx, {
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
							title: { display: true, text: 'Temperature (°C)' }
						},
						'y-snow': {
							type: 'linear',
							position: 'right',
							title: { display: true, text: 'Snow (mm)' },
							grid: { drawOnChartArea: false }
						},
						'y-rain': {
							type: 'linear',
							position: 'right',
							title: { display: true, text: 'Rain (mm)' },
							grid: { drawOnChartArea: false }
						}
				 }
				}
			});
		}
	} catch (error) {
		console.error('Error processing weather data:', error);
	}
}

readWeatherData();