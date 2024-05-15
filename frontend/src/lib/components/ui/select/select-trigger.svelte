<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	type $$Props = SelectPrimitive.TriggerProps;
	type $$Events = SelectPrimitive.TriggerEvents;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Trigger
	class={cn(
		'flex h-10 w-full items-center justify-between rounded-custom border-2 border-input bg-transparent px-3 py-2 text-base text-text-light dark:text-text-dark ring-offset-background placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...$$restProps}
	let:builder
	on:click
	on:keydown
>
	<slot {builder} />
	<div>
		<ChevronDown class="h-4 w-4 opacity-50" />
	</div>
</SelectPrimitive.Trigger>
