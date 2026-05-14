<script lang="ts">
	import tasks from '$lib/tasks.json';

	// Helper function to assign colors to task types
	function getPillColor(type: string) {
		type = type.trim();
		switch (type.toLowerCase()) {
			case 'issue':
				return 'bg-purple-100 text-purple-700';
			case 'development':
				return 'bg-blue-100 text-blue-700';
			case 'chore':
				return 'bg-red-100 text-red-700';
			case 'personal':
				return 'bg-gray-100 text-gray-700';
			case 'work':
				return 'bg-yellow-100 text-yellow-700';
			default:
				return 'bg-slate-100 text-slate-700';
		}
	}

	function getTypes(typeString: string) {
		if (!typeString) return [];
		return typeString
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);
	}

	// Parse tasks for Calendar/Agenda view
	// We'll extract the first date from the date range if present
	function getPrimaryDate(dateStr: string) {
		if (!dateStr) return 'No Date';
		// Split by the arrow character to get the start date
		return dateStr.split('→')[0].trim();
	}

	// Group tasks by their primary date
	const tasksByDate = tasks.reduce(
		(acc, task) => {
			const date = getPrimaryDate(task.Date);
			if (!acc[date]) {
				acc[date] = [];
			}
			acc[date].push(task);
			return acc;
		},
		{} as Record<string, typeof tasks>
	);

	// Sort dates (simple string sort might not be perfect for actual dates, but works decently for this format if we parse them)
	const sortedDates = Object.keys(tasksByDate).sort((a, b) => {
		if (a === 'No Date') return 1;
		if (b === 'No Date') return -1;
		return new Date(a).getTime() - new Date(b).getTime();
	});
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
		<!-- Icon -->
		<div class="-mt-[3rem] mb-4">
			<img
				src="/icon.jpeg"
				alt="Icon"
				class="inline-block h-[78px] w-[78px] rounded bg-white object-cover shadow-sm"
			/>
		</div>

		<!-- Title -->
		<h1 class="mb-8 text-[40px] leading-tight font-bold">Work Dashboard</h1>

		<!-- Content -->
		<div class="space-y-4 text-base leading-relaxed">
			<!-- Thing to Note section -->
			<div>
				<h3 class="mt-6 mb-2 text-xl font-semibold">Thing to Note:</h3>
				<ul class="list-disc space-y-1 pl-5">
					<li class="min-h-[1.5em]"></li>
				</ul>
			</div>

			<hr class="my-4 border-t border-gray-200" />

			<!-- Quick Links section -->
			<div>
				<h3 class="mt-6 mb-2 text-xl font-semibold">Quick links</h3>
				<ul class="list-disc space-y-1 pl-5">
					<li>
						Engineering
						<ul class="mt-1 list-[circle] space-y-1 pl-5">
							<li>
								<a
									href="https://chat360-jira.atlassian.net/browse/AA"
									class="underline underline-offset-2 opacity-80 hover:opacity-100"
									>Check assigned tickets (JIRA)</a
								>
							</li>
							<li>
								<a
									href="https://github.com/sumanel/chat360-agents"
									class="underline underline-offset-2 opacity-80 hover:opacity-100"
									>Review PRs (GitHub)</a
								>
							</li>
							<li>
								<a
									href="https://staging.chat360.io/"
									class="underline underline-offset-2 opacity-80 hover:opacity-100">Open staging</a
								>
							</li>
						</ul>
					</li>
				</ul>
			</div>

			<!-- To Do List Title -->
			<h3 class="mt-8 mb-4 text-xl font-semibold">To Do List</h3>

			<!-- Table -->
			<div class="mb-8 overflow-x-auto">
				<table class="w-full border-collapse border-y border-gray-200 text-sm">
					<thead>
						<tr class="border-b border-gray-200 text-left text-gray-500">
							<th class="w-12 border-x border-gray-200 px-3 py-2 font-normal">Done</th>
							<th class="min-w-[200px] border-x border-gray-200 px-3 py-2 font-normal">Task</th>
							<th class="border-x border-gray-200 px-3 py-2 font-normal">Date</th>
							<th class="border-x border-gray-200 px-3 py-2 font-normal">LINK</th>
							<th class="min-w-[150px] border-x border-gray-200 px-3 py-2 font-normal">Task Type</th
							>
						</tr>
					</thead>
					<tbody>
						{#each tasks as task}
							<tr class="border-b border-gray-100 hover:bg-gray-50/50">
								<td class="border-x border-gray-200 px-3 py-2 text-center">
									<input
										type="checkbox"
										checked={task[' '] === 'Yes'}
										class="h-4 w-4 cursor-not-allowed rounded border-gray-300 text-blue-500 focus:ring-blue-500"
										readonly
									/>
								</td>
								<td class="border-x border-gray-200 px-3 py-2 font-medium">
									{task.Task}
								</td>
								<td class="border-x border-gray-200 px-3 py-2 whitespace-nowrap text-gray-500">
									{task.Date}
								</td>
								<td class="max-w-[200px] truncate border-x border-gray-200 px-3 py-2 text-gray-500">
									{#if task.LINK}
										<a
											href={task.LINK}
											class="block truncate underline underline-offset-2 opacity-80 hover:opacity-100"
											target="_blank"
											rel="noreferrer"
											title={task.LINK}
										>
											{task.LINK}
										</a>
									{/if}
								</td>
								<td class="border-x border-gray-200 px-3 py-2">
									<div class="flex flex-wrap gap-1">
										{#each getTypes(task['Task Type']) as type}
											<span
												class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium {getPillColor(
													type
												)}"
											>
												{type}
											</span>
										{/each}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Calendar Section -->
			<h3 class="mt-12 mb-4 text-xl font-semibold">Calendar</h3>
			<div class="grid grid-cols-1 gap-4 pb-12 md:grid-cols-2 lg:grid-cols-3">
				{#each sortedDates as date}
					<div
						class="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
					>
						<div class="mb-3 border-b border-gray-100 pb-2 font-semibold text-gray-800">
							{date}
						</div>
						<div class="flex-1 space-y-3">
							{#each tasksByDate[date] as task}
								<div class="flex items-start gap-2">
									<div class="mt-1 flex-shrink-0">
										<input
											type="checkbox"
											checked={task[' '] === 'Yes'}
											class="h-3.5 w-3.5 cursor-not-allowed rounded border-gray-300 text-blue-500"
											readonly
										/>
									</div>
									<div class="min-w-0 flex-1">
										<p class="mb-1 text-sm leading-tight font-medium text-gray-900">
											{task.Task}
										</p>
										<div class="flex flex-wrap gap-1">
											{#each getTypes(task['Task Type']) as type}
												<span
													class="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium {getPillColor(
														type
													)}"
												>
													{type}
												</span>
											{/each}
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</main>
</div>
