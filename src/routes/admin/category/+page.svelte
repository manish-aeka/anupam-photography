<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import { Trash, Pencil, Check, Loader2 } from "lucide-svelte";

    let categoryData = [
        {
            _id: "1",
            title: "Wildlife",
            url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            heading: "Explore Wildlife",
            description:
                "Discover stunning wildlife photography capturing natural habitats and rare species.",
        },
        {
            _id: "2",
            title: "Landscape",
            url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            heading: "Beautiful Landscapes",
            description:
                "Experience breathtaking views of mountains, forests, and scenic landscapes.",
        },
        {
            _id: "3",
            title: "Birds",
            url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
            heading: "Bird Photography",
            description:
                "A curated selection of mesmerizing bird photography from around the world.",
        },
        {
            _id: "4",
            title: "Macro",
            url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
            heading: "Macro Shots",
            description:
                "Get up close with macro photography showcasing fine details and textures.",
        },
    ];

    let editingIndex = null;
    let loadingEdit = null;
    let loadingDelete = null;

    async function fileToBase64(file) {
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function updateField(index, field, value) {
        categoryData[index][field] = value;
        categoryData = [...categoryData];
    }

    async function handleImageUpload(event, index) {
        const file = event.target.files?.[0];
        if (!file) return;

        const base64 = await fileToBase64(file);
        categoryData[index].url = base64;
        categoryData = [...categoryData];
    }

    async function saveCategory(i) {
        loadingEdit = i;

        const item = categoryData.find((category) => category["_id"] === i);

        // await fetch(`/api/category/${item._id}`, {
        //     method: "PUT",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(item),
        // });

        loadingEdit = null;
        editingIndex = null;
    }

    async function deleteCategory(i) {
        const item =
            categoryData.find((category) => category["_id"] === i) || null;
        loadingDelete = i;

        // await fetch(`/api/category/${item._id}`, {
        //     method: "DELETE",
        // });

        categoryData = categoryData.filter(
            (category) => category["_id"] !== item["_id"],
        );
        categoryData = [...categoryData];

        loadingDelete = null;
    }

    function addCategory() {
        categoryData = [
            {
                _id: crypto.randomUUID(),
                title: "",
                url: "",
                heading: "",
                description: "",
            },
            ...categoryData,
        ];

        editingIndex = 0;
    }
</script>

<!-- TOP RIGHT ADD CATEGORY BUTTON -->
<div class="flex justify-end mb-4">
    <Button
        class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
        onclick={addCategory}
    >
        + Add New Category
    </Button>
</div>

<div class="text-white grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each categoryData as category, i}
        <div class="mb-8 p-6 border rounded-lg shadow relative bg-black/20">
            <!-- EDIT + DELETE BUTTONS -->
            <div class="absolute top-3 right-3 flex gap-2">
                <!-- EDIT / SAVE BUTTON -->
                <button
                    class="p-2 bg-blue-600 hover:bg-blue-500 rounded cursor-pointer"
                    on:click={() =>
                        editingIndex === category["_id"]
                            ? saveCategory(i)
                            : (editingIndex = category["_id"])}
                    disabled={loadingEdit === i}
                >
                    {#if loadingEdit === i}
                        <Loader2 class="w-4 h-4 animate-spin cursor-pointer" />
                    {:else if editingIndex === category["_id"]}
                        <!-- SHOW CHECK ICON DURING SAVE MODE -->
                        <Check class="w-4 h-4 cursor-pointer" />
                    {:else}
                        <!-- SHOW PENCIL WHEN NOT EDITING -->
                        <Pencil class="w-4 h-4 cursor-pointer" />
                    {/if}
                </button>

                <!-- DELETE BUTTON -->
                <button
                    class="p-2 bg-red-600 hover:bg-red-500 rounded cursor-pointer"
                    on:click={() => deleteCategory(category["_id"])}
                    disabled={loadingDelete === category["_id"]}
                >
                    {#if loadingDelete === category["_id"]}
                        <Loader2 class="w-4 h-4 animate-spin cursor-pointer" />
                    {:else}
                        <Trash class="w-4 h-4 cursor-pointer" />
                    {/if}
                </button>
            </div>

            <!-- TITLE -->
            {#if editingIndex === category["_id"]}
                <label class="block font-semibold mb-1">Title*</label>
                <input
                    class="border p-2 w-full rounded mb-3 bg-transparent text-white"
                    bind:value={category.title}
                    on:input={(e) => updateField(i, "title", e.target.value)}
                />
            {:else}
                <h2 class="text-2xl font-bold mb-2">{category.title}</h2>
            {/if}

            <!-- IMAGE UPLOAD -->
            {#if editingIndex === category["_id"]}
                <label class="block font-semibold mb-1">Upload Image*</label>
                <input
                    type="file"
                    accept="image/*"
                    class="border p-2 w-full rounded mb-3"
                    on:change={(e) => handleImageUpload(e, i)}
                />

                <label class="block font-semibold mb-1">Or Image URL</label>
                <input
                    class="border p-2 w-full rounded mb-3 bg-transparent text-white"
                    bind:value={category.url}
                    on:input={(e) => updateField(i, "url", e.target.value)}
                />
            {/if}

            <img
                src={category.url ||
                    "https://via.placeholder.com/300x200?text=No+Image"}
                alt={category.title}
                class="w-full h-64 object-cover mb-4 rounded"
            />

            <!-- HEADING -->
            {#if editingIndex === category["_id"]}
                <label class="block font-semibold mb-1">Heading</label>
                <input
                    class="border p-2 w-full rounded mb-3 bg-transparent text-white"
                    bind:value={category.heading}
                    on:input={(e) => updateField(i, "heading", e.target.value)}
                />
            {:else}
                <h3 class="text-xl font-semibold mb-1">{category.heading}</h3>
            {/if}

            <!-- DESCRIPTION -->
            {#if editingIndex === category["_id"]}
                <label class="block font-semibold mb-1">Description*</label>
                <textarea
                    class="border p-2 w-full rounded mb-3 bg-transparent text-white h-24"
                    bind:value={category.description}
                    on:input={(e) =>
                        updateField(i, "description", e.target.value)}
                ></textarea>
            {:else}
                <p class="text-gray-300">{category.description}</p>
            {/if}
        </div>
    {/each}
</div>
