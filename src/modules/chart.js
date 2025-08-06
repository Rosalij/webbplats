"use strict";
import { fetchData } from './weather.js';
import { loadSunriseSunset } from './weather.js';
import { fetchSurfData } from './weather.js';
const surfDivEl = document.querySelector("#surfDiv");

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
            //load sunrise and sunset times
            loadSunriseSunset(sunrise, sunset);
            const ctx = document.getElementById('weatherChart').getContext('2d');
            //destroy old chart and make new one
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
                            yAxisID: 'y-snow'
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


/**
 * Fetches surf forecast data and displays a chart.
 * Updates the wave direction arrow on hover.
 * @async
 * @function readSurfData
 * @param {number} latitude  Latitude coordinate of the location.
 * @param {number} longitude longitude coordinate of the location.
 * @returns {Promise<void>}
 */
export async function readSurfData(latitude, longitude) {
    try {
        const result = await fetchSurfData(latitude, longitude);

        //check if any surf data is available for the location
        let hasSurfData = false;
        if (result && result.hourly && result.hourly.wave_height) {
            for (let i = 0; i < result.hourly.wave_height.length; i++) {
                if (result.hourly.wave_height[i] !== null) {
                    hasSurfData = true;
                    break;
                }
            }
        }

        //if no surf data is available, display message and hide chart
        if (!hasSurfData) {
            let surfText = document.getElementById("locationSurfText");
            surfText.innerHTML = "No surf forecast available for this location.";
            let surfChartEl = document.getElementById("surfChart");
            let arrowDivEl = document.getElementById("arrowDiv");
            arrowDivEl.style.display = "none";
            surfChartEl.style.display = "none";
            return;
        }
        if (result && result.hourly) {
            const date = result.hourly.time;
            const wave_direction = result.hourly.wave_direction;
            const wave_height = result.hourly.wave_height;
            const wave_period = result.hourly.wave_period;
            waveDir = result.hourly.wave_direction;
            const arrowDivEl = document.getElementById("arrowDiv"); 
            arrowDivEl.style.display = "block";


            const ctx = document.getElementById('surfChart').getContext('2d');

            //destroy chart and make new one
            if (surfChart) {
                surfChart.destroy();
            }

            surfChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: date.map(date => new Date(date).toLocaleString()),
                    datasets: [

                        {
                            type: 'bar',
                            label: 'Wave height (meters)',
                            data: wave_height,
                            borderColor: 'blue',
                            backgroundColor: `rgba(87, 152, 190, 0.64)`,
                            yAxisID: 'y-height',
                            fill: false
                        },
                        {
                            type: 'line',
                            label: 'Wave direction (angle)',
                            pointStyle: 'triangle',
                            data: wave_direction,
                            backgroundColor: '#006D77',
                            yAxisID: 'y-direction',
                            fill: false
                        },
                        {
                            type: 'line',
                            label: 'Wave period (seconds)',
                            data: wave_period,
                            backgroundColor: 'grey',
                            yAxisID: 'y-period',
                            fill: false
                        },
                    ]
                },
                options: {

                    //add arrow which changes direction on hover on chart, in the current wave direction 
                    onHover: (event, elements, chart) => {
                        const arrow = document.getElementById("waveArrow");

                        if (elements.length > 0 && waveDir.length > 0) {
                            const index = elements[0].index;
                            const direction = waveDir[index]; //degrees from API

                            //Rotate the arrow
                            arrow.style.display = "block";
                            //show the arrow in the correct direction to where the waves are going
                            arrow.style.transform =`rotate(${(direction + 180)}deg)`;
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    scales: {
                        x: {
                            title: { display: true, text: 'Date / Time' }
                        },
                        'y-height': {
                            type: 'linear',
                            position: 'left',
                            title: { display: true, text: 'Wave height' },
                            ticks: {
                                color: 'blue'
                            }
                        },
                        'y-direction': {
                            display: false
                        },
                        'y-period': {
                            type: 'linear',
                            position: 'right',
                            title: { display: true, text: 'Wave period (seconds)' },
                            ticks: {
                                color: 'gray'
                            },
                            grid: {
                                drawOnChartArea: false
                            }
                        },
                    },

                }
            });
        }

    }
    catch (error) {
        console.error('Error processing Surf forecast data:', error);
    }
}

let surfChart = null;
let waveDir = [];