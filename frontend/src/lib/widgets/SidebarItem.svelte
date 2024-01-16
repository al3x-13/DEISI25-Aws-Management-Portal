<script lang="ts">
	export let ionIcon: string;
	export let label: string;
	export let open: boolean;
</script>

<button type="button" class="flex items-center justify-center px-[4px]">
	<ion-icon
		name={ionIcon}
		class="text-[31px] text-color-primary-light dark:text-color-primary-dark p-1 rounded-custom hover:bg-hover-light dark:hover:bg-hover-dark"
	/>

	{#if open}
		<p class="ml-6">{label}</p>
	{/if}
</button>
