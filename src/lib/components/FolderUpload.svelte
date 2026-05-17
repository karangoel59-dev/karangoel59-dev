<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { FolderUp, RefreshCw, X } from '@lucide/svelte';

	// Svelte 5 runes for reactive state
	let isUploading = $state(false);
	let isSyncing = $state(false);
	let isClearing = $state(false);

	let directoryHandle = $state<any>(null);
	let fileInput = $state<HTMLInputElement | null>(null);

	async function selectDir() {
		if (!('showDirectoryPicker' in window)) {
			// Fallback for unsupported browsers or insecure contexts
			fileInput?.click();
			return;
		}

		try {
			// @ts-ignore
			directoryHandle = await window.showDirectoryPicker({
				mode: 'read'
			});
			await syncFiles();
		} catch (error) {
			if ((error as Error).name !== 'AbortError') {
				console.error('Error selecting directory:', error);
				alert(`Failed to select directory: ${(error as Error).message || error}`);
			}
		}
	}

	async function handleFallbackFiles(event: Event) {
		const target = event.target as HTMLInputElement;
		if (!target.files || target.files.length === 0) return;

		isSyncing = true;

		try {
			const formData = new FormData();
			let count = 0;
			const imageRegex = /\.(png|jpe?g|gif|svg|webp)$/i;
			const docRegex = /\.(docx?|pdf|txt)$/i;

			for (let i = 0; i < target.files.length; i++) {
				const file = target.files[i];
				const relPath = file.webkitRelativePath || file.name;

				// Skip hidden files or files in hidden directories (e.g., .trash)
				if (relPath.split(/[/\\]/).some((part) => part.startsWith('.'))) continue;

				if (
					relPath.toLowerCase().endsWith('.md') ||
					imageRegex.test(relPath) ||
					docRegex.test(relPath)
				) {
					formData.append('files', file, relPath);
					count++;
				}
			}

			if (count === 0) {
				alert('No valid markdown, image, or document files found in the selected directory.');
				isSyncing = false;
				return;
			}

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const result = await response.json();
				alert(`Successfully synced ${result.count} files.`);
				await invalidateAll();
			} else {
				const result = await response.json();
				console.error('Sync failed', result);
				if (result.error && result.details) {
					alert(`Sync failed: ${result.error}\n\n${result.details.join('\n')}`);
				} else {
					alert(`Sync failed: ${result.error || 'Unknown error'}`);
				}
			}
		} catch (error) {
			console.error('Sync error:', error);
			alert('An error occurred during sync.');
		} finally {
			isSyncing = false;
			// Reset input so the same folder can be selected again
			target.value = '';
		}
	}

	async function syncFiles() {
		if (!directoryHandle) {
			// If no handle is available (e.g. using fallback), we can't manually sync without selecting again
			if (!('showDirectoryPicker' in window)) {
				alert('Please use "Select Dir" to sync files in this browser.');
			} else {
				alert('Please select a directory first.');
			}
			return;
		}

		isSyncing = true;

		try {
			const formData = new FormData();
			let count = 0;
			const imageRegex = /\.(png|jpe?g|gif|svg|webp)$/i;
			const docRegex = /\.(docx?|pdf|txt)$/i;

			// Recursively add markdown, image, and document files
			// @ts-ignore
			async function addFiles(handle, path = '') {
				// @ts-ignore
				for await (const entry of handle.values()) {
					// Skip hidden directories and files
					if (entry.name.startsWith('.')) continue;

					if (entry.kind === 'file') {
						if (
							entry.name.toLowerCase().endsWith('.md') ||
							imageRegex.test(entry.name) ||
							docRegex.test(entry.name)
						) {
							const file = await entry.getFile();
							// Explicitly pass the full relative path as the filename
							formData.append('files', file, path + entry.name);
							count++;
						}
					} else if (entry.kind === 'directory') {
						await addFiles(entry, path + entry.name + '/');
					}
				}
			}

			await addFiles(directoryHandle);

			if (count === 0) {
				alert('No valid markdown, image, or document files found in the selected directory.');
				isSyncing = false;
				return;
			}

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const result = await response.json();
				alert(`Successfully synced ${result.count} files.`);
				await invalidateAll();
			} else {
				const result = await response.json();
				console.error('Sync failed', result);
				if (result.error && result.details) {
					alert(`Sync failed: ${result.error}\n\n${result.details.join('\n')}`);
				} else {
					alert(`Sync failed: ${result.error || 'Unknown error'}`);
				}
			}
		} catch (error) {
			console.error('Sync error:', error);
			alert('An error occurred during sync.');
		} finally {
			isSyncing = false;
		}
	}

	async function closeDir() {
		if (!confirm('Are you sure you want to clear all data and make everything fresh?')) return;

		isClearing = true;
		try {
			const response = await fetch('/api/clear', {
				method: 'POST'
			});

			if (response.ok) {
				directoryHandle = null;
				alert('Successfully cleared data.');
				await invalidateAll();
			} else {
				const result = await response.json();
				alert(`Clear failed: ${result.error || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Clear error:', error);
			alert('An error occurred while clearing data.');
		} finally {
			isClearing = false;
		}
	}
</script>

<div class="flex items-center gap-2">
	<!-- Hidden file input for fallback -->
	<input
		type="file"
		webkitdirectory
		multiple
		class="hidden"
		bind:this={fileInput}
		onchange={handleFallbackFiles}
	/>

	<button
		onclick={selectDir}
		disabled={isUploading || isSyncing || isClearing}
		class="flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-600 transition-colors hover:bg-blue-100 disabled:opacity-50 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
	>
		<FolderUp size={16} />
		Select Dir
	</button>

	<button
		onclick={syncFiles}
		disabled={(!directoryHandle &&
			typeof window !== 'undefined' &&
			'showDirectoryPicker' in window) ||
			isUploading ||
			isSyncing ||
			isClearing}
		class="flex items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-sm text-green-600 transition-colors hover:bg-green-100 disabled:opacity-50 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
	>
		<RefreshCw size={16} class={isSyncing ? 'animate-spin' : ''} />
		{isSyncing ? 'Syncing...' : 'Sync'}
	</button>

	<button
		onclick={closeDir}
		disabled={isUploading || isSyncing || isClearing}
		class="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
	>
		<X size={16} />
		Close
	</button>
</div>
