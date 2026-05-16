<script lang="ts">
	import type { PageData } from './$types';
	import TodoList from '$lib/components/TodoList.svelte';

	let { data }: { data: PageData } = $props();

	let tasks = $derived(data.tasks);
</script>

<svelte:head>
	<title>Logs</title>
</svelte:head>

<!-- Handle the Promise in the UI -->
{#await data.tasks}
	<p>Loading tasks...</p>
{:then resolvedTasks}
	<TodoList tasks={resolvedTasks} />
{:catch error}
	<p>Failed to load tasks: {error.message}</p>
{/await}
