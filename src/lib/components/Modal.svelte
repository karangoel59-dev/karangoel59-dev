<script lang="ts">
	import { X } from '@lucide/svelte';

	let {
		open = $bindable(false),
		title,
		children
	} = $props<{
		open: boolean;
		title: string;
		children: any;
	}>();
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity"
	>
		<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
				<button
					onclick={() => (open = false)}
					class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
					aria-label="Close"
				>
					<X size={20} />
				</button>
			</div>
			<div class="text-gray-600 dark:text-gray-300">
				{@render children()}
			</div>
		</div>
	</div>
{/if}
