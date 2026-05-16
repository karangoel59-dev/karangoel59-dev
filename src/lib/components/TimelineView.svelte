<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-ignore
	import { Calendar, DayGrid, TimeGrid, List } from '@event-calendar/core';

	let { tasks = [] } = $props();

	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});

	// Parse tasks to events
	const events = $derived(
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

				// For full-day events, the end date should be exclusive, so we add 1 day
				const exclusiveEndDate = new Date(endDate);
				exclusiveEndDate.setDate(exclusiveEndDate.getDate() + 1);

				// Generate an event object compatible with @event-calendar/core
				return {
					id: String(index + 1),
					start: startDate.toISOString().split('T')[0], // yyyy-mm-dd
					end: exclusiveEndDate.toISOString().split('T')[0],
					title: task.Task,
					allDay: true,
					backgroundColor: '#3b82f6', // blue-500
				};
			})
			.filter((e: any): e is NonNullable<typeof e> => e !== null)
	);

	let options = $state({
		view: 'dayGridMonth',
		events: [] as any[],
		headerToolbar: {
			start: 'prev,next today',
			center: 'title',
			end: 'dayGridMonth,timeGridWeek,listWeek'
		},
		buttonText: {
			today: 'Today',
			dayGridMonth: 'Month',
			timeGridWeek: 'Week',
			listWeek: 'List'
		},
		height: '500px'
	});

	$effect(() => {
		options.events = events;
	});
</script>

<div class="calendar-wrapper min-h-[500px]">
	{#if mounted}
		<Calendar plugins={[DayGrid, TimeGrid, List]} {options} />
	{/if}
</div>

<style>
	/* Make the calendar fit our styling a bit better */
	:global(.ec) {
		font-family: inherit;
		--ec-bg-color: #ffffff;
		--ec-text-color: #37352f;
		--ec-border-color: #e5e7eb;
		--ec-button-bg-color: #f3f4f6;
		--ec-button-border-color: #d1d5db;
		--ec-button-text-color: #374151;
		--ec-button-active-bg-color: #e5e7eb;
		--ec-button-active-border-color: #d1d5db;
		--ec-button-active-text-color: #111827;
	}
	:global(.ec-toolbar) {
		margin-bottom: 1rem;
	}
	:global(.ec-button) {
		border-radius: 0.375rem;
		padding: 0.375rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 500;
	}
	:global(.ec-event) {
		border-radius: 0.25rem;
		padding: 0.125rem 0.25rem;
		font-size: 0.75rem;
	}
</style>