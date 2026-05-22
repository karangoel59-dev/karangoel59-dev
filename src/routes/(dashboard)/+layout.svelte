<script lang="ts">
	import { page } from '$app/stores';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import AIToggle from '$lib/components/AIToggle.svelte';
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
	class="flex min-h-screen flex-col bg-white font-sans text-[#37352f] transition-colors duration-200 dark:bg-gray-900 dark:text-gray-100"
>
	<!-- Sticky Top Navbar -->
	<nav
		class="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-md transition-colors duration-200 sm:px-8 sm:py-5 dark:border-gray-800 dark:bg-gray-900/80"
	>
		<div
			class="flex shrink-0 items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100"
		>
			<Code2 class="text-blue-500" size={24} />
			<span class="hidden sm:inline">karangoel59-dev</span>
		</div>

		<!-- Desktop Nav Links -->
		<div class="ml-8 hidden flex-1 justify-start space-x-2 sm:flex">
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

		<!-- Toggles & Actions -->
		<div class="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
			<FolderUpload />
			<AIToggle />
			<ThemeToggle />
		</div>
	</nav>

	<main class="mx-auto w-full max-w-[1400px] flex-1 px-4 pt-6 pb-24 sm:px-6 sm:pt-8 sm:pb-24">
		<!-- Page Content -->
		<div class="space-y-4 text-base leading-relaxed">
			{@render children()}
		</div>
	</main>

	<!-- Mobile Bottom Navigation Bar -->
	<nav
		class="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white/90 backdrop-blur-md sm:hidden dark:border-gray-800 dark:bg-gray-900/90"
		style="padding-bottom: env(safe-area-inset-bottom, 0px);"
	>
		<div class="flex h-16 items-center justify-around">
			{#each navItems as item}
				{@const Icon = item.icon}
				<a
					href={item.path}
					class="flex h-full w-full flex-col items-center justify-center space-y-1 transition-colors {$page.url.pathname.startsWith(
						item.path
					)
						? 'text-blue-600 dark:text-blue-400'
						: 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}"
				>
					<Icon size={20} />
					<span class="text-[10px] font-medium">{item.name}</span>
				</a>
			{/each}
		</div>
	</nav>
</div>
