// src/lib/stores/images.js
import { writable } from "svelte/store";
import imagesData from "$lib/data/images.json";

export const imagesStore = writable();
export const currentSliderIndex = writable(0);
export const selectedImage = writable(null);
export const isModalOpen = writable(false);
