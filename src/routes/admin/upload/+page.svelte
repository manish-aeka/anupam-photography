<script lang="ts">
    import { UploadCloud, Image as ImageIcon, X, Upload } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import { derived, writable } from "svelte/store";
    import FullscreenModal from "$lib/components/ui/FullscreenModal.svelte";
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    let fileInput: HTMLInputElement | null = null;

    type FileItem = {
        file: File;
        name: string;
        sizeKB: string;
        progress: number;
        preview?: string;
    };

    let imageUploadLoading = $state(false);
    let loading = $state(false);

    const currentPath = derived(page, ($page) => $page.url.pathname);

    let images = $state<any[]>([]);

    const files = writable<FileItem[]>([]);

    let fullscreenIndex: number | null = null;

    function formatKB(size: number) {
        return `${Math.round(size / 1024)} kb`;
    }

    async function uploadFiles() {
        try {
            imageUploadLoading = true;

            const form = new FormData();

            // ✅ append each file individually
            $files.forEach((item) => {
                form.append("photos", item.file);
            });

            const response = await fetch("/api/images", {
                method: "POST",
                body: form,
            });

            const data = await response.json();
            console.log("Upload result:", data);
            const newlyAdded = data.data || [];

            console.log(newlyAdded);

            if (!response.ok) {
                alert(data.error || "Upload failed");
                return;
            }
            images = [...newlyAdded, ...images];

            $files = [];
            alert("Uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            alert("Something went wrong!");
        } finally {
            imageUploadLoading = false;
        }
    }

    function addFiles(fileList: FileList) {
        const newFiles: FileItem[] = [];
        for (const file of fileList) {
            const preview = URL.createObjectURL(file);
            newFiles.push({
                file,
                name: file.name,
                sizeKB: formatKB(file.size),
                progress: 100, // Set to 100 for instant upload, or implement progress if needed
                preview,
            });
        }
        files.update((f) => [...f, ...newFiles]);
    }

    function removeFile(index: number) {
        files.update((f) => f.filter((_, i) => i !== index));
        if (fullscreenIndex !== null && fullscreenIndex === index)
            fullscreenIndex = null;
    }

    function openFullscreen(index: number) {
        fullscreenIndex = index;
    }

    function closeFullscreen() {
        fullscreenIndex = null;
    }

    const fetchImages = async () => {
        try {
            loading = true;
            // Placeholder for fetching images logic
            const response = await fetch("/api/images?order=desc");
            const data = await response.json();
            images = data?.data;
        } catch (error) {
            console.log("Error: ", error.message);
        } finally {
            loading = false;
        }
    };

    onMount(() => {
        fetchImages();
    });

    $effect(() => {
        currentPath;
        fetchImages();
    });
</script>

<div class="flex gap-2 w-full flex-col overflow-auto">
    <div class="flex flex-col gap-4 w-full">
        <div class="w-full flex flex-col md:flex-row gap-6 mt-4">
            {#if $files.length === 0}
                <!-- Only show upload, full width, 50% screen height -->
                <div
                    class="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center gap-4 w-full"
                    style="height: 30vh;"
                    role="region"
                    aria-label="File upload area"
                >
                    <UploadCloud class="w-20 h-20 text-white" />
                    <h2 class="text-lg font-semibold text-white">
                        Drag & drop here
                    </h2>
                    <p class="text-white -mt-3">or</p>
                    <Button
                        variant="outline"
                        class="border-white text-white hover:bg-blue-500 cursor-pointer"
                        onclick={() => fileInput && fileInput.click()}
                    >
                        Browse Files
                    </Button>
                    <input
                        type="file"
                        multiple
                        class="hidden"
                        bind:this={fileInput}
                        on:change={(e) => {
                            const input = e.target as HTMLInputElement | null;
                            if (input?.files) addFiles(input.files);
                        }}
                    />
                </div>
            {:else}
                <!-- Side by side: upload left, file list right -->
                <div
                    class="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center gap-4 w-full md:w-1/2"
                    style="max-height: 30vh;"
                    role="region"
                    aria-label="File upload area"
                >
                    <UploadCloud class="w-20 h-20 text-purple-500" />
                    <h2 class="text-lg font-semibold text-gray-700">
                        Drag & drop here
                    </h2>
                    <p class="text-gray-500 -mt-3">or</p>
                    <Button
                        variant="outline"
                        class="border-white text-white hover:bg-blue-500 cursor-pointer"
                        onclick={() => fileInput && fileInput.click()}
                    >
                        Browse Files
                    </Button>
                    <input
                        type="file"
                        multiple
                        class="hidden"
                        bind:this={fileInput}
                        on:change={(e) => {
                            const input = e.target as HTMLInputElement | null;
                            if (input?.files) addFiles(input.files);
                        }}
                    />
                </div>
                <div
                    class="space-y-4 overflow-y-auto w-full md:w-1/2 max-h-[30vh] pr-2"
                >
                    {#each $files as item, index}
                        <div
                            class="p-4 bg-purple-50 rounded-xl flex items-center gap-4 shadow-sm"
                        >
                            <div
                                class="w-12 h-12 bg-white rounded-md border flex items-center justify-center cursor-pointer"
                                on:click={() => openFullscreen(index)}
                            >
                                {#if item.preview}
                                    <img
                                        src={item.preview}
                                        alt={item.name}
                                        class="w-full h-full object-cover rounded-md"
                                    />
                                {:else}
                                    <ImageIcon class="text-white" />
                                {/if}
                            </div>
                            <div class="flex-1">
                                <p class="font-medium text-white">
                                    {item.name}
                                </p>
                                <p class="text-sm text-white mt-1">
                                    {item.sizeKB}
                                </p>
                            </div>
                            <button
                                class="text-gray-500 hover:text-red-500"
                                on:click={() => removeFile(index)}
                            >
                                <X class="w-5 h-5" />
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
        <Button
            disabled={$files.length === 0 || imageUploadLoading}
            variant="outline"
            class="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white border-none cursor-pointer hover:text-white"
            onclick={uploadFiles}
        >
            <Upload />
            {imageUploadLoading ? "Uploading..." : "Upload Images"}
        </Button>
    </div>

    {#if loading}
        <p class="text-white text-center mt-12 text-2xl">Loading images...</p>
    {:else}
        <div>
            <h2 class="text-xl font-semibold mb-4 text-white">
                Uploaded Images
            </h2>
            <div class="border rounded-lg p-4">
                {#if images?.length === 0}
                    <p class="text-white">No images uploaded yet.</p>
                {:else}
                    <div
                        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                    >
                        {#each images as img, idx}
                            <img
                                src={`data:image/jpeg;base64,${img.url}`}
                                alt={img.alt || `Image ${idx + 1}`}
                                class="object-cover w-full h-full border rounded-lg"
                            />
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<!-- Fullscreen Image Modal as component -->
<FullscreenModal
    images={$files.map((f) => ({ src: f.preview || "", alt: f.name }))}
    index={fullscreenIndex ?? 0}
    open={fullscreenIndex !== null && $files.length > 0}
    onClose={closeFullscreen}
/>
