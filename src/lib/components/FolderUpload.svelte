<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { FolderUp, RefreshCw, X, HardDrive, Database } from '@lucide/svelte';
	import Snackbar from './Snackbar.svelte';
	import Modal from './Modal.svelte';
	import { onMount } from 'svelte';

	// Svelte 5 runes for reactive state
	let isUploading = $state(false);
	let isSyncing = $state(false);
	let isClearing = $state(false);

	let isModalOpen = $state(false);
	let isConfirmOpen = $state(false);

	let directoryHandle = $state<any>(null);
	let fileInput = $state<HTMLInputElement | null>(null);

	let datasets = $state<string[]>([]);
	let currentDataset = $state<string>('');

	let snackbarOpen = $state(false);
	let snackbarMessage = $state('');
	let snackbarType = $state<'info' | 'success' | 'error'>('info');

	function showSnackbar(msg: string, type: 'info' | 'success' | 'error' = 'info') {
		snackbarMessage = msg;
		snackbarType = type;
		snackbarOpen = true;
	}

	async function fetchDatasets() {
		try {
			const res = await fetch('/api/dataset');
			if (res.ok) {
				const data = await res.json();
				datasets = data.datasets;
				currentDataset = data.current;
			}
		} catch (e) {
			console.error('Failed to fetch datasets', e);
		}
	}

	onMount(() => {
		fetchDatasets();
	});

	async function switchDataset(name: string) {
		isSyncing = true;
		try {
			const res = await fetch('/api/dataset', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name })
			});
			if (res.ok) {
				await invalidateAll();
				await fetchDatasets();
				showSnackbar(`Switched to dataset: ${name}`, 'success');
				isModalOpen = false;
			} else {
				showSnackbar('Failed to switch dataset', 'error');
			}
		} catch (e) {
			showSnackbar('Error switching dataset', 'error');
		} finally {
			isSyncing = false;
		}
	}

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
				showSnackbar(`Failed to select directory: ${(error as Error).message || error}`, 'error');
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

			const firstFilePath = target.files[0].webkitRelativePath || target.files[0].name;
			const datasetName = firstFilePath.includes('/') ? firstFilePath.split('/')[0] : 'default';
			formData.append('dataset', datasetName);

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
				showSnackbar(
					'No valid markdown, image, or document files found in the selected directory.',
					'error'
				);
				isSyncing = false;
				return;
			}

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const result = await response.json();
				showSnackbar(`Successfully synced ${result.count} files to ${datasetName}.`, 'success');
				await invalidateAll();
				await fetchDatasets();
				isModalOpen = false;
			} else {
				const result = await response.json();
				console.error('Sync failed', result);
				if (result.error && result.details) {
					showSnackbar(`Sync failed: ${result.error}\n\n${result.details.join('\n')}`, 'error');
				} else {
					showSnackbar(`Sync failed: ${result.error || 'Unknown error'}`, 'error');
				}
			}
		} catch (error) {
			console.error('Sync error:', error);
			showSnackbar('An error occurred during sync.', 'error');
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
				showSnackbar('Please use "Select Dir" to sync files in this browser.', 'info');
			} else {
				showSnackbar('Please select a directory first.', 'info');
			}
			return;
		}

		isSyncing = true;

		try {
			const formData = new FormData();
			const datasetName = directoryHandle.name;
			formData.append('dataset', datasetName);

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
				showSnackbar(
					'No valid markdown, image, or document files found in the selected directory.',
					'error'
				);
				isSyncing = false;
				return;
			}

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const result = await response.json();
				showSnackbar(`Successfully synced ${result.count} files to ${datasetName}.`, 'success');
				await invalidateAll();
				await fetchDatasets();
				isModalOpen = false;
			} else {
				const result = await response.json();
				console.error('Sync failed', result);
				if (result.error && result.details) {
					showSnackbar(`Sync failed: ${result.error}\n\n${result.details.join('\n')}`, 'error');
				} else {
					showSnackbar(`Sync failed: ${result.error || 'Unknown error'}`, 'error');
				}
			}
		} catch (error) {
			console.error('Sync error:', error);
			showSnackbar('An error occurred during sync.', 'error');
		} finally {
			isSyncing = false;
		}
	}

	async function closeDir() {
		isClearing = true;
		try {
			const response = await fetch('/api/clear', {
				method: 'POST'
			});

			if (response.ok) {
				directoryHandle = null;
				showSnackbar('Successfully cleared active dataset.', 'success');
				await invalidateAll();
				await fetchDatasets();
			} else {
				const result = await response.json();
				showSnackbar(`Clear failed: ${result.error || 'Unknown error'}`, 'error');
			}
		} catch (error) {
			console.error('Clear error:', error);
			showSnackbar('An error occurred while clearing data.', 'error');
		} finally {
			isClearing = false;
		}
	}
</script>

<button
	onclick={() => {
		isModalOpen = true;
		fetchDatasets();
	}}
	class="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
>
	<HardDrive size={18} />
	<span class="hidden sm:inline">Data Source</span>
</button>

<Modal bind:open={isModalOpen} title={isSyncing ? 'Processing...' : 'Manage Data Source'}>
	{#if isSyncing}
		<div class="flex flex-col items-center justify-center space-y-6 py-10">
			<RefreshCw size={64} class="animate-spin text-blue-600 dark:text-blue-400" />
			<p class="text-sm font-medium text-gray-600 dark:text-gray-300">
				Please wait while your dataset is being processed...
			</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#if datasets.length > 0}
				<div>
					<h4 class="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
						Existing Datasets
					</h4>
					<div class="flex max-h-40 flex-col gap-2 overflow-y-auto pr-1">
						{#each datasets as dataset}
							<button
								onclick={() => switchDataset(dataset)}
								disabled={isUploading || isClearing}
								class="flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors {currentDataset ===
								dataset
									? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
									: 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'}"
							>
								<div class="flex items-center gap-2">
									<Database size={16} />
									<span>{dataset}</span>
								</div>
								{#if currentDataset === dataset}
									<span class="text-xs font-semibold text-blue-600 dark:text-blue-400">Active</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>
				<div class="relative my-4">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
							>Or add new</span
						>
					</div>
				</div>
			{:else}
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Select a local folder containing your markdown and image files to sync with the
					application.
				</p>
			{/if}

			<div class="flex flex-col gap-3">
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
					disabled={isUploading || isClearing}
					class="flex w-full items-center justify-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
				>
					<FolderUp size={16} />
					Upload New Folder
				</button>
			</div>

			<div class="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
				<h4 class="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Danger Zone</h4>
				<button
					onclick={() => {
						isModalOpen = false;
						isConfirmOpen = true;
					}}
					disabled={isUploading || isClearing || datasets.length === 0}
					class="flex w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
				>
					<X size={16} />
					Clear Active Data
				</button>
			</div>
		</div>
	{/if}
</Modal>

<Modal bind:open={isConfirmOpen} title="Clear Active Data">
	<div class="space-y-4">
		<p class="text-sm text-gray-600 dark:text-gray-300">
			Are you sure you want to clear the active dataset ({currentDataset})? This action cannot be
			undone.
		</p>
		<div class="flex justify-end gap-3 pt-2">
			<button
				onclick={() => {
					isConfirmOpen = false;
					isModalOpen = true;
				}}
				class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
			>
				Cancel
			</button>
			<button
				onclick={() => {
					isConfirmOpen = false;
					closeDir();
				}}
				class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800"
			>
				Confirm Clear
			</button>
		</div>
	</div>
</Modal>

<Snackbar bind:open={snackbarOpen} message={snackbarMessage} type={snackbarType} />
