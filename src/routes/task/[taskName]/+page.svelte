<script lang="ts">
	import { marked } from 'marked';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { getTypes, getPillColor, formatDate } from '$lib/utils';
	import AICommentator from '$lib/components/AICommentator.svelte';

	let { data } = $props();

	// Parse markdown content safely
	let htmlContent = $derived(marked.parse(data.content));
</script>

<svelte:head>
	<title>{data.taskName}</title>
</svelte:head>

<div
	class="min-h-screen bg-white pb-24 font-sans text-[#37352f] transition-colors duration-200 dark:bg-gray-900 dark:text-gray-100"
>
	<!-- Navbar / Breadcrumb -->
	<nav
		class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/80 px-12 py-4 backdrop-blur-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900/80"
	>
		<a
			href="/logs"
			class="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
		>
			&larr; Back to Dashboard
		</a>
		<ThemeToggle />
	</nav>

	<main class="mx-auto mt-12 max-w-[900px] px-12">

		<!-- Metadata Section -->
		<div class="mb-10 flex flex-col gap-4 border-b border-gray-100 pb-8 dark:border-gray-800">
			<!-- Link -->
			{#if data.link}
				<a
					href={data.link}
					target="_blank"
					rel="noopener noreferrer"
					class="w-fit text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
				>
					{data.link}
				</a>
			{/if}

			<div class="flex flex-wrap items-center gap-6">
				<!-- Status -->
				{#if data.status}
					<div class="flex items-center gap-2">
						<span class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
						<span
							class="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
						>
							{data.status}
						</span>
					</div>
				{/if}

				<!-- Type -->
				{#if data.type}
					<div class="flex items-center gap-2">
						<span class="text-sm font-medium text-gray-500 dark:text-gray-400">Type</span>
						<div class="flex gap-2">
							{#each getTypes(data.type) as type}
								<span
									class="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium {getPillColor(
										type
									)}"
								>
									{type}
								</span>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Date -->
				{#if data.From}
					<div class="flex items-center gap-2">
						<span class="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</span>
						<span class="text-sm font-medium text-gray-900 dark:text-gray-100">
							{formatDate(data.From)}
						</span>
					</div>
				{/if}
				{#if data.To}
					<div class="flex items-center gap-2">
						<span class="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</span>
						<span class="text-sm font-medium text-gray-900 dark:text-gray-100">
							{formatDate(data.To)}
						</span>
					</div>
				{/if}
			</div>
		</div>

		{#await data.aiComment}
			<AICommentator loading={true} />
		{:then comment}
			<AICommentator {comment} />
		{/await}

		<!-- We don't render the title again because it's usually in the markdown # Title -->
		<article
			class="prose max-w-none prose-slate dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-lg"
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html htmlContent}
		</article>
	</main>
</div>
