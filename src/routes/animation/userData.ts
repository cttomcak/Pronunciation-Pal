import { writable } from 'svelte/store';

/** Store for user data with null as default value */
export const userData = writable(null);
