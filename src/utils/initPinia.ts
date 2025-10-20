import { createApp } from 'vue';
import { createPinia } from 'pinia';

export const initPinia = (component: any, selector: string) => {
	const el = document.querySelector(selector);
	if (el) {
		const app = createApp(component);
		app.use(createPinia());
		app.mount(el);
	}
};
