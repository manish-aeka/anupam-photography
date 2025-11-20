<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import { Pencil, Check, Loader2 } from "lucide-svelte";

    let aboutData = {
        _id: "1",
        title: "Wildlife",
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        heading: "Explore Wildlife",
        description:
            "Discover stunning wildlife photography capturing natural habitats and rare species.",
    };

    let editing = false;
    let loadingEdit = false;

    // Convert file → Base64
    async function fileToBase64(file) {
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Update fields
    function updateField(field, value) {
        aboutData = { ...aboutData, [field]: value };
    }

    // Image upload handler
    async function handleImageUpload(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        const base64 = await fileToBase64(file);
        aboutData = { ...aboutData, url: base64 };
    }

    // Save handler
    async function saveAbout() {
        loadingEdit = true;

        // Simulated API request
        // await fetch(`/api/about/${aboutData._id}`, {
        //     method: "PUT",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(aboutData),
        // });

        await new Promise((r) => setTimeout(r, 600));

        loadingEdit = false;
        editing = false;
    }
</script>

<div class="text-white">
    <div class="mb-8 p-6 border rounded-lg shadow relative bg-black/20">
        <!-- RIGHT TOP EDIT/SAVE BUTTON -->
        <div class="absolute top-3 right-3 flex gap-2 mb-3">
            <button
                class="p-2 bg-blue-600 hover:bg-blue-500 rounded cursor-pointer"
                on:click={() => (editing ? saveAbout() : (editing = true))}
                disabled={loadingEdit}
            >
                {#if loadingEdit}
                    <Loader2 class="w-4 h-4 animate-spin cursor-pointer" />
                {:else if editing}
                    <Check class="w-4 h-4 cursor-pointer" />
                {:else}
                    <Pencil class="w-4 h-4 cursor-pointer" />
                {/if}
            </button>
        </div>

        <!-- TITLE -->
        {#if editing}
            <label class="block font-semibold mb-1">Title*</label>
            <input
                class="border p-2 w-full rounded mb-3 bg-transparent text-white"
                bind:value={aboutData.title}
                on:input={(e) => updateField("title", e.target.value)}
            />
        {:else}
            <h2 class="text-2xl font-bold mb-2">{aboutData.title}</h2>
        {/if}

        <!-- IMAGE UPLOAD -->
        {#if editing}
            <label class="block font-semibold mb-1">Upload Image*</label>
            <input
                type="file"
                accept="image/*"
                class="border p-2 w-full rounded mb-3"
                on:change={handleImageUpload}
            />

            <label class="block font-semibold mb-1">Or Image URL</label>
            <input
                class="border p-2 w-full rounded mb-3 bg-transparent text-white"
                bind:value={aboutData.url}
                on:input={(e) => updateField("url", e.target.value)}
            />
        {/if}

        <img
            src={aboutData.url ||
                "https://via.placeholder.com/300x200?text=No+Image"}
            alt={aboutData.title}
            class="w-full h-64 object-cover mb-4 rounded"
        />

        <!-- HEADING -->
        {#if editing}
            <label class="block font-semibold mb-1">Heading*</label>
            <input
                class="border p-2 w-full rounded mb-3 bg-transparent text-white"
                bind:value={aboutData.heading}
                on:input={(e) => updateField("heading", e.target.value)}
            />
        {:else}
            <h3 class="text-xl font-semibold mb-1">{aboutData.heading}</h3>
        {/if}

        <!-- DESCRIPTION -->
        {#if editing}
            <label class="block font-semibold mb-1">Description*</label>
            <textarea
                class="border p-2 w-full rounded mb-3 bg-transparent text-white h-24"
                bind:value={aboutData.description}
                on:input={(e) => updateField("description", e.target.value)}
            ></textarea>
        {:else}
            <p class="text-gray-300">{aboutData.description}</p>
        {/if}
    </div>
</div>
