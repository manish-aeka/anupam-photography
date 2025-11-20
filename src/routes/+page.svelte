<script lang="ts">
  // @ts-nocheck

  import Navbar from "$lib/components/Layout/Navbar.svelte";
  import ImageSlider from "$lib/components/Hero/ImageSlider.svelte";
  import CategoriesShowcase from "$lib/components/Categories/CategoriesShowcase.svelte";
  import GalleryGrid from "$lib/components/Gallery/GalleryGrid.svelte";
  import ContactSection from "$lib/components/Contact/ContactSection.svelte";
  import Footer from "$lib/components/Layout/Footer.svelte";
  import ImageModal from "$lib/components/Gallery/ImageModal.svelte";

  import { onMount } from "svelte";

  import {
    photographyActions,
    photographyStore,
    photographyLoading,
    photographyError,
  } from "$lib/stores/photography.js";

  import { currentSliderIndex } from "$lib/stores/images.js";
  import AboutSection from "$lib/components/About/AboutSection.svelte";
  

    let minTimeDone = false;
  // Fetch data on client
  onMount(() => {
    setTimeout(() => {
      minTimeDone = true;
    }, 3000);
    photographyActions.fetchPhotographyData();
  });

  // Stores
  $: data = $photographyStore ?? [];
  $: isLoading = $photographyLoading;
  $: error = $photographyError;

  // Extract sections
  $: carousel = data.find?.((s) => s.title === "Carousel");
  $: featured = data.find?.((s) => s.title === "Featured");
  $: settings = data.find?.((s) => s.title === "Settings");

  $: currentIndex = $currentSliderIndex;
</script>

<Navbar />

<main>
  {#if isLoading|| !minTimeDone}
    <!-- Loader Video -->
    <video autoplay muted loop playsinline class="loader-video">
      <source src="/videos/loaderHD.mp4" type="video/mp4" />
    </video>
  {:else if error}
    <p class="text-center text-red-500 py-20">{error}</p>
  {:else}
    <!-- PAGE CONTENT -->
    {#if carousel?.urls?.length}

      <ImageSlider images={carousel.urls} />
    {/if}

    {#if featured?.urls?.length}
    <AboutSection/>
      <CategoriesShowcase />
      <GalleryGrid images={featured.urls} />
      <ContactSection />
      <Footer />
    {/if}
  {/if}
</main>

<ImageModal />

<style>
  .loader-video {
    width: 100%;
    height: 100vh;
    object-fit: cover;
    display: block;
  }
</style>
