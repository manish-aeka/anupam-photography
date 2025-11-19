<script>
  import { imagesStore } from '$lib/stores/images.js';
  import CategoryCard from './CategoryCard.svelte';

  $: categories = $imagesStore?.categories || [];
</script>

<div id="categories-container" 
     class="flex flex-wrap justify-center gap-12 bg-gray-900 p-2 md:p-10">

  {#each categories as category, index}
    <CategoryCard {category} {index} />
  {/each}

</div>
