<template>
	<div class="p-6 border rounded-lg">
		<p class="text-lg">
			This is an interactive component. The current count is:
			<span class="font-bold text-blue-600">{{ count }}</span>
		</p>
		<button
			@click="increment"
			class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
		>
			Increment
		</button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

const increment = () => {
	count.value++;
};
</script>
