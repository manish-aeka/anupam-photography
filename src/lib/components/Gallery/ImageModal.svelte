<script>
  // @ts-nocheck
  import { selectedImage, isModalOpen } from '$lib/stores/images.js';
  import { onMount } from 'svelte';

  let currentImage = $state(null);
  let modalOpen = $state(false);

  // subscribe to image
  $effect(() => selectedImage.subscribe(v => (currentImage = v)));

  // subscribe to modal open
  $effect(() => isModalOpen.subscribe(v => (modalOpen = v)));

  function closeModal() {
    isModalOpen.set(false);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && modalOpen) closeModal();
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  });
</script>

{#if modalOpen}
  <div
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    on:click={closeModal}
  >
    <button
      class="absolute top-6 right-10 text-white text-4xl font-bold hover:text-red-400"
      on:click={closeModal}
    >
      &times;
    </button>

    {#if currentImage}
      <img
        src={currentImage}
        alt="Full size view"
        class="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl border-4 border-white"
      />
    {/if}
  </div>
{/if}
