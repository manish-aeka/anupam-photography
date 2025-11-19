<script>
    let files = [];
    let dragActive = false;

    function handleFiles(event) {
        const inputFiles = event.target.files || event.dataTransfer.files;
        files = Array.from(inputFiles);
    }

    function handleDrop(event) {
        event.preventDefault();
        dragActive = false;
        handleFiles(event);
    }

    function handleDragOver(event) {
        event.preventDefault();
        dragActive = true;
    }

    function handleDragLeave(event) {
        event.preventDefault();
        dragActive = false;
    }
</script>

<div
    class="flex flex-col items-center justify-center min-h-[60vh] p-8 mx-auto max-w-xl mt-8"
>
    <div
        class="w-full border-2 border-dashed border-blue-400 rounded-2xl bg-white flex flex-col items-center py-10 px-4 relative"
        on:drop={handleDrop}
        on:dragover={handleDragOver}
        on:dragleave={handleDragLeave}
        on:click={() => document.getElementById("image-upload").click()}
        style="cursor:pointer;"
    >
        <div class="flex flex-col items-center">
            <div
                class="flex items-center justify-center w-10 h-10 rounded-full border border-blue-400 mb-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-6 h-6 text-blue-500"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 6v12m6-6H6"
                    />
                </svg>
            </div>
            <div class="text-lg text-gray-600 mb-1">
                Drag &amp; drop or <span
                    class="text-blue-600 font-medium underline"
                    >browse file</span
                >
            </div>
            <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                on:change={handleFiles}
                class="hidden"
            />
            <div class="flex items-center mt-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5 text-red-500 mr-1"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                    />
                </svg>
                <span class="text-red-500 text-sm font-medium"
                    >Max file size : 10MB</span
                >
            </div>
        </div>
    </div>
</div>
