import { writable } from 'svelte/store';

// Initialize the store for user data with null as default value
export const userData = writable(null);
