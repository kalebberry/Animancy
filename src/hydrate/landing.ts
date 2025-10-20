import { initPinia } from '@/utils/initPinia';
import InteractiveCounter from '@/components/vue/landing/InteractiveCounter.vue';

// Mount the InteractiveCounter component to the '#interactive-counter' element
initPinia(InteractiveCounter, '#interactive-counter');
