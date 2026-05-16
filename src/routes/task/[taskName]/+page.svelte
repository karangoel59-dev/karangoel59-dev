<script lang="ts">
	import { marked } from 'marked';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

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
		<!-- We don't render the title again because it's usually in the markdown # Title -->
		<article
			class="prose max-w-none prose-slate dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-lg"
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html htmlContent}
		</article>
	</main>
</div>
