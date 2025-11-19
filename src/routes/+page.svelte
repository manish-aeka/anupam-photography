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

  onMount(() => {
    imagesStore.set(imagesData);
  });

  // Auto get store content
  $: images = $imagesStore;

  $: currentIndex = $currentSliderIndex;
</script>

<Navbar />
<main>
  {#if images && images.sliderImages}
    <ImageSlider images={images.sliderImages} {currentIndex} />
  {/if}

  <!-- <AboutSection /> -->
  {#if images && images.categories}
    <CategoriesShowcase categories={images.categories} />
  {/if}

  {#if images && images.galleryImages}
    <GalleryGrid images={images.galleryImages} />
  {/if}
  <ContactSection />
</main>

<ImageModal />
