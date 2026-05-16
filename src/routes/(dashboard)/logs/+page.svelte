<script lang="ts">
	import type { PageData } from './$types';
	import TodoList from '$lib/components/TodoList.svelte';
	
	let { data }: { data: PageData } = $props();
	
	let tasks = $derived(data.tasks);
</script>

<svelte:head>
	<title>Logs</title>
</svelte:head>

<TodoList {tasks} />
