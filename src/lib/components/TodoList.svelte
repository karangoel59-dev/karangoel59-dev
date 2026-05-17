<script lang="ts">
	import { getPillColor, getTypes, formatDate } from '$lib/utils';

	interface Task {
		Task: string;
		From: string;
		To: string;
		Type: string;
		Status: boolean;
		LINK: string;
	}

	let { tasks = [] }: { tasks: Task[] } = $props();

	let searchQuery = $state('');
	let statusFilter = $state('all');
	let typeFilter = $state('all');
	let dateSort = $state('desc');

	let allTypes = $derived(
		[...new Set(tasks.flatMap((t: Task) => getTypes(t['Type'])))].filter(Boolean).sort()
	);

	let filteredTasks = $derived(
		tasks
			.filter((task: Task) => {
				if (searchQuery && !task.Task.toLowerCase().includes(searchQuery.toLowerCase())) {
					return false;
				}
				if (statusFilter !== 'all') {
					const isDone = task['Status'] === true;
					if (statusFilter === 'yes' && !isDone) return false;
					if (statusFilter === 'no' && isDone) return false;
				}
				if (typeFilter !== 'all') {
					const types = getTypes(task['Type']);
					if (!types.includes(typeFilter)) return false;
				}
				return true;
			})
			.sort((a: Task, b: Task) => {
				const parseDate = (d: string) => {
					if (!d) return 0;
					return new Date(d).getTime() || 0;
				};
				const dateA = parseDate(a.From);
				const dateB = parseDate(b.From);
				return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
			})
	);
</script>

<div class="mb-4 flex flex-wrap gap-4 pt-4">
	<!-- Search by Name -->
	<div class="flex flex-col gap-1">
		<label for="search" class="text-xs font-medium text-gray-500 dark:text-gray-400"
			>Search Task</label
		>
		<input
			id="search"
			type="text"
			bind:value={searchQuery}
			placeholder="Search..."
			class="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
		/>
	</div>

	<!-- Filter by Status -->
	<div class="flex flex-col gap-1">
		<label for="status" class="text-xs font-medium text-gray-500 dark:text-gray-400">Status</label>
		<select
			id="status"
			bind:value={statusFilter}
			class="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
		>
			<option value="all">All</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</select>
	</div>

	<!-- Filter by Type -->
	<div class="flex flex-col gap-1">
		<label for="type" class="text-xs font-medium text-gray-500 dark:text-gray-400">Type</label>
		<select
			id="type"
			bind:value={typeFilter}
			class="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
		>
			<option value="all">All</option>
			{#each allTypes as t (t)}
				<option value={t}>{t}</option>
			{/each}
		</select>
	</div>

	<!-- Sort by Date -->
	<div class="flex flex-col gap-1">
		<label for="dateSort" class="text-xs font-medium text-gray-500 dark:text-gray-400"
			>Date Sort</label
		>
		<select
			id="dateSort"
			bind:value={dateSort}
			class="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
		>
			<option value="desc">Newest First (Desc)</option>
			<option value="asc">Oldest First (Asc)</option>
		</select>
	</div>
</div>

<div class="mb-8 overflow-x-auto">
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
				<th
					class="min-w-[150px] border-x border-gray-200 px-3 py-2 font-normal dark:border-gray-700"
					>Task Type</th
				>
				<th class="border-x border-gray-200 px-3 py-2 font-normal dark:border-gray-700">LINK</th>
				<th class="border-x border-gray-200 px-3 py-2 font-normal dark:border-gray-700">Timeline</th>
			</tr>
		</thead>
		<tbody>
			{#each filteredTasks as task (task.Task + task.From + task.To)}
				<tr
					class="border-b border-gray-100 hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-800/50"
				>
					<td class="border-x border-gray-200 px-3 py-2 text-center dark:border-gray-700">
						<input
							type="checkbox"
							checked={task['Status']}
							class="h-4 w-4 cursor-not-allowed rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
							readonly
						/>
					</td>
					<td class="border-x border-gray-200 px-3 py-2 font-medium dark:border-gray-700">
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a
							href={`/task/${encodeURIComponent(task.Task)}`}
							class="text-gray-900 transition-colors hover:text-blue-600 hover:underline dark:text-gray-100 dark:hover:text-blue-400"
						>
							{task.Task}
						</a>
					</td>
					<td class="border-x border-gray-200 px-3 py-2 dark:border-gray-700">
						<div class="flex flex-wrap gap-1">
							{#each getTypes(task['Type']) as type (type)}
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
					<td
						class="max-w-[200px] truncate border-x border-gray-200 px-3 py-2 text-gray-500 dark:border-gray-700 dark:text-gray-400"
					>
						{#if task.LINK}
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
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
					<td
						class="border-x border-gray-200 px-3 py-2 whitespace-nowrap text-gray-500 dark:border-gray-700 dark:text-gray-400"
					>
						{#if task.From === task.To || !task.To}
							{formatDate(task.From)}
						{:else}
							{formatDate(task.From)} → {formatDate(task.To)}
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
