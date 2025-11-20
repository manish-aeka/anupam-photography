<script>
    import Navbar from "$lib/components/Layout/Navbar.svelte";
    import ImageSlider from "$lib/components/Hero/ImageSlider.svelte";
    import AboutSection from "$lib/components/About/AboutSection.svelte";
    import CategoriesShowcase from "$lib/components/Categories/CategoriesShowcase.svelte";
    import GalleryGrid from "$lib/components/Gallery/GalleryGrid.svelte";
    import ContactSection from "$lib/components/Contact/ContactSection.svelte";
    import imagesData from "$lib/data/images.json";
    import ImageModal from "$lib/components/Gallery/ImageModal.svelte";
    import {
        currentSliderIndex,
        imagesStore,
        selectedImage,
    } from "$lib/stores/images";
    import { onMount } from "svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import {
        Edit,
        Eye,
        Loader2,
        MonitorX,
        Pencil,
        Save,
        Upload,
    } from "lucide-svelte";
    import {
        photographyStore,
        photographyActions,
    } from "$lib/stores/photography";
    // import { fileToBase64 } from "$lib/utils/fileToBase64";
    import { dndzone } from "$lib/dnd";
    import { fileToBase64 } from "$lib/utils/utils";

    let showImage = false;
    let currentIndex = $currentSliderIndex;
    let images = $state(
        $photographyStore
            ?.find((item) => item.title === "Carousel")
            .urls.map((url, i) => ({
                id: i,
                url,
                alt: "",
            })),
    );

    let pageName = "Carousel";
    let isEditable = $state(false);
    let updatedImages = $state([]);

    // For editing image
    let editFileInput = null;
    let editingIdx = null;
    let loading = $state(false);

    function handleEditClick(idx) {
        editingIdx = idx;
        if (editFileInput) {
            editFileInput.value = "";
            editFileInput.click();
        }
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
            isEditable = false;

            alert(`${pageName} order updated successfully.`);
        } catch (err) {
            console.error(`Failed to update ${pageName} order:`, err);
        } finally {
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
</script>

<div class="h-full w-full relative">
    <div class="flex justify-end">
        <Button
            variant="outline"
            disabled={loading}
            class={`mb-4 flex items-center gap-2 text-white 
        ${isEditable ? "bg-green-600 hover:bg-green-500" : "bg-blue-600 hover:bg-blue-500"} 
        border-none cursor-pointer`}
            onclick={() => {
                if (isEditable) handleUpdate();
                isEditable = true;
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
    </div>
    <!-- <button
        type="button"
        class="absolute bottom-10 right-10 z-50 bg-blue-600 p-2 rounded-full cursor-pointer focus:outline-none"
        onclick={toggleCarousel}
        aria-label={showImage ? "Hide Carousel" : "Show Carousel"}
    >
        <svelte:component
            this={showImage ? MonitorX : Eye}
            class="text-white w-8 h-8"
        />
    </button> -->

    <!-- {#if showImage}
        <ImageSlider {images} {currentIndex} />
    {:else} -->
    <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        use:dndzone={{ items: images, flipDurationMs: 200 }}
        onconsider={handleDnd}
        onfinalize={handleDnd}
    >
        {#each images as img, idx (img.id)}
            <div class="relative cursor-pointer">
                {#if isEditable}
                    <Edit
                        class="absolute top-2 right-2 text-white w-6 h-6 cursor-pointer bg-gray-800 hover:bg-blue-500 rounded-full p-1"
                        onclick={() => handleEditClick(idx)}
                    />
                {/if}
                <!-- Hidden file input for editing image -->
                <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    bind:this={editFileInput}
                    onchange={handleEditFileChange}
                />
                <!-- <img
                        src={img.src}
                        alt={img.alt || `Image ${idx + 1}`}
                        class="object-center w-82 h-62 border rounded-lg"
                    /> -->

                <img
                    src={img.url}
                    alt={img.alt || `Image ${idx + 1}`}
                    class="object-cover w-full h-full border rounded-lg"
                />
            </div>
        {/each}
    </div>
    <!-- {/if} -->
</div>
