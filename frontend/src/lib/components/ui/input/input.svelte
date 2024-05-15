<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import type { InputEvents } from '.';

	type $$Props = HTMLInputAttributes;
	type $$Events = InputEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'] = undefined;
	export { className as class };
</script>

<input
	class={cn(
		'flex h-10 w-full rounded-custom border-2 border-input text-text-light dark:text-text-dark bg-transparent px-3 py-2 text-base ring-offset-background file:border-0  file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-color-primary-light dark:focus:border-color-primary-dark disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	bind:value
	on:blur
	on:change
	on:click
	on:focus
	on:focusin
	on:focusout
	on:keydown
	on:keypress
	on:keyup
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:paste
	on:input
	{...$$restProps}
/>
