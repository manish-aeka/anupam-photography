<script>
  import { navbarScrolled } from '$lib/stores/ui.js';
  import { onMount } from 'svelte';

  let scrolled = $state(false);

  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 10;
      navbarScrolled.set(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<nav
  class="fixed top-0 left-0 w-full flex justify-between  items-center px-2 py-2 md:px-10 md:py-2 
          z-50 transition-all duration-300
         {scrolled ? 'bg-gray-900 text-amber-50 shadow-md' : 'text-black backdrop-blur-sm   '}"
>
  <a href="/" class="hover:text-yellow-300 text-xl font-bold">ADP</a>

 <h1
  class="hidden md:block md:text-2xl font-sans font-semibold tracking-widest uppercase
         px-4 py-2 rounded-xl
          {scrolled?'':' '}"
>
  ANUPAM DUTTA PHOTOGRAPHY
</h1>

  <!-- svelte-ignore event_directive_deprecated -->
  <button
    class="bg-indigo-500 text-white sm:px-4 sm:py-2 px-2 py-1 sm:text-base text-xs rounded-full font-semibold hover:bg-indigo-600 transition"
    on:click={() => (window.location.href = 'mailto:anupam@gmail.com')}
  >
    Book a Photoshoot
  </button>
</nav>
