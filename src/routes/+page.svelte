<script lang="ts">
	import tasks from '$lib/tasks.json';
	import DashboardIntro from '$lib/components/DashboardIntro.svelte';
	import TodoList from '$lib/components/TodoList.svelte';
	import CalendarSection from '$lib/components/CalendarSection.svelte';
</script>

<svelte:head>
	<title>Work Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-white font-sans text-[#37352f]">
	<!-- Cover Image -->
	<div class="relative h-[30vh] w-full overflow-hidden">
		<img
			src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb"
			alt="Cover"
			class="h-full w-full object-cover object-[center_15%]"
		/>
	</div>

	<main class="mx-auto max-w-[900px] px-12 pb-24">
		<DashboardIntro />

		<!-- Content -->
		<div class="space-y-4 text-base leading-relaxed">
			<TodoList {tasks} />
			<CalendarSection {tasks} />
		</div>
	</main>
</div>
