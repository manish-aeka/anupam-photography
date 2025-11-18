<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { onMount } from "svelte";

    let images = $state([]);

    const fetchImages = async () => {
        console.log("fetch images");
        const response = await fetch("/api/images");
        const data = await response.json();
        images = data.data;
        console.log(data.data);
    };

    onMount(() => {
        fetchImages();
    });
</script>

{#each images as image}
    {#each images as image}
        <img
            src={`data:${image.mimeType};base64,${image.url}`}
            alt="Uploaded Image"
            class="w-32 h-32 object-cover m-2"
        />
    {/each}
{/each}

<h1 class="text-red-500">hii</h1>
<Button>Click me</Button>
