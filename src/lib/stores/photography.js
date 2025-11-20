import { writable } from "svelte/store";

export const photographyStore = writable();
export const photographyLoading = writable(false);
export const photographyError = writable(null);

export const photographyActions = {
    fetchPhotographyData: async () => {
        try {
            photographyLoading.set(true);
            photographyError.set(null);
            const response = await fetch("/api/photography");
            if (!response.ok) {
                throw new Error("Failed to fetch photography data");
            }
            const data = await response.json();
            photographyStore.set(data);
        } catch (error) {
            console.log("Error: ", error.message)
            photographyError.set(error.message);
        } finally {
            photographyLoading.set(false);
        }
    },

    clearPhotographyData: () => {
        photographyStore.set(null);
    },

    setPhotographyData: (newData) => {
        photographyStore.set(newData);
    },

    updatePhotographyItem: (id, updatedItem) => {
        photographyStore.update((items, idx) => {
            return items.map(item => idx === id ? { ...item, ...updatedItem } : item);
        });
    },

    updatePhotographyDB: async (title, updatedData) => {
        try {
            photographyLoading.set(true);
            photographyError.set(null);
            const payload = { title, urls: [...updatedData] };
            const response = await fetch(`/api/photography/${title}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to update photography data");
            }

            photographyStore.set(updatedData)

        } catch (error) {
            photographyError.set(error.message);
        } finally {
            photographyLoading.set(false);
        }
    }
};