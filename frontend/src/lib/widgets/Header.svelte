<script lang="ts">
	import NavbarLogo from '$lib/assets/NavbarLogo.svelte';

	export let username: string | undefined;
	export let role: string | undefined;

	let userOptionsDropdownActive = false;
</script>

<nav
	class="w-full h-[60px] flex items-center justify-end bg-bg2-light dark:bg-bg2-dark border-b-[1.5px] border-border-light dark:border-border-dark px-4 py-1 z-20"
>
	<div class="fixed w-full mx-auto">
		<NavbarLogo />
	</div>

	<div class="flex items-center justify-center">
		<div
			class="flex flex-col items-end justify-center text-color-primary-light dark:text-color-primary-dark mr-4"
		>
			<p class="-mb-0.5 text-lg">{username}</p>
			<p class="-mt-1 text-sm font-[800]">{role}</p>
		</div>

		<div
			class="w-[34px] h-[34px] flex items-center justify-center bg-[#3276DC] rounded-full text-[14px] font-bold text-white mr-3"
		>
			AM
		</div>

		<button
			class="flex items-center justify-center p-1"
			on:click={() => (userOptionsDropdownActive = !userOptionsDropdownActive)}
		>
			{#if userOptionsDropdownActive}
				<ion-icon
					name="chevron-up"
					class="text-[28px] text-color-primary-light dark:text-color-primary-dark"
				/>
			{:else}
				<ion-icon
					name="chevron-down"
					class="text-[28px] text-color-primary-light dark:text-color-primary-dark"
				/>
			{/if}
		</button>

		{#if userOptionsDropdownActive}
			<div
				class="absolute w-44 bg-bg2-light dark:bg-bg2-dark top-[65px] right-[5px] border-[1.5px] border-border-light dark:border-border-dark rounded-custom p-1.5"
			>
				<a
					href="/logout"
					class="w-full flex items-center justify-start font-[600] text-red-700 px-2 py-1 rounded-custom hover:bg-hover-light dark:hover:bg-hover-dark"
				>
					Logout
				</a>
			</div>
		{/if}
	</div>
</nav>
