<script lang="ts">
	import Header from '$lib/widgets/Header.svelte';
	import '../../app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Oxygen:wght@300;400;700&display=swap"
		rel="stylesheet"
	/>
</head>

<div class="bg-bg-light dark:bg-bg-dark min-h-screen">
	<Header username={data.props.user.username} role={data.props.user.role} />
	<div class="w-full h-[60px]" />
	<slot />
</div>
