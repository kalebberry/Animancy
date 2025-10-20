import { defineStore } from 'pinia';

export const useBudgetStore = defineStore('budget', {
	state: () => ({
		safeToSpend: 1250,
	}),
});
