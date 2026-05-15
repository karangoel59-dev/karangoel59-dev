<script lang="ts">
	import Calendar from '$lib/Calendar.svelte';
	import { getEventColors } from '$lib/utils';

	let { tasks = [] } = $props();

	const calendarEvents = $derived(
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

				// Ensure the endDate is inclusive by setting it to the end of the day.
				endDate.setHours(23, 59, 59, 999);

				const colors = getEventColors(task['Task Type']);

				return {
					id: index,
					name: task.Task,
					startDate,
					endDate,
					color: colors.background,
					textColor: colors.text
				};
			})
			.filter((e: any): e is NonNullable<typeof e> => e !== null)
	);

	// Determine a relevant month to display, defaulting to the first event's month.
	let displayMonth = $state(new Date());

	$effect(() => {
		if (calendarEvents.length > 0) {
			// Sort by start date to find the earliest event
			const sortedEvents = [...calendarEvents].sort(
				(a, b) => a.startDate.getTime() - b.startDate.getTime()
			);
			displayMonth = sortedEvents[0].startDate;
		}
	});
</script>

<h3 class="mt-12 mb-4 text-xl font-semibold">Calendar View</h3>
<Calendar bind:month={displayMonth} events={calendarEvents} />
