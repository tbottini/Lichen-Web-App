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

	async getEvents(galleryId) {
		const res = await this.axios.get(
			this.getBaseUrl() + "/events?galleryId=" + galleryId
		);
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
