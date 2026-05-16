<script>
	import {
		startOfMonth,
		endOfMonth,
		startOfWeek,
		endOfWeek,
		eachDayOfInterval,
		getDate,
		getDay,
		isSameMonth,
		isSameDay,
		differenceInDays,
		format,
		addMonths,
		subMonths
	} from 'date-fns';

	let {
		/** @type {Date} */
		month = $bindable(),
		/** @type {{id: any, name: string, startDate: Date, endDate: Date, color?: string, textColor?: string}[]} */
		events = []
	} = $props();

	function goToNextMonth() {
		month = addMonths(month, 1);
	}

	function goToPrevMonth() {
		month = subMonths(month, 1);
	}

	const monthStart = $derived(startOfMonth(month));
	const monthEnd = $derived(endOfMonth(month));
	const calendarStart = $derived(startOfWeek(monthStart));
	const calendarEnd = $derived(endOfWeek(monthEnd));

	const calendarDays = $derived(eachDayOfInterval({ start: calendarStart, end: calendarEnd }));

	const weeks = $derived.by(() => {
		const w = [];
		for (let i = 0; i < calendarDays.length; i += 7) {
			w.push(calendarDays.slice(i, i + 7));
		}
		return w;
	});
</script>

<div class="calendar">
	<div class="calendar-header">
		<button title="Previous month" onclick={goToPrevMonth}>‹</button>
		<h2 class="calendar-title">{format(month, 'MMMM yyyy')}</h2>
		<button title="Next month" onclick={goToNextMonth}>›</button>
	</div>
	<div class="week-header">
		<div>Sun</div>
		<div>Mon</div>
		<div>Tue</div>
		<div>Wed</div>
		<div>Thu</div>
		<div>Fri</div>
		<div>Sat</div>
	</div>

	<div class="days-grid">
		<!-- Render the day cells for the background grid -->
		{#each calendarDays as day (day.toISOString())}
			<div class="day" class:not-in-month={!isSameMonth(day, monthStart)}>
				<span class="day-number">{getDate(day)}</span>
			</div>
		{/each}

		<!-- Events are placed on top of the day grid -->
		{#each weeks as week, weekIndex}
			{@const weekStart = week[0]}
			{@const weekEnd = week[6]}
			{#each events as event (event.id)}
				<!-- Check if the event intersects with the current week -->
				{#if event.startDate <= weekEnd && event.endDate >= weekStart}
					{@const segmentStart = event.startDate > weekStart ? event.startDate : weekStart}
					{@const segmentEnd = event.endDate < weekEnd ? event.endDate : weekEnd}

					{@const startDayOfWeek = getDay(segmentStart)}
					{@const span = differenceInDays(segmentEnd, segmentStart) + 1}

					<div
						class="event"
						style="grid-column: {startDayOfWeek + 1} / span {span}; grid-row: {weekIndex +
							1}; background-color: {event.color ?? '#007bff'}; color: {event.textColor ?? 'white'}"
						class:event-start={isSameDay(segmentStart, event.startDate)}
						class:event-end={isSameDay(segmentEnd, event.endDate)}
					>
						<!-- Show name only on the first segment of the event -->
						{#if isSameDay(segmentStart, event.startDate)}
							{event.name}
						{/if}
					</div>
				{/if}
			{/each}
		{/each}
	</div>
</div>

<style>
	:root {
		--grid-border: 1px solid #e5e7eb;
	}
	.calendar {
		width: 100%;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
			'Helvetica Neue', sans-serif;
	}
	.calendar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.calendar-header button {
		background: none;
		border: 1px solid transparent;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		font-size: 24px;
		cursor: pointer;
		color: #37352f;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		padding: 0;
		padding-bottom: 4px; /* optical adjustment */
	}
	.calendar-header button:hover {
		background-color: #f0f0f0;
	}
	.calendar-title {
		font-size: 1.5rem;
		font-weight: bold;
		text-align: center;
		margin: 0;
	}
	.week-header {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		text-align: center;
		font-weight: bold;
		padding: 10px 0;
		border-bottom: var(--grid-border);
	}
	.days-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-auto-rows: minmax(100px, auto); /* Give rows a flexible height */
		position: relative; /* Needed for z-index on events to work properly */
		border-left: var(--grid-border);
	}
	.day {
		border-right: var(--grid-border);
		border-bottom: var(--grid-border);
		padding: 5px;
	}
	.day.not-in-month {
		background-color: #f7f7f7;
		color: #aaa;
	}
	.day-number {
		font-size: 0.9em;
	}

	.event {
		padding: 4px 8px;
		margin: 30px 2px 0 2px; /* Position it vertically within the row */
		border-radius: 5px;
		font-size: 0.8em;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		z-index: 1;
		align-self: start;
		height: 24px;
		line-height: 24px;
		box-sizing: border-box;
	}

	.event.event-start:not(.event-end) {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		margin-right: 0;
	}
	.event.event-end:not(.event-start) {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		margin-left: 0;
	}
	.event:not(.event-start):not(.event-end) {
		border-radius: 0;
		margin-left: 0;
		margin-right: 0;
	}
</style>
