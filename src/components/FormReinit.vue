<template>
	<div>
		<form :class="{ hiddenForm: taskFinished }" class="reinit-form">
			<label>Mot de passe</label>
			<input
				type="password"
				v-model="password"
				@focus="helpOpen = true"
				@blur="helpOpen = false"
			/>
			<div :class="{ active: helpOpen }" class="helper">
				<label style="font-size: 0.9rem"
					>Le mot de passe doit contenir :</label
				>
				<ul>
					<li>- 8 caractères</li>
					<li>- 1 symbole</li>
					<li>- 1 majuscule</li>
					<li>- 1 minuscule</li>
					<li>- 1 chiffre</li>
				</ul>
			</div>
			<label>Vérification</label>
			<input type="password" v-model="verification" />
		</form>
		<p
			v-show="errorMsg"
			style="color: lightcoral; margin-top: 1rem; font-size: 1.2rem"
		>
			{{ errorMsg }}
		</p>
		<button
			class="button"
			:class="{ finished: taskFinished }"
			@click="submit"
		>
			<img src="@/assets/check_on.svg" />
		</button>
		<p class="success-text" :class="{ finished: taskFinished }">
			{{ successMsg }}
		</p>
	</div>
</template>

<script>
import { Sdk } from "../api/sdk";

export default {
	props: {
		token: {}
	},
	data() {
		console.log(process.env.NODE_ENV);

		return {
			password: "",
			verification: "",
			validInput: false,
			errorMsg: "",
			helpOpen: false,
			taskFinished: false,
			successMsg: ""
		};
	},
	methods: {
		submit() {
			if (!this.$route.query.token) {
				this.errorMsg = "Mauvais url, le problème provenir de l'email";
				return;
			}

			if (this.password != this.verification) {
				this.errorMsg = "Les mots de passe ne correspondent pas";
				return;
			}

			const passwordIsValid =
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*[<>()\-ù&à#§!~&=°|%^£¤$\[\]\\.,`;*:\s@]).{8,}$/.test(
					this.password
				);

			if (!passwordIsValid) {
				this.errorMsg = "Le mot de passe est mal formaté";
				return;
			}

			const sdk = new Sdk(this.axios);

			sdk.reinitPassword(this.password, this.$route.query.token)
				.then((res) => {
					console.log(res, res.data);

					if (res.status == 200 && !res.data.error) {
						console.log(res.data);
						this.taskFinished = true;
						this.successMsg =
							"Votre mot de passe a correctement été modifié";
					} else {
						this.errorMsg =
							"Votre mot de passe n'a pas pu être correctement modifié";
					}
				})
				.catch((e) => {
					console.log(e.message);
				});
		}
	}
};
</script>

<style lang="sass">

.reinit-form
    font-family: Livvic
    font-size: 1.3rem
    align-content: stretch
    flex-direction: column
    display: flex
    width: 40vw
    margin: 0 auto
    margin-top: 5vh
    transition: 1s ease-out
    max-height: 350px
    overflow: hidden

    label
        align-self: start

    input
        padding: 10px
        border-radius: 11px
        border: 1px solid black
        margin: 0.5rem 2px
        font-size: 1.1rem


button
    width: 5rem
    height: 5rem
    background-color: transparent
    border-radius: 50%
    cursor: pointer
    border: 1px solid transparent
    margin-top: 2rem

    transition: 0.3s ease-in border
    &:hover,
        border: 1px solid #F1BC86

    &:focus
        outline: none


button
    &.finished
        border: 1px solid #F1BC86
.success-text
    opacity: 0
    font-family: Livvic
    font-size: 1.1rem
    transition: 1.5s ease-out
    &.finished
        opacity: 1

ul
    overflow: hidden
    text-align: left
    list-style: none
    // margin: 0
    padding: 0
    margin-top: 0.3rem

.helper
    max-height: 0
    overflow: hidden
    transition: 0.9s ease-out
    text-align: left

.active
    max-height: 550px

.hiddenForm
    max-height: 0
</style>
