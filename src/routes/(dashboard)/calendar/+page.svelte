<script lang="ts">
	import type { PageData } from './$types';
	import CalendarSection from '$lib/components/CalendarSection.svelte';
	let { data }: { data: PageData } = $props();

	let tasks = $derived(data.tasks);
</script>

<svelte:head>
	<title>Calendar</title>
</svelte:head>

<CalendarSection {tasks} />
