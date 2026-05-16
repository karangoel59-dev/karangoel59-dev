<script lang="ts">
	import { Gantt, Willow } from '@svar-ui/svelte-gantt';
	import TimelineView from './TimelineView.svelte';

	let { tasks = [] } = $props();

	let currentView = $state('calendar'); // 'gantt' | 'calendar'

	const ganttData = $derived.by(() => {
		const validTasks = tasks
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

				return {
					...task,
					originalIndex: index,
					startDate,
					endDate,
					duration: Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + (parts.length > 1 ? 1 : 0))
				};
			})
			.filter((e: any): e is NonNullable<typeof e> => e !== null);

		const groups = new Map<string, any[]>();
		validTasks.forEach((task: any) => {
			const link = task.LINK;
			if (link) {
				if (!groups.has(link)) groups.set(link, []);
				groups.get(link)!.push(task);
			}
		});

		const result: any[] = [];
		const linksResult: any[] = [];
		let nextId = 1;
		let nextLinkId = 1;

		validTasks.forEach((task: any) => {
			const link = task.LINK;
			if (!link || (groups.has(link) && groups.get(link)!.length === 1)) {
				result.push({
					id: nextId++,
					text: task.Task,
					start: task.startDate,
					duration: task.duration
				});
			}
		});

		for (const [link, groupTasks] of groups.entries()) {
			if (groupTasks.length > 1) {
				groupTasks.sort((a: any, b: any) => a.startDate.getTime() - b.startDate.getTime());
				
				let prevId: number | null = null;
				groupTasks.forEach((task: any) => {
					const currentId = nextId++;
					result.push({
						id: currentId,
						text: task.Task,
						start: task.startDate,
						duration: task.duration
					});
					
					if (prevId !== null) {
						linksResult.push({
							id: nextLinkId++,
							source: prevId,
							target: currentId,
							type: 'e2s'
						});
					}
					prevId = currentId;
				});
			}
		}

		return { tasks: result, links: linksResult };
	});
</script>

<div class="mt-8 mb-4 flex items-center justify-between">
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
			<Gantt tasks={ganttData.tasks} links={ganttData.links} />
		</Willow>
	</div>
{:else}
	<TimelineView {tasks} />
{/if}

