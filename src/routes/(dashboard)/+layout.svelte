<script lang="ts">
	import { page } from '$app/stores';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { children } = $props();

	const navItems = [
		{ name: 'Links', path: '/links' },
		{ name: 'Notes', path: '/notes' },
		{ name: 'Logs', path: '/logs' },
		{ name: 'Calendar', path: '/calendar' }
	];
</script>

<div
	class="min-h-screen bg-white font-sans text-[#37352f] transition-colors duration-200 dark:bg-gray-900 dark:text-gray-100"
>
	<!-- Sticky Top Navbar -->
	<nav
		class="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/80 px-8 py-5 backdrop-blur-md transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900/80"
	>
		<div class="mx-auto flex w-full max-w-[1400px] justify-center space-x-6 sm:justify-start">
			{#each navItems as item}
				<a
					href={item.path}
					class="rounded-md px-5 py-2.5 text-base font-medium transition-colors {$page.url.pathname.startsWith(
						item.path
					)
						? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
						: 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'}"
				>
					{item.name}
				</a>
			{/each}
		</div>
		<div class="ml-4 flex items-center">
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
