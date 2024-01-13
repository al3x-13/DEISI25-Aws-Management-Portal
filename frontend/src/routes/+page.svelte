<script lang="ts">
	import DarkModeButton from '$lib/assets/DarkModeButton.svelte';
	import LogoWithText from '$lib/assets/LogoWithText.svelte';
</script>

<svelte:head>
	<title>AWS Management Portal</title>
</svelte:head>

<div class="fixed w-full flex items-center justify-between py-6 px-8">
	<h1
		class="text-2xl font-oxygen font-[700] text-color-primary-light dark:text-color-primary-dark select-none"
	>
		Company Logo
	</h1>
	<DarkModeButton />
</div>

<div
	class="w-full h-[100vh] flex flex-col items-center justify-center bg-gradient-to-tr from-[#DADADA]
dark:from-[#19212E] to-[#F3F3F3] dark:to-[#253144]"
>
	<LogoWithText />
	<a
		href="/login"
		class="text-lg font-[500] text-zinc-200 bg-color-primary-light dark:bg-color-primary-dark
    rounded-md py-2 px-4 mt-16 select-none"
	>
		Login
	</a>
</div>

<div
	class="fixed w-[40px] h-[40px] flex items-center justify-center right-0 bottom-0 text-2xl font-[700] text-zinc-500
bg-[#CCCCCC] rounded-full m-8 select-none"
>
	<p>?</p>
</div>
