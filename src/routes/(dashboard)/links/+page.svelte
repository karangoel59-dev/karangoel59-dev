<script lang="ts">
	import { marked } from 'marked';
	import { formatDate } from '$lib/utils';
	import AICommentator from '$lib/components/AICommentator.svelte';

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
	<title>Bookmarks</title>
</svelte:head>

<div class="flex flex-col gap-0 lg:flex-row">
	<div class="pr-6 lg:w-[40%]">
		<div class="divide-y divide-gray-200 pt-4 dark:divide-gray-800">
			{#each parsedLinks as link}
				<div class="py-6">
					{#if link.From}
						<p class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
							{#if link.From === link.To || !link.To}
								{formatDate(link.From)}
							{:else}
								{formatDate(link.From)} → {formatDate(link.To)}
							{/if}
						</p>
					{/if}

					<article
						class="prose prose-lg max-w-none prose-slate dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-lg"
					>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html link.html}
					</article>
				</div>
			{:else}
				<p class="text-gray-500 dark:text-gray-400">No quick links found.</p>
			{/each}
		</div>
	</div>

	<aside class="pt-4 leading-tight font-black lg:w-[60%]">
		{#await data.aiComment}
			<AICommentator loading={true} />
		{:then comment}
			{#if comment}
				<AICommentator {comment} />
			{/if}
		{/await}
	</aside>
</div>
