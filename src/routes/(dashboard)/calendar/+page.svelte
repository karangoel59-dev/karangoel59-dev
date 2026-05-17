<script lang="ts">
	import type { PageData } from './$types';
	import CalendarSection from '$lib/components/CalendarSection.svelte';
	import AICommentator from '$lib/components/AICommentator.svelte';

	let { data }: { data: PageData } = $props();

	let tasks = $derived(data.tasks);
</script>

<svelte:head>
	<title>Schedule</title>
</svelte:head>

<div class="mb-8">
	{#await data.aiComment}
		<AICommentator loading={true} />
	{:then comment}
		{#if comment}
			<AICommentator {comment} />
		{/if}
	{/await}
</div>

{#await tasks}
	<p>Loading tasks...</p>
{:then resolvedTasks}
	<CalendarSection tasks={resolvedTasks} />
{:catch error}
	<p>Failed to load tasks: {error.message}</p>
{/await}
