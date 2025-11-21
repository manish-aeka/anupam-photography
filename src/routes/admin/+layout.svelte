<script lang="ts">
  import Navbar from "$lib/components/Admin/navbar.svelte";
  import Sidebar from "$lib/components/Admin/sidebar.svelte";
  import { onMount } from "svelte";
  import {
    photographyStore,
    photographyActions,
    photographyLoading,
    photographyError,
  } from "$lib/stores/photography";
  import { page } from "$app/stores";
  import AdminLoader from "$lib/components/loader/adminLoader.svelte";

  onMount(async () => {
    // Load initial photography data
    photographyActions.fetchPhotographyData();
  });
</script>

{#if $photographyLoading}
  <div class="flex items-center justify-center h-screen w-full">
    <AdminLoader/>    
  </div>
{:else if $photographyError}
  <div class="flex items-center justify-center h-screen w-full">
    <p class="text-red-500 text-lg">Error: {$photographyError}</p>
  </div>
{:else}
  <div class="bg-gray-900 h-screen w-full flex flex-col">
    <Navbar />

    <div class="flex w-full flex-1 min-h-0">
      <!-- sidebar -->
      <Sidebar />
      <!-- main content -->
      <div class="h-full w-full p-4 flex-1 overflow-auto">
        <slot />
      </div>
    </div>
  </div>
{/if}
