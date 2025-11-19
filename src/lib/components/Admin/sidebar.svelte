<script lang="ts">
    import { page } from "$app/stores";
    import { derived } from "svelte/store";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { GalleryHorizontal, Image, Upload, Settings } from "lucide-svelte";

    const currentPath = derived(page, ($page) => $page.url.pathname);

    const sidebarItems = [
        { name: "Carousel", icon: GalleryHorizontal, url: "/admin/carousel" },
        { name: "Featured", icon: Image, url: "/admin/featured" },
        { name: "Upload", icon: Upload, url: "/admin/upload" },
        { name: "Settings", icon: Settings, url: "/admin/settings" },
    ];

    onMount(() => {
        goto("/admin/carousel");
    });
</script>

<div class="flex flex-col w-58 bg-gray-800">
    <nav class="flex flex-col p-4 space-y-2">
        {#each sidebarItems as item}
            <a
                href={item.url}
                class={`flex items-center gap-2 px-3 py-2 rounded transition-colors
                    hover:bg-gray-700 hover:text-white
                    ${
                        $currentPath === item.url
                            ? "bg-blue-600 text-white font-semibold"
                            : "text-gray-300"
                    }`}
                aria-current={$currentPath === item.url ? "page" : undefined}
            >
                <svelte:component this={item.icon} class="w-5 h-5" />
                {item.name}
            </a>
        {/each}
    </nav>
</div>
