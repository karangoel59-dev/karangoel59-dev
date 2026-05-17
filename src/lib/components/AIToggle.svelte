<script lang="ts">
	import { Sparkles } from '@lucide/svelte';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	let enabled = $state(false);

	onMount(() => {
		// Read cookie on mount
		enabled = document.cookie.includes('ai_insights_enabled=true');
	});

	function toggle() {
		enabled = !enabled;
		// Set cookie (expire in 1 year)
		const maxAge = 60 * 60 * 24 * 365;
		document.cookie = `ai_insights_enabled=${enabled}; path=/; max-age=${maxAge}; samesite=strict`;

		// Invalidate all load functions to re-fetch data without AI or with AI
		invalidateAll();
	}
</script>

<button
	onclick={toggle}
	class="flex items-center justify-center rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
	aria-label="Toggle AI Insights"
	title={enabled ? 'Disable AI Insights' : 'Enable AI Insights'}
>
	{#if enabled}
		<Sparkles size={20} class="text-indigo-500" />
	{:else}
		<Sparkles size={20} class="opacity-50" />
	{/if}
</button>
