<script>
    import Common from "$lib/components/Admin/common.svelte";
    import { photographyStore } from "$lib/stores/photography";
    let pageName = "Featured";
    let images = $state(
        $photographyStore
            ?.find((item) => item.title === pageName)
            ?.urls.map((url, i) => ({
                id: i,
                url,
                alt: "",
            })),
    );
</script>

<Common {pageName} {images} />
