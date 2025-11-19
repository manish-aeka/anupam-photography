<script>
  // @ts-nocheck

  import { imagesStore, currentSliderIndex } from "$lib/stores/images.js";
  import { onMount, beforeUpdate } from "svelte";

  // Auto-reactive store values
  export let images = [];

  $: currentIndex = $currentSliderIndex;

  let intervalId;

  function changeSlide(index) {
    currentSliderIndex.set(index);
  }

  function startSlider() {
    intervalId = setInterval(() => {
      // Get the current value directly from the store for the interval
      currentSliderIndex.update((n) => (n + 1) % images.length);
    }, 1000); // Changed to 4 seconds
  }

  function stopSlider() {
    if (intervalId) clearInterval(intervalId);
  }

  onMount(() => {
    startSlider();
    return stopSlider;
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="relative h-screen w-full overflow-hidden"
  onmouseenter={stopSlider}
  onmouseleave={startSlider}
>
  <!-- Slides -->
  {#each images as image, index}
    <img
      src={image}
      alt={`Photography Cover Image ${index + 1}`}
      class="absolute inset-0 w-full h-full object-cover
             transition-opacity duration-1000 ease-in-out
             {index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}"
    />
  {/each}

  <!-- Dots -->
  <div class="absolute bottom-10 w-full flex justify-center gap-3 z-20">
    {#each images as _, index}
      <!-- svelte-ignore element_invalid_self_closing_tag -->
      <button
        onclick={() => changeSlide(index)}
        class="w-3 h-3 rounded-full cursor-pointer transition
               {index === currentIndex ? 'bg-white' : 'bg-white/50'}"
        aria-label={`Go to slide ${index + 1}`}
      />
    {/each}
  </div>
</div>
