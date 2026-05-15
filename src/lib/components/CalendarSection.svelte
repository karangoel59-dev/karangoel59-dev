<script lang="ts">
	import { Gantt, Willow } from '@svar-ui/svelte-gantt';

	let { tasks = [] } = $props();

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

<h3 class="mt-8 mb-4 text-xl font-semibold">Calendar View</h3>
<div class="h-[500px]">
	<Willow>
		<Gantt tasks={ganttTasks} links={[]} />
	</Willow>
</div>
