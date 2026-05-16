<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-ignore
	import { Calendar, DayGrid, TimeGrid, List } from '@event-calendar/core';
	import { getTypes, getPillColor } from '$lib/utils';

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
				const startDate = new Date(parts[0] + 'T12:00:00');
				const endDate =
					parts.length > 1 ? new Date(parts[1] + 'T12:00:00') : new Date(parts[0] + 'T12:00:00');

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
					extendedProps: {
						taskType: task['Task Type'] || '',
						completed: task[' '] === 'Yes'
					}
				};
			})
			.filter((e: any): e is NonNullable<typeof e> => e !== null)
	);

	let options = $state({
		view: 'dayGridMonth',
		events: [] as any[],
		eventContent: (info: any) => {
			const { event } = info;
			const { extendedProps } = event;
			const checked = extendedProps.completed ? 'checked' : '';

			const types = getTypes(extendedProps.taskType);
			const typeHtml = types
				.map(
					(type: string) =>
						`<span class="${getPillColor(type)}" style="padding: 2px 4px; border-radius: 4px; font-size: 10px; font-weight: 500; line-height: 1;">${type}</span>`
				)
				.join('');

			return {
				html: `
					<div style="display: flex; flex-direction: column; padding: 4px; gap: 4px; white-space: normal;">
						<div style="display: flex; align-items: flex-start; gap: 6px;">
							<input type="checkbox" ${checked} disabled style="margin-top: 2px; flex-shrink: 0; pointer-events: none;" />
							<span style="word-break: break-word; line-height: 1.25;">${event.title}</span>
						</div>
						${types.length > 0 ? `<div style="display: flex; flex-wrap: wrap; gap: 4px; margin-left: 20px;">${typeHtml}</div>` : ''}
					</div>
				`
			};
		},
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
		height: 'calc(100vh - 180px)'
	});

	$effect(() => {
		options.events = events;
	});
</script>

<div class="calendar-wrapper h-[calc(100vh-180px)] min-h-[500px]">
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
	:global(html.dark .ec) {
		--ec-bg-color: #111827;
		--ec-text-color: #f3f4f6;
		--ec-border-color: #374151;
		--ec-button-bg-color: #374151;
		--ec-button-border-color: #4b5563;
		--ec-button-text-color: #e5e7eb;
		--ec-button-active-bg-color: #4b5563;
		--ec-button-active-border-color: #6b7280;
		--ec-button-active-text-color: #ffffff;
		--ec-today-bg-color: rgba(59, 130, 246, 0.15);
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
