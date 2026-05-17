<script lang="ts">
	import type { PageData } from './$types';
	import CalendarSection from '$lib/components/CalendarSection.svelte';

	let { data }: { data: PageData } = $props();

	let tasks = $derived(data.tasks);
</script>

<svelte:head>
	<title>Schedule</title>
</svelte:head>

{#await tasks}
	<p>Loading tasks...</p>
{:then resolvedTasks}
	<CalendarSection tasks={resolvedTasks} />
{:catch error}
	<p>Failed to load tasks: {error.message}</p>
{/await}
