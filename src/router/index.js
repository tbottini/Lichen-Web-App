import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home
	},
	{
		path: "/admin",
		name: "AdminPage",
		redirect: { path: "/admin/gallery" },
		component: () => import("../views/AdminPageTest.vue"),
		children: [
			{
				path: "gallery",
				component: () => import("../views/AdminPage.vue")
			},
			{
				path: "events",
				component: () => import("../views/AdminEventPage.vue")
			}
		]
	},
	{
		path: "/assistance",
		name: "AssistPage",
		component: () => import("../views/AssistPage.vue")
	},
	{
		path: "/donnees-personnelles",
		name: "PrivacyPage",
		component: () => import("../views/PrivacyPage.vue")
	},
	{
		path: "/reinit-password",
		name: "ReinitPassword",
		component: () => import("../views/ReinitPassword.vue")
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router;
