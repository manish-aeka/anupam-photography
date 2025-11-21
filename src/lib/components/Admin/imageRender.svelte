<script>
    let { url, alt } = $props();
</script>

<img
    src={url}
    alt={alt || `Image`}
    class="object-center h-56 w-62 border rounded-lg"
/>
