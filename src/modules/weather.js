"use strict";
/**
 * Fetches weather forecast data for given coordinates.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object | undefined>} Weather data from the API.
 */
export async function fetchData(latitude, longitude) {
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


/**
 * Updates DOM elements with local sunrise and sunset times.
 * @param {string} sunrise - time string.
 * @param {string} sunset -  time string.
 */
export  function loadSunriseSunset(sunrise, sunset) {
//convert sunrise and sunset times to local time
  sunrise = new Date(sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  sunset = new Date(sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sunrisetextEl = document.getElementById("sunrisetext")
  const sunsettextEl = document.getElementById("sunsettext")
  sunrisetextEl.innerHTML = `sunrise: ${sunrise}`
  sunsettextEl.innerHTML = `sunset: ${sunset}`

}

