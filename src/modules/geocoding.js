"use strict";

/**
 * Fetches coordinates (latitude & longitude) for location name.
 * @param {string} location - The name of the location.
 * @returns {Promise<{latitude: number, longitude: number} | undefined>} coordinates if found.
 */
export async function getCoordinates(location) {
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




/**
 * Do reverse geocoding to find the city and country from coordinates.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<{city: string, country: string | undefined}>} location info.
 */
export async function getLocation(latitude, longitude) {
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
