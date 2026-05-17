<script lang="ts">
	import { Sparkles } from '@lucide/svelte';
	import { marked } from 'marked';
	import { fade, slide } from 'svelte/transition';

	/**
	 * @typedef {Object} Props
	 * @property {string} [comment] - The insight text to display
	 * @property {boolean} [loading] - Whether the AI is "thinking"
	 */
	let { comment = '', loading = false }: { comment?: string; loading?: boolean } = $props();

	const htmlComment = $derived(marked.parse(comment));
</script>

{#if comment || loading}
	<div
		transition:slide={{ duration: 300 }}
		class="my-4 flex gap-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 shadow-sm dark:border-indigo-900/30 dark:bg-indigo-950/20"
	>
		<div
			class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md"
		>
			<Sparkles size={18} />
		</div>
		<div class="flex-1 leading-relaxed text-indigo-900 dark:text-indigo-200">
			<header
				class="mb-1 text-xs font-semibold tracking-wider text-indigo-600/80 uppercase dark:text-indigo-400"
			>
				AI Insight
			</header>
			{#if loading}
				<p class="animate-pulse text-sm italic">Scanning your workflow...</p>
			{:else}
				<article class="prose max-w-none dark:prose-invert" in:fade>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html htmlComment}
				</article>
			{/if}
		</div>
	</div>
{/if}
