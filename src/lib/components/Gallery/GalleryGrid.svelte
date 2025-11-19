<script>
// @ts-nocheck
import { selectedImage, isModalOpen } from '$lib/stores/images.js';

export let images = [];

function openModal(img) {
  selectedImage.set(img);
  isModalOpen.set(true);
}

function getImageClass(i) {
  return i % 6 === 0
    ? "row-span-2 col-span-2"
    : i % 5 === 0
    ? "row-span-2"
    : i % 4 === 0
    ? "col-span-2"
    : "";
}

// Mosaic animation directions
const mosaicEffects = [
  "fade-up",
  "fade-down",
  "fade-left",
  "fade-right",
  "zoom-in",
  "zoom-in-up",
  "zoom-in-left",
  "zoom-in-right"
];

// Get effect based on index
const getEffect = (i) => mosaicEffects[i % mosaicEffects.length];

// Stagger + mosaic jitter
const getDelay = (i) => (i * 150) + Math.floor(Math.random() * 150);
</script>

<section id="gallery" class="flex bg-gray-900 flex-col gap-1 md:gap-2 p-2">
  <div class="text-center mt-5">
    <span class="inline-block bg-red-500 text-white px-4 py-1 text-xs font-semibold rounded-md shadow">
      Featured
    </span>
    <h1 class="text-4xl text-amber-50 font-serif mt-3">Latest Collections</h1>
  </div>

  <!-- Mosaic Masonry Grid -->
  <div class="max-w-6xl mx-auto my-10 grid grid-cols-3 gap-4">
    {#each images as img, i}
      <div
        data-aos={getEffect(i)}
        data-aos-delay={getDelay(i)}
        data-aos-duration="900"
        class="relative overflow-hidden rounded-lg cursor-pointer
               transition-all duration-700 transform {getImageClass(i)}"
        on:click={() => openModal(img)}
      >
        <img
          src={img}
          alt={"Gallery image " + (i + 1)}
          class="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
        />

        <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span class="text-white text-xs bg-gray-500 bg-opacity-40 px-3 py-1.5 rounded-md backdrop-blur-sm">
            Click to view
          </span>
        </div>
      </div>
    {/each}
  </div>
</section>
