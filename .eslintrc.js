module.exports = {
	end: {
		node: true,
		commonjs: true,
		browser: true
	},
	extends: [
		// add more generic rulesets here, such as:
		"eslint:recommended",
		"plugin:vue/vue3-recommended"
	],
	rules: {
		// override/add rules settings here, such as:
		// 'vue/no-unused-vars': 'error'
	}
};
