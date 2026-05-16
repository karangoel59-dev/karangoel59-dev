<script lang="ts">
	import { Gantt, Willow } from '@svar-ui/svelte-gantt';
	import TimelineView from './TimelineView.svelte';

	let { tasks = [] } = $props();

	let currentView = $state('calendar'); // 'gantt' | 'calendar'

	const ganttTasks = $derived(
		tasks
			.map((task: any, index: number) => {
				if (!task.Date || task.Date === 'No Date') {
					return null;
				}

				const parts = task.Date.split('→').map((s: string) => s.trim());
				const startDate = new Date(parts[0]);
				const endDate = parts.length > 1 ? new Date(parts[1]) : new Date(parts[0]);

				if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
					return null;
				}

				// Calculate duration in days
				const duration = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + (parts.length > 1 ? 1 : 0));

				return {
					id: index + 1,
					text: task.Task,
					start: startDate,
					duration: duration
				};
			})
			.filter((e: any): e is NonNullable<typeof e> => e !== null)
	);
</script>

<div class="mt-8 mb-4 flex items-center justify-between">
	<h3 class="text-xl font-semibold">Calendar View</h3>
	<div class="flex space-x-1 rounded-lg bg-gray-100 p-1">
		<button
			class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors {currentView === 'calendar' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}"
			onclick={() => (currentView = 'calendar')}
		>
			Calendar
		</button>
		<button
			class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors {currentView === 'gantt' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}"
			onclick={() => (currentView = 'gantt')}
		>
			Gantt
		</button>
	</div>
</div>

{#if currentView === 'gantt'}
	<div class="h-[500px]">
		<Willow>
			<Gantt tasks={ganttTasks} links={[]} />
		</Willow>
	</div>
{:else}
	<TimelineView {tasks} />
{/if}

