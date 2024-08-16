<script lang="ts">
    import { onMount } from 'svelte';
    import SunIcon from './icons/sun.svg';
    import MoonIcon from './icons/moon.svg';
    
    let isDarkMode = true;

    function setTheme(darkMode: boolean) {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    function toggle() {
        isDarkMode = !isDarkMode;
        setTheme(isDarkMode);
        localStorage.setItem('darkMode', isDarkMode.toString());
    }

    onMount(() => {
        const localDarkMode = localStorage.getItem('darkMode');
        
        if (localDarkMode !== null) {
            isDarkMode = localDarkMode === 'true';
        } else {
            isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        setTheme(isDarkMode);
    });
</script>

<button on:click={toggle} aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
    {#if isDarkMode}
        <img src={SunIcon} alt="Sun icon" class="icon" />
    {:else}
        <img src={MoonIcon} alt="Moon icon" class="icon" />
    {/if}
</button>
