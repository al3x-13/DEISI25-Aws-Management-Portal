<script lang="ts">
	import Header from '$lib/widgets/Header.svelte';
	import Sidebar from '$lib/widgets/Sidebar.svelte';
	import SidebarItem from '$lib/widgets/SidebarItem.svelte';
	import { Cpu, KeyRound, LayoutDashboard, Users } from 'lucide-svelte';
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
			<SidebarItem label="Dashboard" href="/root" open={sidebarOpen}>
				<LayoutDashboard size={32} class="text-color-primary-light dark:text-color-primary-dark" />
			</SidebarItem>
			<SidebarItem label="Users" href="/users" open={sidebarOpen}>
				<Users size={32} class="text-color-primary-light dark:text-color-primary-dark" />
			</SidebarItem>
		</Sidebar>
	{/if}

	{#if data.props.user.role === 'admin'}
		<Sidebar on:open={updateSidebarState}>
			<SidebarItem label="Dashboard" href="/dashboard" open={sidebarOpen}>
				<LayoutDashboard size={32} class="text-color-primary-light dark:text-color-primary-dark" />
			</SidebarItem>
			<SidebarItem label="EC2" href="/resources/compute/ec2" open={sidebarOpen}>
				<Cpu size={32} class="text-color-primary-light dark:text-color-primary-dark" />
			</SidebarItem>
			<SidebarItem label="SSH Keys" href="/resources/compute/ssh" open={sidebarOpen}>
				<KeyRound size={32} class="text-color-primary-light dark:text-color-primary-dark" />
			</SidebarItem>
			<SidebarItem label="Users" href="/users" open={sidebarOpen}>
				<Users size={32} class="text-color-primary-light dark:text-color-primary-dark" />
			</SidebarItem>
		</Sidebar>
	{/if}

	{#if data.props.user.role === 'user'}
		<Sidebar on:open={updateSidebarState}>
			<SidebarItem label="Dashboard" href="/dashboard" open={sidebarOpen}>
				<LayoutDashboard size={32} class="text-color-primary-light dark:text-color-primary-dark" />
			</SidebarItem>
			<SidebarItem label="EC2" href="/resources/compute/ec2" open={sidebarOpen}>
				<Cpu size={32} class="text-color-primary-light dark:text-color-primary-dark" />
			</SidebarItem>
			<SidebarItem label="SSH Keys" href="/resources/compute/ssh" open={sidebarOpen}>
				<KeyRound size={32} class="text-color-primary-light dark:text-color-primary-dark" />
			</SidebarItem>
		</Sidebar>
	{/if}

	<div class="w-full">
		<Header username={data.props.user.username} role={data.props.user.role} />
		<div class="w-full px-24 mt-24 flex items-start justify-center">
			<slot />
		</div>
	</div>
</div>
