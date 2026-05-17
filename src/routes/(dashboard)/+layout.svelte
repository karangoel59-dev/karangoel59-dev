<script lang="ts">
	import { page } from '$app/stores';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import FolderUpload from '$lib/components/FolderUpload.svelte';
	import { Link2, FileText, ScrollText, Calendar, Code2 } from '@lucide/svelte';

	let { children } = $props();

	const navItems = [
		{ name: 'Bookmarks', path: '/links', icon: Link2 },
		{ name: 'Notebooks', path: '/notes', icon: FileText },
		{ name: 'Journal', path: '/logs', icon: ScrollText },
		{ name: 'Schedule', path: '/calendar', icon: Calendar }
	];
</script>

<div
	class="min-h-screen bg-white font-sans text-[#37352f] transition-colors duration-200 dark:bg-gray-900 dark:text-gray-100"
>
	<!-- Sticky Top Navbar -->
	<nav
		class="sticky top-0 z-50 flex items-center border-b border-gray-200 bg-white/80 px-8 py-5 backdrop-blur-md transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900/80"
	>
		<div class="flex items-center gap-2 mr-8 font-semibold text-lg text-gray-900 dark:text-gray-100 shrink-0">
			<Code2 class="text-blue-500" size={24} />
			<span>karangoel59-dev</span>
		</div>
		<div class="flex flex-1 justify-center space-x-2 sm:justify-start">
			{#each navItems as item}
				{@const Icon = item.icon}
				<a
					href={item.path}
					class="flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors {$page.url.pathname.startsWith(
						item.path
					)
						? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
						: 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'}"
				>
					<Icon size={18} />
					{item.name}
				</a>
			{/each}
		</div>
		<div class="ml-4 flex items-center gap-4 shrink-0">
			<FolderUpload />
			<ThemeToggle />
		</div>
	</nav>

	<main class="mx-auto w-full max-w-[1400px] px-6 pt-8 pb-24">
		<!-- Page Content -->
		<div class="space-y-4 text-base leading-relaxed">
			{@render children()}
		</div>
	</main>
</div>
