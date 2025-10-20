import { defineStore } from 'pinia';

export interface Transaction {
	id: string;
	amount: number;
	category: string;
	date: string;
	type: 'income' | 'expense';
	merchant: string;
}

type NewTransaction = Omit<Transaction, 'id'>;

export const useTransactionsStore = defineStore('transactions', {
	state: () => ({
		transactions: [] as Transaction[],
	}),
	actions: {
		addTransaction(txn: NewTransaction) {
			const newTxnWithId = {
				...txn,
				id: `txn_${Date.now()}`,
			};
			this.transactions.push(newTxnWithId);
			localStorage.setItem('transactions', JSON.stringify(this.transactions));
		},
		loadFromStorage() {
			const raw = localStorage.getItem('transactions');
			if (raw) {
				this.transactions = JSON.parse(raw);
			}
		},
	},
	getters: {
		// We need to tell the getter what the state looks like
		totalIncome(state): number {
			return state.transactions
				.filter((txn) => txn.type === 'income')
				.reduce((sum, txn) => sum + txn.amount, 0);
		},
		totalExpenses(state): number {
			return state.transactions
				.filter((txn) => txn.type === 'expense')
				.reduce((sum, txn) => sum + txn.amount, 0);
		},
		// `this` inside a getter refers to the store instance
		balance(): number {
			return this.totalIncome - this.totalExpenses;
		},
	},
});
