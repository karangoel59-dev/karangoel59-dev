<script lang="ts">
	import { getPillColor, getTypes } from '$lib/utils';

	let { tasks = [] } = $props();
</script>

<h3 class="mt-8 mb-4 text-xl font-semibold">To Do List</h3>

<div class="mb-8 overflow-x-auto">
	<table class="w-full border-collapse border-y border-gray-200 text-sm">
		<thead>
			<tr class="border-b border-gray-200 text-left text-gray-500">
				<th class="w-12 border-x border-gray-200 px-3 py-2 font-normal">Done</th>
				<th class="min-w-[200px] border-x border-gray-200 px-3 py-2 font-normal">Task</th>
				<th class="border-x border-gray-200 px-3 py-2 font-normal">Date</th>
				<th class="border-x border-gray-200 px-3 py-2 font-normal">LINK</th>
				<th class="min-w-[150px] border-x border-gray-200 px-3 py-2 font-normal">Task Type</th>
			</tr>
		</thead>
		<tbody>
			{#each tasks as task}
				<tr class="border-b border-gray-100 hover:bg-gray-50/50">
					<td class="border-x border-gray-200 px-3 py-2 text-center">
						<input
							type="checkbox"
							checked={task[' '] === 'Yes'}
							class="h-4 w-4 cursor-not-allowed rounded border-gray-300 text-blue-500 focus:ring-blue-500"
							readonly
						/>
					</td>
					<td class="border-x border-gray-200 px-3 py-2 font-medium">
						{task.Task}
					</td>
					<td class="border-x border-gray-200 px-3 py-2 whitespace-nowrap text-gray-500">
						{task.Date}
					</td>
					<td class="max-w-[200px] truncate border-x border-gray-200 px-3 py-2 text-gray-500">
						{#if task.LINK}
							<a
								href={task.LINK}
								class="block truncate underline underline-offset-2 opacity-80 hover:opacity-100"
								target="_blank"
								rel="noreferrer"
								title={task.LINK}
							>
								{task.LINK}
							</a>
						{/if}
					</td>
					<td class="border-x border-gray-200 px-3 py-2">
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
