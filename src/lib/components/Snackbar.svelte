<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { X } from '@lucide/svelte';

	let {
		message = '',
		type = 'info',
		open = $bindable(false),
		duration = 3000
	} = $props<{
		message: string;
		type?: 'info' | 'success' | 'error';
		open: boolean;
		duration?: number;
	}>();

	let timeoutId: ReturnType<typeof setTimeout>;

	// When open changes to true, set a timeout to close it
	$effect(() => {
		if (open) {
			if (timeoutId) clearTimeout(timeoutId);
			if (duration > 0) {
				timeoutId = setTimeout(() => {
					open = false;
				}, duration);
			}
		}
	});

	onDestroy(() => {
		if (timeoutId) clearTimeout(timeoutId);
	});
</script>

{#if open}
	<div
		class="fixed bottom-4 left-1/2 z-50 flex min-w-[300px] -translate-x-1/2 items-center gap-3 rounded bg-gray-800 px-4 py-3 text-sm text-gray-50 shadow-lg transition-all duration-300 sm:min-w-[400px]"
		role="alert"
	>
		<span class="flex-1">{message}</span>
		<button
			onclick={() => (open = false)}
			class="rounded p-1 transition-colors hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none"
			aria-label="Close"
		>
			<X size={16} />
		</button>
	</div>
{/if}
