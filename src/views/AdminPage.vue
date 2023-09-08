<template>
	<p class="erreur">{{ erreurstr }}</p>
	<div>token du lieu : <input v-model="token" type="text" /></div>
	création de lieu
	<div>
		nom du lieu <input v-model="placeForm.pseudo" /><br />
		description <input v-model="placeForm.description" /><br />position
		<input v-model="placeForm.position" />
		<button @click="createPlace">créer le lieu</button>
	</div>
	<ul>
		<li v-for="place in places" @click="selectPlace(place)" :key="place.id">
			{{ place.pseudo }}
		</li>
	</ul>
	<p>Lieu selectionné : {{ selectedPlace?.pseudo }}</p>
	<h3>Création d'évènement</h3>
	<div>
		nom : <input v-model="eventForm.name" /> <br />date :
		<input v-model="eventForm.date" type="date" /> <br />description :
		<input v-model="eventForm.description" /><br />
		<button @click="createEvent">Créer l'event</button>
	</div>
	<h3>events</h3>
	<ul>
		<li v-for="event in events" :key="event.id">
			{{ event.name }} le {{ event.dateStart }}
		</li>
	</ul>
</template>
<script>
import { Sdk } from "../api/sdk";

export default {
	data() {
		return {
			token: "",
			placeForm: {
				pseudo: "",
				description: "",
				password: "Tadfje234&@@,",
				position: ""
			},
			places: [],
			selectedPlace: null,
			events: [],
			eventForm: {
				name: "",
				date: null,
				description: ""
			},
			erreurstr: ""
		};
	},
	async created() {
		await this.refreshPlaces();
	},
	methods: {
		async refreshPlaces() {
			const sdk = new Sdk(this.axios);
			const galleries = await sdk.getGalleries();
			console.log(galleries);
			this.places = galleries;
		},
		async createPlace() {
			console.log("va creer le lieu");
			const sdk = new Sdk(this.axios);

			const pos = this.placeForm.position.trim().split(", ");
			const posLong = pos[0];
			const posLat = pos[1];

			console.log(posLong, posLat);

			const place = await sdk.createPlace(
				{
					...this.placeForm,
					position: {
						longitude: posLong,
						latitude: posLat
					},
					email: `account-test+${Math.trunc(
						Math.random() * 100
					)}@reseau-lichen.fr`
				},
				this.token
			);
			console.log(place);

			this.placeForm.description = "";
			this.placeForm.position = "";
			this.placeForm.pseudo = "";
			await this.refreshPlaces();
		},
		async selectPlace(place) {
			this.selectedPlace = place;

			await this.refreshEvents();
		},
		async refreshEvents() {
			const sdk = new Sdk(this.axios);
			const events = await sdk.getEvents(this.selectedPlace.id);
			this.events = events;

			console.log("events", this.selectedPlace.id, events);
		},
		async createEvent() {
			if (!this.token) {
				console.log("test");
				this.errorstr = "il faut définir le token";
				return;
			}

			const sdk = new Sdk(this.axios);

			try {
				const event = await sdk.createEvent(
					{
						...this.eventForm
					},
					this.selectedPlace.id,
					this.token
				);

				console.log(event);

				this.eventForm.name = "";
				this.eventForm.dateStart = null;
				this.eventForm.description = "";

				await this.refreshEvents();
			} catch (e) {
				this.error = "erreur, peut être à cause du token non défini";
			}
		}
	}
};
</script>
<style scoped>
* {
	text-align: left;
}

li:hover {
	border: 1px solid black;
}

li {
	border: 1px solid transparent;
	padding: 10px;
	cursor: pointer;
}

.erreur {
	color: red;
}
</style>
