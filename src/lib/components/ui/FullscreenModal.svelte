<script lang="ts">
    import { X } from "lucide-svelte";
    export let images: { src: string; alt?: string }[] = [];
    export let index: number = 0;
    export let open: boolean = false;
    export let onClose: () => void = () => {};

    let currentIndex = index;
    $: if (open) currentIndex = index;
    $: currentImage = images[currentIndex];

    $: isFirst = currentIndex === 0;
    $: isLast = currentIndex === images.length - 1;

    function next() {
        if (images.length > 0 && !isLast) {
            currentIndex = currentIndex + 1;
        }
    }
    function prev() {
        if (images.length > 0 && !isFirst) {
            currentIndex = currentIndex - 1;
        }
    }
    function handleClose() {
        onClose();
    }
</script>

{#if open && images.length > 0}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
    >
        <button
            class="fixed top-6 right-8 z-50 text-white text-3xl bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 hover:bg-red-500 cursor-pointer transition"
            on:click={handleClose}
            aria-label="Close"
        >
            <X class="w-8 h-8" />
        </button>
        {#if !isFirst}
            <button
                class="absolute left-6 top-1/2 -translate-y-1/2 z-50 text-white text-3xl bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 hover:bg-blue-500 transition cursor-pointer"
                on:click={prev}
                aria-label="Previous"
            >
                &#8592;
            </button>
        {/if}
        {#if !isLast}
            <button
                class="absolute right-6 top-1/2 -translate-y-1/2 z-50 text-white text-3xl bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 hover:bg-blue-500 transition cursor-pointer"
                on:click={next}
                aria-label="Next"
            >
                &#8594;
            </button>
        {/if}
        <img
            src={currentImage.src}
            alt={currentImage.alt || ""}
            class="w-screen h-screen object-contain bg-black"
            style="position: absolute; top: 0; left: 0; z-index: 0;"
        />
        {#if !isLast}
            <button
                class="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl cursor-pointer"
                on:click={next}
                aria-label="Next"
            >
                &#8594;
            </button>
        {/if}
    </div>
{/if}
