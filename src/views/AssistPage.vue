<template>
	<div>
		<Header />
		<p>
			Pour toutes demande d'assistance (bug, incompréhension, suppression
			de compte etc...), veuillez nous contacter à l'adresse
			<a href="mailto:contact@reseau-lichen.fr"
				>contact@reseau-lichen.fr</a
			>
		</p>
	</div>
</template>
<script>
import Header from "../components/Header.vue";

export default {
	components: { Header }
};
</script>
<style scoped>
* {
	font-family: Livvic;
	font-size: 1.4rem;
	margin-left: 0.5rem;
}
</style>
