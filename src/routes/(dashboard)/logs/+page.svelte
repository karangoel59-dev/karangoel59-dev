<script lang="ts">
	import tasks from '$lib/tasks.json';
	import TodoList from '$lib/components/TodoList.svelte';
</script>

<svelte:head>
	<title>Logs</title>
</svelte:head>

<TodoList {tasks} />
