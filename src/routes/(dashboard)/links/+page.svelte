<script lang="ts">
	import { marked } from 'marked';

	let { data } = $props();

	let htmlContent = $derived(marked.parse(data.content || ''));
</script>

<svelte:head>
	<title>Quick Links</title>
</svelte:head>

<div class="pt-4">
	{#if data.date}
		<p class="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">{data.date}</p>
	{/if}
	{#if data.content}
		<article
			class="prose max-w-none prose-slate dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-lg"
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html htmlContent}
		</article>
	{:else}
		<p class="text-gray-500 dark:text-gray-400">No quick links found.</p>
	{/if}
</div>