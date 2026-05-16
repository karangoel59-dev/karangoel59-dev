<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	// Svelte 5 runes for reactive state
	let isUploading = $state(false);
	let fileInput = $state<HTMLInputElement>();

	async function handleUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;

		if (!files || files.length === 0) return;

		isUploading = true;

		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append('files', files[i]);
		}

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const result = await response.json();
				alert(`Successfully uploaded ${result.count} task files.`);
				// Invalidate all load functions to re-fetch tasks
				await invalidateAll();
			} else {
				console.error('Upload failed');
				alert('Upload failed.');
			}
		} catch (error) {
			console.error('Upload error:', error);
			alert('An error occurred during upload.');
		} finally {
			isUploading = false;
			// Reset the file input so the same folder can be uploaded again if needed
			if (fileInput) fileInput.value = '';
		}
	}
</script>

<div class="flex items-center gap-2">
	<input
		type="file"
		webkitdirectory
		multiple
		accept=".md"
		class="hidden"
		bind:this={fileInput}
		onchange={handleUpload}
	/>
	<button
		onclick={() => fileInput?.click()}
		disabled={isUploading}
		class="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-600 transition-colors hover:bg-blue-100 disabled:opacity-50 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
	>
		{isUploading ? 'Uploading...' : 'Upload Tasks'}
	</button>
</div>
