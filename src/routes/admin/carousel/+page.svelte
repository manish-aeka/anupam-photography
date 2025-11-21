<script>
    import { page } from "$app/state";
    import Common from "$lib/components/Admin/common.svelte";
    import { photographyStore } from "$lib/stores/photography";
    let pageName = "Carousel";

    const data = $photographyStore.find((item) => item.title === pageName);

    const images = data
        ? data.urls.map((url, i) => ({ id: i, url, alt: "" }))
        : [];

    const maxItems = data ? data.max_items : 0;
</script>

<Common {pageName} {images} {maxItems} />
