import { reactive } from "vue";

console.log(localStorage);

export const store = reactive({
	token: localStorage.token
});
