<script lang="ts">
	import { Gantt, Willow, WillowDark } from '@svar-ui/svelte-gantt';
	import TimelineView from './TimelineView.svelte';
	import { onMount } from 'svelte';

	let { tasks = [] } = $props();

	let currentView = $state('calendar'); // 'gantt' | 'calendar'
	let isDark = $state(false);

	onMount(() => {
		const observer = new MutationObserver(() => {
			isDark = document.documentElement.classList.contains('dark');
		});
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
		isDark = document.documentElement.classList.contains('dark');
		return () => observer.disconnect();
	});

	const ganttData = $derived.by(() => {
		const validTasks = tasks
			.map((task: any, index: number) => {
				if (!task.Date || task.Date === 'No Date') {
					return null;
				}

				const parts = task.Date.split('→').map((s: string) => s.trim());
				const startDate = new Date(`${parts[0]} 12:00:00`);
				const endDate = parts.length > 1 
					? new Date(`${parts[1]} 12:00:00`) 
					: new Date(`${parts[0]} 12:00:00`);

				if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
					return null;
				}

				return {
					...task,
					originalIndex: index,
					startDate,
					endDate,
					duration: Math.max(
						1,
						Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) +
							(parts.length > 1 ? 1 : 0)
					)
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
	<div class="flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
		<button
			class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors {currentView ===
			'calendar'
				? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
				: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
			onclick={() => (currentView = 'calendar')}
		>
			Calendar
		</button>
		<button
			class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors {currentView === 'gantt'
				? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
				: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
			onclick={() => (currentView = 'gantt')}
		>
			Gantt
		</button>
	</div>
</div>

{#if currentView === 'gantt'}
	<div class="h-[calc(100vh-180px)] min-h-[500px]">
		{#if isDark}
			<WillowDark>
				<Gantt tasks={ganttData.tasks} links={ganttData.links} />
			</WillowDark>
		{:else}
			<Willow>
				<Gantt tasks={ganttData.tasks} links={ganttData.links} />
			</Willow>
		{/if}
	</div>
{:else}
	<TimelineView {tasks} />
{/if}
