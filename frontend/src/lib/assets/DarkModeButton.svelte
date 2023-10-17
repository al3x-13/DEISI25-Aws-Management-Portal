<script lang="ts">
	import { darkModeActive, setDarkMode, setLightMode } from '$lib/darkMode';
    import { Moon, Sun } from 'lucide-svelte';

    let dark = darkModeActive();
    
    function activateDarkMode() {
        setDarkMode();
        dark = true;
    }
    
    function activateLightMode() {
        setLightMode();
        dark = false;
    }
</script>

<div>
    {#if dark}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={activateLightMode} class="flex cursor-pointer">
            <Sun size={40} class="text-color-primary-dark" />
        </div>
    {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={activateDarkMode} class="flex cursor-pointer">
            <Moon size={40} class="text-color-primary-light scale-x-[-1]" />
        </div>
    {/if}
</div>