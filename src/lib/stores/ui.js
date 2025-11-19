import { writable } from 'svelte/store';

export const navbarScrolled = writable(false);
export const activeSection = writable('home');