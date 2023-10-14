<template>
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
</template>
<script>
export default {
	props: ["events"],
	data() {
		return {
			selectedEvent: null
		};
	},
	methods: {
		deleteEvent(event) {
			console.log("event");
			this.$emit("deletedEvent", event);
		},
		selectEvent(event) {
			this.selectedEvent = event;
			this.$emit("selectEvent", event);
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
