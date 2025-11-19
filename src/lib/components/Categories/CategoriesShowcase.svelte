<script>
// @ts-nocheck

  import { imagesStore } from '$lib/stores/images.js';
  import CategoryCard from './CategoryCard.svelte';

  let categories = $state([]);

  // Svelte 5: subscribe manually
  $effect(() => imagesStore.subscribe(data => {
    categories = data.categories;
  }));
</script>

<div id="categories-container" 
     class="flex flex-wrap justify-center gap-12  border-b-white bg-gray-900 p-2 md:p-10">

  {#each categories as category, index}
    <CategoryCard {category} {index} />
  {/each}

</div>
