<script lang="ts">
	import { marked } from 'marked';

	let { data } = $props();

	// We create a derived list where the markdown is pre-parsed for each link
	let parsedLinks = $derived(
		data.links.map((link) => ({
			...link,
			html: marked.parse(link.content || '')
		}))
	);
</script>

<svelte:head>
	<title>Quick Links</title>
</svelte:head>

<div class="pt-4 divide-y divide-gray-200 dark:divide-gray-800">
	{#each parsedLinks as link}
		<div class="py-6">
			{#if link.date}
				<p class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
					{link.date}
				</p>
			{/if}

			<article
				class="prose max-w-none prose-slate dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-lg"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html link.html}
			</article>
		</div>
	{:else}
		<p class="text-gray-500 dark:text-gray-400">No quick links found.</p>
	{/each}
</div>