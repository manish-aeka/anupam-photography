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
            // photographyLoading.set(true);
            photographyError.set(null);

            const payload = {
                title,
                urls: Array.isArray(updatedData) ? [...updatedData] : []
            };

            const response = await fetch("/api/photography", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const msg = await response.text().catch(() => "Unknown error");
                throw new Error(msg || "Failed to update photography data");
            }

            // Optional: use response JSON if backend returns the updated record
            // const result = await response.json();

            // Update Svelte store
            photographyStore.update(items =>
                items.map(item =>
                    item.title === title
                        ? { ...item, urls: [...payload.urls] }
                        : item
                )
            );

        } catch (err) {
            console.error("Update error:", err);
            photographyError.set(err.message || "Unexpected error");
        } finally {
            photographyLoading.set(false);
        }
    }

};