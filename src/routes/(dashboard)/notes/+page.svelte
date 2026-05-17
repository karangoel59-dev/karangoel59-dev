<script lang="ts">
	import { marked } from 'marked';
	import { formatDate } from '$lib/utils';

	let { data } = $props();

	// Process the entire list of notes to include HTML content
	let processedNotes = $derived(
		data.notes?.map((note: any) => ({
			...note,
			html: marked.parse(note.content || '')
		})) || []
	);
</script>

<svelte:head>
	<title>Notebook</title>
</svelte:head>

<div class="pt-4 divide-y divide-gray-200 dark:divide-gray-800">
	{#each processedNotes as note}
		<div class="py-6 first:pt-0">
			{#if note.From}
				<p class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
					{formatDate(note.From)}
				</p>
			{/if}

			<article
				class="prose max-w-none prose-slate dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-lg"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html note.html}
			</article>
		</div>
	{:else}
		<p class="text-gray-500 dark:text-gray-400">No notes found.</p>
	{/each}
</div>