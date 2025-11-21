<script>
    let { url, alt } = $props();
</script>

<img
    src={url}
    alt={alt || `Image`}
    class="object-cover w-full h-full border rounded-lg"
/>
