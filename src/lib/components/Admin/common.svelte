<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import {
        Edit,
        Loader2,
        Pencil,
        Save,
        Trash2,
        Upload,
        X,
    } from "lucide-svelte";
    import {
        photographyStore,
        photographyActions,
    } from "$lib/stores/photography";
    // import { fileToBase64 } from "$lib/utils/fileToBase64";
    import { dndzone } from "$lib/dnd";
    import FullscreenModal from "../ui/FullscreenModal.svelte";
    import { onMount } from "svelte";
    import ImageRender from "./imageRender.svelte";

    let { pageName, images: originalImages, maxItems } = $props();

    let showImage = false;
    let images = $state([]);
    let savedImages = $state([]);
    let isEditable = $state(false);
    let updatedImages = $state([]);

    // Initialize local images from props
    $effect(() => {
        images = [...originalImages];
    });

    // For editing image
    let editFileInput = null;
    let editingIdx = null;
    let loading = $state(false);
    let fullscreenIndex = $state(null);
    let openSelectImageModal = $state(false);
    let imagestoShowOnModal = $state([]);

    function handleEditClick(idx) {
        openSelectImageModal = true;
        editingIdx = idx;
    }

    async function handleUpdate() {
        // Update the order in the backend
        if (updatedImages.length === 0) {
            alert(`No changes made to update ${pageName}.`);
            return;
        }
        try {
            loading = true;
            await photographyActions.updatePhotographyDB(
                pageName,
                updatedImages,
            );
            updatedImages = [];

            alert(`${pageName} order updated successfully.`);
        } catch (err) {
            console.error(`Failed to update ${pageName} order:`, err);
        } finally {
            isEditable = false;
            loading = false;
        }
    }

    async function handleEditFileChange(e) {
        const input = e.target;

        if (!input.files || !input.files[0] || editingIdx === null) return;

        const file = input.files[0];

        // Convert → base64 (full data URL)
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file); // FULL BASE64 (with mime)
        });

        // Update ONLY this image index
        images[editingIdx].url = base64;

        // Trigger Svelte reactivity
        images = [...images];
        updatedImages = images.map((img) => img.url);

        // Close editing mode
        editingIdx = null;
    }

    async function handleDnd(e) {
        images = e.detail.items;
        updatedImages = images.map((img) => img.url);
    }

    function toggleCarousel() {
        showImage = !showImage;
    }

    function closeFullscreen() {
        fullscreenIndex = null;
    }

    function handleEditButtonClick(idx) {
        fullscreenIndex = idx;
    }

    function handleAddMoreImage() {
        editingIdx = null;
        isEditable = true;
        openSelectImageModal = true;
    }

    function handleDelete(idx) {
        if (confirm("Are you sure you want to delete this image?")) {
            images = images.filter((_, i) => i !== idx);
            updatedImages = images.map((img) => img.url);
        }
    }

    const fetchImages = async () => {
        try {
            // Placeholder for fetching images logic
            const response = await fetch("/api/images?order=desc");
            const data = await response.json();
            imagestoShowOnModal = data?.data;
        } catch (error) {
            console.log("Error: ", error.message);
        } finally {
            loading = false;
        }
    };

    onMount(() => {
        fetchImages();
    });
</script>

<div class="h-full w-full relative">
    <div class="flex justify-end gap-2 mb-4">
        {#if images.length < maxItems}
            <Button
                variant="outline"
                disabled={loading}
                class="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-500 border-none cursor-pointer"
                onclick={() => {
                    handleAddMoreImage();
                }}
            >
                <Upload class="w-4 h-4" />
                Upload
            </Button>
        {/if}
        <Button
            variant="outline"
            disabled={loading}
            class={`flex items-center gap-2 text-white 
        ${isEditable ? "bg-green-600 hover:bg-green-500" : "bg-blue-600 hover:bg-blue-500"} 
        border-none cursor-pointer`}
            onclick={() => {
                if (isEditable) {
                    handleUpdate();
                } else {
                    // Save current state before editing
                    savedImages = JSON.parse(JSON.stringify(images));
                    isEditable = true;
                }
            }}
        >
            {#if loading}
                <Loader2 class="w-4 h-4 animate-spin" />
                Updating...
            {:else if !isEditable}
                <Pencil class="w-4 h-4" />
                Edit {pageName}
            {:else}
                <Save class="w-4 h-4" />
                Update {pageName}
            {/if}
        </Button>

        {#if isEditable}
            <Button
                variant="outline"
                disabled={loading}
                class="flex items-center gap-2 text-white bg-red-600 hover:bg-red-500 border-none cursor-pointer"
                onclick={() => {
                    // Restore previous state
                    images = JSON.parse(JSON.stringify(savedImages));
                    updatedImages = [];
                    isEditable = false;
                }}
            >
                <X class="w-4 h-4" />
                Cancel
            </Button>
        {/if}
    </div>

    {#if images.length === 0}
        <div class="flex items-center justify-center h-60 w-full">
            <p class="text-gray-500 text-lg">No images available.</p>
        </div>
    {/if}

    <!-- <h1>{images?.length}</h1> -->

    <div
        class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4"
        use:dndzone={{
            items: images,
            flipDurationMs: 200,
            dragDisabled: !isEditable,
        }}
        onconsider={handleDnd}
        onfinalize={handleDnd}
    >
        {#each images as img, idx (img?.id)}
            <div class="relative cursor-pointer">
                {#if isEditable}
                    <div class="absolute top-2 right-2 flex gap-1 z-10">
                        <Edit
                            class="text-white w-6 h-6 cursor-pointer bg-gray-800 hover:bg-blue-500 rounded-full p-1"
                            onclick={() => handleEditClick(idx)}
                        />
                        <Trash2
                            class="text-white w-6 h-6 cursor-pointer bg-gray-800 hover:bg-red-500 rounded-full p-1"
                            onclick={() => handleDelete(idx)}
                        />
                    </div>
                {/if}
                <!-- Hidden file input for editing image -->
                <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    bind:this={editFileInput}
                    onchange={handleEditFileChange}
                />

                <button
                    class="cursor-pointer"
                    onclick={() => handleEditButtonClick(idx)}
                >
                    <ImageRender url={img.url} alt={img.alt} />
                </button>
            </div>
        {/each}
    </div>
</div>

<FullscreenModal
    images={images?.map((f) => ({ src: f.url || "", alt: f.name ?? "" }))}
    index={fullscreenIndex ?? 0}
    open={fullscreenIndex !== null && images.length > 0}
    onClose={closeFullscreen}
/>
{#if openSelectImageModal}
    <div
        class="absolute top-20 right-20 h-[500px] w-[500px] bg-gray-800 rounded-lg p-2"
    >
        <X
            class="w-8 h-8 cursor-pointer text-white bg-red-500 hover:bg-red-600 rounded-full p-2 absolute top-2 right-2"
            onclick={() => (openSelectImageModal = false)}
        />
        <div class="flex flex-col gap-2 h-full">
            <h1 class="text-white text-xl text-center border-b pb-2">
                Select From Existing Images
            </h1>

            <div class="overflow-auto grid grid-cols-3 gap-2 p-2">
                {#each imagestoShowOnModal as img, idx}
                    <button
                        class="p-2 hover:bg-gray-700 rounded cursor-pointer"
                        onclick={() => {
                            if (editingIdx !== null) {
                                // Update existing image
                                images[editingIdx] = {
                                    ...images[editingIdx],
                                    url: img.url,
                                    alt: img.alt || images[editingIdx].alt,
                                };

                                images = [...images]; // Trigger reactivity
                                updatedImages = images.map((i) => i.url);

                                editingIdx = null;
                                openSelectImageModal = false;
                            } else {
                                // Add new image
                                const newImage = {
                                    id: images.length,
                                    url: img.url,
                                    alt: img.alt || "New Image",
                                };

                                images = [...images, newImage];
                                updatedImages = images.map((i) => i.url);

                                openSelectImageModal = false;
                            }
                        }}
                    >
                        <img
                            src={img.url}
                            alt={img.alt || `Image ${idx + 1}`}
                            class=" object-cover rounded"
                        />
                    </button>
                {/each}
            </div>
        </div>
    </div>
{/if}
