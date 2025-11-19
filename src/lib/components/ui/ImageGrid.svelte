<script lang="ts">
    import FullscreenModal from "./FullscreenModal.svelte";
    export let images: { src: string; alt?: string }[] = [];

    let modalOpen = false;
    let selectedIdx = 0;

    function openModal(idx: number) {
        selectedIdx = idx;
        modalOpen = true;
    }
    function closeModal() {
        modalOpen = false;
    }
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    {#each images as img, idx}
        <button
            class="aspect-square overflow-hidden rounded-lg border bg-white hover:shadow-lg focus:outline-none"
            on:click={() => openModal(idx)}
            aria-label={img.alt || `Image ${idx + 1}`}
        >
            <img
                src={img.src}
                alt={img.alt || `Image ${idx + 1}`}
                class="object-cover w-full h-full"
            />
        </button>
    {/each}
</div>

<FullscreenModal
    {images}
    index={selectedIdx}
    open={modalOpen}
    onClose={closeModal}
/>
