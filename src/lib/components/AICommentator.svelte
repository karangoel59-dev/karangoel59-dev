<script lang="ts">
	import { Sparkles } from '@lucide/svelte';
	import { fade, slide } from 'svelte/transition';

	/**
	 * @typedef {Object} Props
	 * @property {string} [comment] - The insight text to display
	 * @property {boolean} [loading] - Whether the AI is "thinking"
	 */
	let { comment = '', loading = false }: { comment?: string, loading?: boolean } = $props();
</script>

{#if comment || loading}
	<div 
		transition:slide={{ duration: 300 }}
		class="my-4 flex gap-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 shadow-sm dark:border-indigo-900/30 dark:bg-indigo-950/20"
	>
		<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
			<Sparkles size={18} />
		</div>
		<div class="flex-1 text-sm leading-relaxed text-indigo-900 dark:text-indigo-200">
			<header class="mb-1 font-semibold uppercase tracking-wider text-indigo-600/80 dark:text-indigo-400">AI Insight</header>
			{#if loading}
				<p class="animate-pulse italic">Scanning your workflow...</p>
			{:else}
				<p in:fade>{comment}</p>
			{/if}
		</div>
	</div>
{/if}