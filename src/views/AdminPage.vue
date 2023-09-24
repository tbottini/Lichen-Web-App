<template>
	<h1>Page admin</h1>
	<div>
		token admin :
		<input v-model="token" @input="updateToken" type="text" />
	</div>

	<h2>Galerie</h2>
	<p class="erreur">{{ erreurstr }}</p>

	<h3>Création du lieu</h3>
	<div class="form">
		<div>
			<label>nom</label>
			<input v-model="placeForm.pseudo" />
		</div>
		<div>
			<label>description</label>
			<input v-model="placeForm.description" />
		</div>

		<div>
			<label>longitude</label>
			<input v-model="placeForm.longitude" />
		</div>

		<div>
			<label>latitude</label>
			<input v-model="placeForm.latitude" />
		</div>

		<button @click="createPlace">créer le lieu</button>
	</div>

	<p>Liste de galeries</p>
	<ul>
		<li class="row-edit" v-for="place in places" :key="place.id">
			<div
				:class="{
					selected: place.id === selectedPlace?.id,
					notselected: place.id !== selectedPlace?.id
				}"
				@click="selectPlace(place)"
			>
				{{ place.pseudo }}, position : ({{ place.gallery.longitude }},
				{{ place.gallery.latitude }})
			</div>
			<div class="button" @click="deleteGallery(place)">Supprimer</div>
		</li>
	</ul>

	<p>Galerie selectionnée : {{ selectedPlace?.pseudo }}</p>
	<div class="form" v-if="selectedPlace != null">
		<h3>Modification de la galerie</h3>

		<div>
			<label>nom</label>
			<input v-model="updatePlace.name" />
		</div>
		<div>
			<label>longitude</label>
			<input v-model="updatePlace.longitude" />
		</div>
		<div>
			<label>latitude</label>
			<input v-model="updatePlace.latitude" />
		</div>

		<button @click="updateGallery">mettre à jour</button>
	</div>

	<h2>Évènement</h2>

	<div class="form" v-if="selectedPlace != null">
		<h3>Création d'évènement</h3>

		<div>
			<label>nom</label>
			<input v-model="eventForm.name" />
		</div>

		<div>
			<label>description</label>
			<input v-model="eventForm.description" />
		</div>
		<div>
			<label>date début</label>
			<input type="date" v-model="eventForm.dateStart" />
		</div>
		<div>
			<label>date fin</label>
			<input type="date" v-model="eventForm.dateEnd" />
		</div>

		<button @click="createEvent">Créer l'event</button>
	</div>
	<div class="form" v-if="selectedEvent != null">
		<h3>Modification de l'évènement</h3>

		<div>
			<label>nom</label>
			<input v-model="updateEventPayload.name" />
		</div>
		<div>
			<label>longitude</label>
			<input type="number" v-model="updateEventPayload.longitude" />
		</div>
		<div>
			<label>latitude</label>
			<input type="number" v-model="updateEventPayload.latitude" />
		</div>

		<div>
			<label>date début</label>
			<input type="date" v-model="updateEventPayload.dateStart" />
		</div>

		<div>
			<label>date fin</label>
			<input type="date" v-model="updateEventPayload.dateEnd" />
		</div>

		<div>
			<label>description</label>
			<input v-model="updateEventPayload.description" />
		</div>
		<button @click="updateEvent()">mettre à jour</button>
	</div>

	<div v-if="selectedPlace != null">
		<p>Liste d'évènement de la galerie</p>
		<ul>
			<li class="row-edit" v-for="event in events" :key="event.id">
				<div
					:class="{
						selected: event.id === selectedEvent?.id,
						notselected: event.id !== selectedEvent?.id
					}"
					@click="selectEvent(event)"
				>
					- {{ event.name }} le {{ formatDate(event.dateStart) }}
					{{ event.dateEnd ? "au" : "" }}
					{{ formatDate(event.dateEnd) }}
				</div>
				<div class="button" @click="deleteEvent(event)">Supprimer</div>
			</li>
		</ul>
	</div>
</template>
<script>
import { Sdk } from "../api/sdk";

function removeUndefined(obj) {
	return Object.fromEntries(
		Object.entries(obj).filter(
			([_key, value]) => value != undefined && value != null
		)
	);
}

export default {
	data() {
		// localStorage.token = "test";
		console.log("token", localStorage);

		return {
			token: localStorage.token,
			placeForm: {
				pseudo: "",
				description: "",
				password: "Tadfje234&@@,",
				longitude: null,
				latitude: null
			},
			places: [],
			updatePlace: {
				name: null,
				latitude: null,
				longitude: null
			},
			updateEventPayload: {
				name: null,
				dateStart: null,
				dateEnd: null,
				description: null,
				longitude: null,
				latitude: null
			},
			selectedPlace: null,
			selectedEvent: null,
			events: [],
			eventForm: {
				name: "",
				dateStart: null,
				dateEnd: null,
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

			await sdk.createPlace(
				{
					...this.placeForm,
					position: {
						longitude: this.placeForm.longitude,
						latitude: this.placeForm.latitude
					},
					email: `account-test+${Math.trunc(
						Math.random() * 100000
					)}@reseau-lichen.fr`
				},
				this.token
			);

			this.placeForm.description = "";
			this.placeForm.longitude = null;
			this.placeForm.latitude = null;
			this.placeForm.pseudo = "";
			await this.refreshPlaces();
		},
		async selectPlace(place) {
			this.selectedPlace = place;

			await this.refreshEvents();
		},
		selectEvent(event) {
			this.selectedEvent = event;
		},
		async refreshEvents() {
			const sdk = new Sdk(this.axios);
			const events = await sdk.getEvents(this.selectedPlace.id);
			this.events = events;

			console.log("events", this.selectedPlace.id, events);
		},
		async deleteEvent(event) {
			const sdk = new Sdk(this.axios);
			await sdk.deleteEvent(event.id, this.token);
			await this.refreshEvents();
		},
		async deleteGallery(gallery) {
			console.log(gallery);

			const sdk = new Sdk(this.axios);
			await sdk.deleteGallery(gallery.id, this.token);
			await this.refreshPlaces();
		},
		async updateGallery() {
			const sdk = new Sdk(this.axios);
			await sdk.updateGallery(
				this.selectedPlace.id,
				removeUndefined({
					...this.updatePlace
				}),
				this.token
			);

			this.updatePlace.name = null;
			this.updatePlace.longitude = null;
			this.updatePlace.latitude = null;

			await this.refreshPlaces();
		},
		formatDate(date) {
			if (!date) return "";
			let dateObj = new Date(date);

			return (
				dateObj.getDate() +
				"/" +
				dateObj.getMonth() +
				"/" +
				dateObj.getFullYear()
			);
		},
		async updateEvent() {
			const sdk = new Sdk(this.axios);
			await sdk.updateEvent(
				this.selectedEvent.id,
				removeUndefined({
					...this.updateEventPayload
				}),
				this.token
			);
			this.updateEventPayload.name = null;
			this.updateEventPayload.dateStart = null;
			this.updateEventPayload.dateEnd = null;
			this.updateEventPayload.description = null;
			this.updateEventPayload.longitude = null;
			this.updateEventPayload.latitude = null;
			await this.refreshEvents();
		},
		updateToken(value) {
			localStorage.token = value.target.value;
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

				this.eventForm.name = "";
				this.eventForm.dateStart = null;
				this.eventForm.dateEnd = null;
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

button {
	cursor: pointer;
	background: transparent;
	border: 1px solid black;
	padding: 6px;
	margin: 4px;
}

.row-edit > div:hover,
.selected {
	border: 1px solid black;
}

.notselected {
	border: 1px solid transparent;
}

.row-edit {
	display: flex;
}

.row-edit > div {
	padding: 10px;
	margin: 0px 5px;
}

li {
	border: 1px solid transparent;
	padding: 10px;
	cursor: pointer;
}

li,
ul {
	margin: 0;
	padding: 0;
}

.erreur {
	color: red;
}

.form > div {
	margin-top: 5px;
}

.form > div > label {
	margin-right: 10px;
}
</style>
