<script lang="ts">
	export let title: string;
	export let buttonText: string;
	export let buttonHref: string;
</script>

<div class="w-full flex items-center justify-between">
	<h1 class="text-3xl text-color-primary-light dark:text-color-primary-dark">{title}</h1>
	<a
		href={buttonHref}
		class="text-lg text-color-primary-light dark:text-color-primary-dark border-[2px] border-color-primary-light dark:border-color-primary-dark hover:text-white dark:hover:text-white hover:bg-color-primary-light dark:hover:bg-color-primary-dark rounded-custom px-2.5 py-1.5 transition duration-100"
	>
		{buttonText}
	</a>
</div>
<div class="w-full h-1 bg-hover-light dark:bg-hover-dark mt-3" />
