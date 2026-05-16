<script lang="ts">
	import { getPillColor, getTypes } from '$lib/utils';

	let { tasks = [] } = $props();
</script>

<div class="mb-8 overflow-x-auto pt-4">
	<table class="w-full border-collapse border-y border-gray-200 text-sm dark:border-gray-700">
		<thead>
			<tr
				class="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400"
			>
				<th class="w-12 border-x border-gray-200 px-3 py-2 font-normal dark:border-gray-700"
					>Done</th
				>
				<th
					class="min-w-[200px] border-x border-gray-200 px-3 py-2 font-normal dark:border-gray-700"
					>Task</th
				>
				<th class="border-x border-gray-200 px-3 py-2 font-normal dark:border-gray-700">Date</th>
				<th class="border-x border-gray-200 px-3 py-2 font-normal dark:border-gray-700">LINK</th>
				<th
					class="min-w-[150px] border-x border-gray-200 px-3 py-2 font-normal dark:border-gray-700"
					>Task Type</th
				>
			</tr>
		</thead>
		<tbody>
			{#each tasks as task}
				<tr
					class="border-b border-gray-100 hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-800/50"
				>
					<td class="border-x border-gray-200 px-3 py-2 text-center dark:border-gray-700">
						<input
							type="checkbox"
							checked={task[' '] === 'Yes'}
							class="h-4 w-4 cursor-not-allowed rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
							readonly
						/>
					</td>
					<td class="border-x border-gray-200 px-3 py-2 font-medium dark:border-gray-700">
						<a
							href={`/task/${encodeURIComponent(task.Task)}`}
							class="text-gray-900 transition-colors hover:text-blue-600 hover:underline dark:text-gray-100 dark:hover:text-blue-400"
						>
							{task.Task}
						</a>
					</td>
					<td
						class="border-x border-gray-200 px-3 py-2 whitespace-nowrap text-gray-500 dark:border-gray-700 dark:text-gray-400"
					>
						{task.Date}
					</td>
					<td
						class="max-w-[200px] truncate border-x border-gray-200 px-3 py-2 text-gray-500 dark:border-gray-700 dark:text-gray-400"
					>
						{#if task.LINK}
							<a
								href={task.LINK}
								class="block truncate text-gray-500 underline underline-offset-2 opacity-80 hover:opacity-100 dark:text-gray-400"
								target="_blank"
								rel="noreferrer"
								title={task.LINK}
							>
								{task.LINK}
							</a>
						{/if}
					</td>
					<td class="border-x border-gray-200 px-3 py-2 dark:border-gray-700">
						<div class="flex flex-wrap gap-1">
							{#each getTypes(task['Task Type']) as type}
								<span
									class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium {getPillColor(
										type
									)}"
								>
									{type}
								</span>
							{/each}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
