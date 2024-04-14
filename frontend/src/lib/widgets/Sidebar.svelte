<script lang="ts">
	import { darkModeActive, setDarkMode, setLightMode } from '$lib/darkMode';
	import { Menu, Moon, Sun, X } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	let drawerOpen = false;
	let darkModeOn = darkModeActive();
	const dispatch = createEventDispatcher();

	function toggleDrawer() {
		drawerOpen = !drawerOpen;
		triggerDispatch();
	}

	function triggerDispatch() {
		dispatch('open', { open: drawerOpen });
	}

	function switchToDarkMode() {
		setDarkMode();
		darkModeOn = true;
	}

	function switchToLightMode() {
		setLightMode();
		darkModeOn = false;
	}
</script>

<div
	class={drawerOpen
		? 'h-screen w-[300px] flex flex-col bg-bg2-light dark:bg-bg2-dark z-30'
		: 'h-screen w-[55px] flex flex-col bg-bg2-light dark:bg-bg2-dark z-30'}
>
	<div
		class="w-full h-[60px] flex items-center justify-start pl-1.5 py-3 border-b-[1px] border-border-light dark:border-border-dark"
	>
		<button
			type="button"
			on:click={toggleDrawer}
			class="flex items-center justify-center rounded-custom hover:bg-hover-light dark:hover:bg-hover-dark"
		>
			{#if drawerOpen}
				<X size={40} class="text-color-primary-light dark:text-color-primary-dark z-30" />
			{:else}
				<Menu size={40} class="text-color-primary-light dark:text-color-primary-dark z-30" />
			{/if}
		</button>
	</div>

	<div
		class="w-full h-full border-r-[1.5px] border-border-light dark:border-border-dark px-1 pt-[80px] space-y-6"
	>
		<slot />
	</div>

	<button
		type="button"
		on:click={() => {
			if (darkModeOn) {
				switchToLightMode();
			} else {
				switchToDarkMode();
			}
		}}
		class="w-full flex items-center justify-start border-r-[1.5px] border-border-light dark:border-border-dark pl-2.5 py-4 group"
	>
		{#if darkModeOn}
			<Sun size={35} class="text-color-primary-light dark:text-color-primary-dark group-hover:text-color-hover-light dark:group-hover:text-color-hover-dark z-30" />
		{:else}
			<Moon size={35} class="text-color-primary-light dark:text-color-primary-dark group-hover:text-color-hover-light dark:group-hover:text-color-hover-dark z-30" />
		{/if}

		{#if drawerOpen}
			<p
				class="ml-6 text-xl font-semibold text-color-primary-light dark:text-color-primary-dark group-hover:text-color-hover-light dark:group-hover:text-color-hover-dark"
			>
				{#if darkModeOn}
					Switch to Light
				{:else}
					Switch to Dark
				{/if}
			</p>
		{/if}
	</button>
</div>
