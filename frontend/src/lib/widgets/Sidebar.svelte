<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let drawerOpen = false;
	const dispatch = createEventDispatcher();

	function toggleDrawer() {
		drawerOpen = !drawerOpen;
		triggerDispatch();
	}

	function triggerDispatch() {
		dispatch('open', { open: drawerOpen });
	}
</script>

<div
	class={drawerOpen
		? 'h-screen w-[350px] flex flex-col bg-bg2-light dark:bg-bg2-dark z-30'
		: 'h-screen w-[55px] flex flex-col bg-bg2-light dark:bg-bg2-dark z-30'}
>
	<div class="w-full h-[60px] flex items-center justify-start pl-1.5">
		<button type="button" on:click={toggleDrawer} class="flex items-center justify-center">
			{#if drawerOpen}
				<ion-icon
					name="close"
					class="text-[40px] text-color-primary-light dark:text-color-primary-dark px-0.5 rounded-custom hover:bg-hover-light dark:hover:bg-hover-dark"
				/>
			{:else}
				<ion-icon
					name="menu"
					class="text-[40px] text-color-primary-light dark:text-color-primary-dark px-0.5 rounded-custom hover:bg-hover-light dark:hover:bg-hover-dark"
				/>
			{/if}
		</button>
	</div>

	<div
		class="w-full h-full border-r-[1.5px] border-border-light dark:border-border-dark px-1 pt-[80px]"
	>
		<slot />
	</div>

	<div>THEME</div>
</div>
