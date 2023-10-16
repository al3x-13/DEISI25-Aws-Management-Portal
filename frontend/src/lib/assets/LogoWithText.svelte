<script>
	import { darkModeActive } from "$lib/darkMode";
    import Logo from "./Logo.svelte";
    
    $: dark = darkModeActive();
</script>

<div class="flex flex-col items-center justify-center">
    {#if dark}
        <Logo size={230} color='#0B79DE' />
        <h1 class={`text-[2.5rem] text-[#0B79DE] font-oxygen font-[700] mt-10`}>AWS Management Portal</h1>
    {:else}
        <Logo size={230} color='#3D97EA' />
        <h1 class={`text-[2.5rem] text-[#3D97EA] font-oxygen font-[700] mt-10`}>AWS Management Portal</h1>
    {/if}
</div>