<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import SettingsIcon from './icons/settings.svg';

	const dispatch = createEventDispatcher();

	function openSettings() {
		dispatch('openSettings');
	}
</script>

<button on:click={openSettings} aria-label="Open settings">
	<img src={SettingsIcon} alt="Settings icon" class="icon" />
</button>

<style>
	/* also applied for other buttons */
	:global(button) {
		background-color: rgba(0, 0, 0, 0.2);
		padding: 0.5rem;
		display: flex;
		transition: background-color 0.2s;
		margin: 0;
	}

	:global(button:hover) {
		background-color: rgba(0, 0, 0, 0.4);
		transition: background-color 0.2s;
	}

	:global(body.dark-mode .icon) {
		filter: invert(1);
	}
</style>
