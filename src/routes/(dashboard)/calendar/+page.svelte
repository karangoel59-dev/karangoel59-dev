<script lang="ts">
	import tasks from '$lib/tasks.json';
	import CalendarSection from '$lib/components/CalendarSection.svelte';
</script>

<svelte:head>
	<title>Calendar - Work Dashboard</title>
</svelte:head>

<CalendarSection {tasks} />
