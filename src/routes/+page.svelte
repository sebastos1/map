<script lang="ts">
	import Map from '../Map.svelte';
	import DarkModeButton from '../DarkModeButton.svelte';
	import SettingsButton from '../SettingsButton.svelte';
	import Settings from '../Settings.svelte';
	import Timer from '../Timer.svelte';

	let countryInput = '';
	let mapComponent: Map;
	let mapLoaded = false;
	let guessedCountries = new Set<string>();
	let allCountryNames = new Set<string>();
	let showSettings = false;

	let timerMode = false;
	let moveMode = false;

	$: guessedCount = 0;
	$: totalCount = allCountryNames.size;
	$: if (countryInput) handleInput();

	function handleMapReady(event: CustomEvent<Set<string>>) {
		mapLoaded = true;
		allCountryNames = event.detail;
	}

	function handleInput() {
		const countryName = countryInput.toLowerCase();
		if (!allCountryNames.has(countryName) || guessedCountries.has(countryName)) return;

		mapComponent.highlightCountry(countryName);
		guessedCountries.add(countryName);
		guessedCount += 1;
		countryInput = '';

		if (moveMode) mapComponent.centerOnCountry(countryName);
	}

	function toggleSettings() {
		showSettings = !showSettings;
	}

	function updateSettings(event: CustomEvent) {
		({ timerMode, moveMode } = event.detail);
	}

	function handleTimerComplete() {
		// go to results here, todo
		countryInput = '';
	}
</script>

<header>
	<h1>countries</h1>
	<div class="buttons">
		<SettingsButton on:openSettings={toggleSettings} />
		<DarkModeButton />
	</div>
</header>

<div class="input-container">
	<input
		bind:value={countryInput}
		placeholder="country name"
		disabled={!mapLoaded || (timerMode && guessedCount > 0)}
	/>
	<span class="counter">{guessedCount}/{totalCount}</span>
	{#if timerMode}
		<Timer active={timerMode && guessedCount > 0} on:timerComplete={handleTimerComplete} />
	{/if}
</div>

<div id="map-container">
	{#if !mapLoaded}
		<div class="loading">:v</div>
	{/if}
	<Map bind:this={mapComponent} on:mapReady={handleMapReady} />
</div>

{#if showSettings}
	<Settings
		bind:timerMode
		bind:moveMode
		on:updateSettings={updateSettings}
		on:closeSettings={toggleSettings}
	/>
{/if}

<style>
	:global(body) {
		font-family: 'Outfit', sans-serif;
		background-color: #f2eee2;
		color: #001f40;
		transition: background-color 0.3s;
	}
	:global(body.dark-mode) {
		background-color: #1d3040;
		color: #bfc2c7;
		transition: background-color 0.3s;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2px solid currentColor;
		padding-bottom: 0.5rem;
		margin-bottom: 1rem;
	}
	h1 {
		color: inherit;
		margin: 0;
	}

	input {
		background-color: rgba(0, 0, 0, 0.2);
		color: inherit;
		margin: 1rem 0 1rem 0;
	}
	.input-container {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.counter {
		font-size: 2rem;
		font-weight: bold;
	}

	#map-container {
		height: 80vh;
		width: 100%;
		position: relative;
	}
	.loading {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.1);
		align-items: center;
		font-size: 5rem;
		z-index: 1000;
	}

	.buttons {
		display: flex;
		gap: 0.5rem;
	}
</style>
