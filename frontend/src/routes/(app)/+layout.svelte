<script lang="ts">
	import Header from '$lib/widgets/Header.svelte';
	import Sidebar from '$lib/widgets/Sidebar.svelte';
	import SidebarItem from '$lib/widgets/SidebarItem.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	let sidebarOpen: boolean = false;

	function updateSidebarState(event: CustomEvent<{ open: boolean }>) {
		sidebarOpen = event.detail.open;
	}
</script>

<div class="bg-bg-light dark:bg-bg-dark min-h-screen w-full flex">
	{#if data.props.user.role === 'root'}
		<Sidebar on:open={updateSidebarState}>
			<SidebarItem ionIcon="grid-outline" label="Dashboard" href="/root" open={sidebarOpen} />
		</Sidebar>
	{:else}
		<Sidebar on:open={updateSidebarState}>
			<SidebarItem ionIcon="grid-outline" label="Dashboard" href="/dashboard" open={sidebarOpen} />
			<SidebarItem
				ionIcon="hardware-chip-outline"
				label="EC2"
				href="/resources/compute/ec2"
				open={sidebarOpen}
			/>
		</Sidebar>
	{/if}

	<div class="w-full">
		<Header username={data.props.user.username} role={data.props.user.role} />
		<div class="w-full px-24 mt-12 flex items-start justify-center">
			<slot />
		</div>
	</div>
</div>
