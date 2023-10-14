const config = {
	production: {
		apiUrl: "https://api.reseau-lichen.fr"
	},
	development: {
		apiUrl: "http://localhost:9000"
	}
};

export class Sdk {
	constructor(axios) {
		this.axios = axios;
	}

	getBaseUrl() {
		return process.env.NODE_ENV == "development"
			? config.development.apiUrl
			: config.production.apiUrl;
	}

	reinitPassword(password, token) {
		return this.axios.put(
			this.getBaseUrl() + "/users/",
			{
				password
			},
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);
	}

	async getGalleries() {
		const res = await this.axios.get(this.getBaseUrl() + "/users/gallery");

		return res.data;
	}

	async createPlace(data, token) {
		const res = await this.axios.post(
			this.getBaseUrl() + "/users/register",
			data,
			this.getAuthorization(token)
		);

		console.log(res);

		const newToken = res.data.token;
		console.log(data);
		await this.axios.put(
			this.getBaseUrl() + "/users/self/gallery",
			data.position,
			this.getAuthorization(newToken)
		);

		return res.data;
	}

	async createEvent(data, galleryId, token) {
		const res = await this.axios.post(
			this.getBaseUrl() + "/events/" + galleryId,
			data,
			this.getAuthorization(token)
		);

		console.log(res);
		return res.data;
	}

	async getAllEvents() {
		const res = await this.axios.get(this.getBaseUrl() + "/events");
		return res.data;
	}

	async getEvents(galleryId) {
		const res = await this.axios.get(
			this.getBaseUrl() + "/events?galleryId=" + galleryId
		);
		return res.data;
	}

	async deleteEvent(eventId, token) {
		return this.delete("/events/" + eventId, token);
	}

	async deleteGallery(galleryId, token) {
		return this.delete("/users/gallery/" + galleryId, token);
	}

	async updateGallery(userId, data, token) {
		if (data.longitude || data.latitude) {
			const gallery = await this.put(
				"/users/" + userId + "/gallery/",
				data,
				token
			);
		}

		if (data.name) {
			await this.put("/users/" + userId, { pseudo: data.name }, token);
		}
	}

	async updateEvent(eventId, data, token) {
		return this.put("/events/" + eventId, data, token);
	}

	async post(url, data, token) {
		const res = await this.axios.post(
			this.getBaseUrl() + url,
			data,
			this.getAuthorization(token)
		);

		console.log(res);
		return res.data;
	}

	async put(url, data, token) {
		// il faudra peut être du multipart/data ?

		const res = await this.axios.put(
			this.getBaseUrl() + url,
			data,
			this.getAuthorization(token)
		);

		console.log(res);
		return res.data;
	}

	async delete(url, token) {
		console.log(token);

		const res = await this.axios.delete(
			this.getBaseUrl() + url,

			this.getAuthorization(token)
		);

		console.log(res);
		return res.data;
	}

	getAuthorization(token) {
		return {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
	}
}
