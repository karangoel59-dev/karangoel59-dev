<script lang="ts">
	import { marked } from 'marked';

	let { data } = $props();

	// Parse markdown content safely
	let htmlContent = $derived(marked.parse(data.content));
</script>

<svelte:head>
	<title>{data.taskName} - Work Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-white font-sans text-[#37352f] pb-24">
	<!-- Navbar / Breadcrumb -->
	<nav class="sticky top-0 z-10 flex items-center bg-white/80 px-12 py-4 backdrop-blur-sm border-b border-gray-100">
		<a href="/" class="text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors">
			&larr; Back to Dashboard
		</a>
	</nav>

	<main class="mx-auto max-w-[900px] px-12 mt-12">
		<!-- We don't render the title again because it's usually in the markdown # Title -->
		<article class="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-lg">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html htmlContent}
		</article>
	</main>
</div>
