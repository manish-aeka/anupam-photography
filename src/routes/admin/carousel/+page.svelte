<script>
    // @ts-nocheck

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
    import { Edit, Eye, MonitorX, Upload } from "lucide-svelte";

    import { dndzone } from "$lib/dnd";
    let showCarousel = false;
    let currentIndex = $currentSliderIndex;
    let carouselImages = imagesData?.sliderImages.map((src, i) => ({
        id: `${i}-${Date.now()}`,
        src,
        alt: "",
    }));

    async function handleDnd(e) {
        carouselImages = e.detail.items;
        // Update the order in the backend
        try {
            const urls = carouselImages.map((img) => img.src);
            await fetch("/api/photography", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Carousel", urls }),
            });
        } catch (err) {
            console.error("Failed to update carousel order:", err);
        }
    }

    // Auto get store content
    // $: images = $imagesStore;

    function toggleCarousel() {
        showCarousel = !showCarousel;
    }
</script>

<div class="h-full w-full relative">
    <div
        class="absolute bottom-10 right-10 z-50 bg-blue-600 p-2 rounded-full cursor-pointer"
        on:click={toggleCarousel}
    >
        <svelte:component
            this={showCarousel ? MonitorX : Eye}
            class="text-white w-8 h-8"
        />
    </div>

    {#if showCarousel}
        <ImageSlider images={carouselImages} {currentIndex} />
    {:else}
        <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            use:dndzone={{ items: carouselImages, flipDurationMs: 200 }}
            on:consider={handleDnd}
            on:finalize={handleDnd}
        >
            {#each carouselImages as img, idx (img.id)}
                <div class="relative cursor-pointer">
                    <Edit
                        class="absolute top-2 right-2 text-white w-6 h-6 cursor-pointer hover:bg-blue-500 rounded-full p-1"
                    />
                    <img
                        src={img.src}
                        alt={img.alt || `Image ${idx + 1}`}
                        class="object-center w-82 h-62 border rounded-lg"
                    />
                </div>
            {/each}
        </div>
    {/if}
</div>
