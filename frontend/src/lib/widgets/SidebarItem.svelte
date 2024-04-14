<script lang="ts">
	// export let ionIcon: string;
	export let label: string;
	export let href: string;
	export let open: boolean;
</script>

<a {href} type="button" class="flex items-center justify-start ml-1 p-1 group cursor-pointer">
	<!-- <ion-icon
		name={ionIcon}
		class="text-[31px] text-color-primary-light dark:text-color-primary-dark group-hover:text-color-hover-light dark:group-hover:text-color-hover-dark"
	/> -->
	<!-- TODO: remove this -->
	<slot/>

	{#if open}
		<p
			class="ml-6 text-xl font-semibold text-color-primary-light dark:text-color-primary-dark group-hover:text-color-hover-light dark:group-hover:text-color-hover-dark"
		>
			{label}
		</p>
	{/if}
</a>
