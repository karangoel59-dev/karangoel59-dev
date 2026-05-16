<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();
	
	const navItems = [
		{ name: 'Logs', path: '/logs' },
		{ name: 'Calendar', path: '/calendar' },
		{ name: 'Things to Note', path: '/notes' },
		{ name: 'Quick Links', path: '/links' }
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

	<!-- Cover Image -->
	<div class="relative h-[30vh] w-full overflow-hidden">
		<img
			src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb"
			alt="Cover"
			class="h-full w-full object-cover object-[center_15%]"
		/>
	</div>

	<main class="mx-auto max-w-[900px] px-12 pb-24">
		<!-- Icon and Title -->
		<div class="-mt-[3rem] mb-4 relative z-10">
			<img
				src="/icon.jpeg"
				alt="Icon"
				class="inline-block h-[78px] w-[78px] rounded bg-white object-cover shadow-sm"
			/>
		</div>
		
		<h1 class="mb-8 text-[40px] leading-tight font-bold">Work Dashboard</h1>

		<!-- Page Content -->
		<div class="space-y-4 text-base leading-relaxed">
			{@render children()}
		</div>
	</main>
</div>
