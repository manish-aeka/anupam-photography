<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
    import "aos/dist/aos.css";
  import AOS from "aos";
 
  import { onMount } from "svelte";
  
 

  function initAOS() {
    AOS.init({
      duration: 900,
      easing: "ease-out",
      once: false,        // animate every time on scroll
      offset: 120,        // better triggering
      mirror: true,       // allow reverse animation
    });

    AOS.refreshHard();    // VERY IMPORTANT for Svelte 5
  }

  onMount(() => {
    initAOS();
  });

 $effect(() => {
    // small timeout ensures DOM update completes first
    setTimeout(() => {
      AOS.refresh();
    }, 20);
  });








	let { children } = $props();
	

  
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
