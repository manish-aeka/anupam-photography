<script>
  import { imagesStore } from '$lib/stores/images.js';
  import CategoryCard from './CategoryCard.svelte';

  $: categories = $imagesStore?.categories || [];
</script>
<div id="categories-container" 
     class="flex flex-wrap justify-center 
            gap-3 xs:gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12
            bg-gray-900 
            p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10
            min-h-screen">

  {#each categories as category, index}
    <CategoryCard {category} {index} />
  {/each}

</div>
