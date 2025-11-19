<script lang="ts">
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
  import Footer from "$lib/components/Layout/Footer.svelte";
  import { json } from "@sveltejs/kit";

    export let data;

  // Load data into store on client only
  onMount(() => {
    imagesStore.set(data.sections);
  });




  // Auto get store content
  $: sections = $imagesStore;

  $: carousel = sections?.find?.(s => s.title === "Carousel");
  $: featured = sections?.find?.(s => s.title === "Featured");
  $: settings = sections?.find?.(s => s.title === "Settings");

  $: currentIndex = $currentSliderIndex;
</script>

<Navbar />
<main>
   {#if  carousel.urls.length > 0}
  <ImageSlider images={carousel.urls} />
{/if}

  <!-- <AboutSection /> -->
  <!-- {#if images && images.categories}
    <CategoriesShowcase categories={images.categories} />
  {/if} -->

  {#if  featured.urls.length>0}
    <GalleryGrid images={featured.urls} />
  {/if}
  <ContactSection />
  <Footer/>
</main>

<ImageModal />
