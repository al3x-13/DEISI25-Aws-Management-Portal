<script lang="ts">
	import Header from '$lib/widgets/Header.svelte';
	import '../../app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="bg-bg-light dark:bg-bg-dark min-h-screen">
	<Header username={data.props.user.username} role={data.props.user.role} />
	<div class="w-full h-[60px]" />
	<slot />
</div>
