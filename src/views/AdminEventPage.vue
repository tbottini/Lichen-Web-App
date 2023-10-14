<template>
	<EventSlot :events="events" @deletedEvent="deleteEvent"></EventSlot>
</template>
<script>
import { store } from "./state";
import { Sdk } from "../api/sdk";
import EventSlot from "./EventSlot.vue";

export default {
	components: { EventSlot },
	data() {
		return { store, events: [] };
	},
	async created() {
		await this.refreshEvents();
	},
	methods: {
		async refreshEvents() {
			const sdk = new Sdk(this.axios);

			this.events = await sdk.getAllEvents();
		},
		async deleteEvent(event) {
			console.log("event", event);
			const sdk = new Sdk(this.axios);
			await sdk.deleteEvent(event.id, this.store.token);
			await this.refreshEvents();
		}
	}
};
</script>
