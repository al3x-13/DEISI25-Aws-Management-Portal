<script lang="ts">
	export let title: string;
	export let buttonText: string;
	export let buttonHref: string;
</script>

<div class="w-full flex items-center justify-between">
	<h1 class="text-3xl text-color-primary-light dark:text-color-primary-dark">{title}</h1>
	<a
		href={buttonHref}
		class="text-lg text-white bg-color-primary-light dark:bg-color-primary-dark hover:bg-color-hover-light dark:hover:bg-color-hover-dark rounded-custom px-3 py-2 transition duration-100"
	>
		{buttonText}
	</a>
</div>
<div class="w-full h-0.5 bg-hover-light dark:bg-hover-dark mt-3" />
