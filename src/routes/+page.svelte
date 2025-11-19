<script>
  import Navbar from '$lib/components/Layout/Navbar.svelte';
  import ImageSlider from '$lib/components/Hero/ImageSlider.svelte';
  import AboutSection from '$lib/components/About/AboutSection.svelte';
  import CategoriesShowcase from '$lib/components/Categories/CategoriesShowcase.svelte';
  import GalleryGrid from '$lib/components/Gallery/GalleryGrid.svelte';
  import ContactSection from '$lib/components/Contact/ContactSection.svelte';
  import Footer from '$lib/components/Layout/footer.svelte';
  import ImageModal from '$lib/components/Gallery/ImageModal.svelte';
</script>

<Navbar />
<main>
  <ImageSlider />
  <AboutSection />
  <CategoriesShowcase />
  <GalleryGrid />
  <ContactSection />
</main>
<Footer />
<ImageModal />