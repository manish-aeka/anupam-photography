<script lang="ts">
    import Navbar from "$lib/components/Admin/navbar.svelte";
    import Sidebar from "$lib/components/Admin/sidebar.svelte";
</script>

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
