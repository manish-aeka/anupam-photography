<script lang="ts">
    import Navbar from "$lib/components/Admin/navbar.svelte";
    import Sidebar from "$lib/components/Admin/sidebar.svelte";
</script>

<div class="bg-primary h-screen w-full">
    <Navbar />

    <div class="flex h-full w-full">
        <!-- sidebar -->
        <Sidebar />
        <!-- main content -->
        <div class="h-full w-full p-4 flex-1">
            <slot />
        </div>
    </div>
</div>
