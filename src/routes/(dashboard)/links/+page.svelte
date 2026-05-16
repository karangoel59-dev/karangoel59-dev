<script lang="ts">
</script>

<svelte:head>
	<title>Quick Links - Work Dashboard</title>
</svelte:head>

<div>
	<h3 class="mb-4 text-xl font-semibold">Quick links</h3>
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
