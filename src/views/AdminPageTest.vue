<template>
	<div>
		<h1>Page admin</h1>

		<div>
			token admin :
			<input v-model="store.token" @input="updateToken" type="text" />
		</div>

		<nav>onglets</nav>
		<ul>
			<router-link to="gallery"
				><li @click="page = 'gallery'">Galeries</li></router-link
			>
			<router-link to="events">
				<li @click="page = 'event'">Évènement</li>
			</router-link>
		</ul>
		<router-view></router-view>
	</div>
</template>
<script>
import { store } from "./state";
export default {
	data() {
		return {
			store
		};
	},
	methods: {
		updateToken(value) {
			localStorage.token = value.target.value;
		}
	}
};
</script>
<style scoped>
* {
	text-align: start;
}
</style>
