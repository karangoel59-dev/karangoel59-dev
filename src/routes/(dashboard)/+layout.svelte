<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();
	
	const navItems = [
		{ name: 'Links', path: '/links' },
		{ name: 'Notes', path: '/notes' },
		{ name: 'Logs', path: '/logs' },
		{ name: 'Calendar', path: '/calendar' },	
	];
</script>

<div class="min-h-screen bg-white font-sans text-[#37352f]">
	<!-- Sticky Top Navbar -->
	<nav class="sticky top-0 z-50 flex items-center justify-center bg-white/80 px-6 py-3 backdrop-blur-md border-b border-gray-200">
		<div class="flex space-x-2">
			{#each navItems as item}
				<a
					href={item.path}
					class="rounded-md px-4 py-2 text-sm font-medium transition-colors { $page.url.pathname.startsWith(item.path) ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900' }"
				>
					{item.name}
				</a>
			{/each}
		</div>
	</nav>



	<main class="mx-auto max-w-[900px] px-12 pb-24">
		<!-- Page Content -->
		<div class="space-y-4 text-base leading-relaxed">
			{@render children()}
		</div>
	</main>
</div>
