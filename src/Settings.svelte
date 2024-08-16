<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let timerMode: boolean;
	export let moveMode: boolean;

	function handleChange() {
		dispatch('updateSettings', { timerMode, moveMode });
	}
</script>

<div class="settings-modal">
	<h2>Settings</h2>
	<div class="settings-options">
		<label class="switch">
			<input type="checkbox" bind:checked={timerMode} on:change={handleChange} />
			<span class="slider"></span>
			<span>Enable timer</span>
		</label>
		<label class="switch">
			<input type="checkbox" bind:checked={moveMode} on:change={handleChange} />
			<span class="slider"></span>
			<span>Move on guess</span>
		</label>
	</div>
	<div>
		<button on:click={() => dispatch('closeSettings')}>Close</button>
	</div>
</div>

<style>
	.settings-modal {
		position: fixed;
		inset: 50% auto auto 50%;
		transform: translate(-50%, -50%);
		background-color: var(--background-color, #f2eee2);
		color: inherit;
		padding: 1rem;
		border-radius: 1em;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-width: 250px;
	}
	h2 {
		color: inherit;
		margin: 0;
		border-bottom: 2px solid currentColor;
	}
	.settings-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.switch {
		position: relative;
		display: inline-flex;
		align-items: center;
		cursor: pointer;
	}
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}
	.slider {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
		background-color: #ddd;
		transition: 0.4s;
		border-radius: 34px;
		margin-right: 10px;
	}
	.slider:before {
		position: absolute;
		content: '';
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		transition: 0.4s;
		border-radius: 50%;
	}
	input:checked + .slider {
		background-color: #62fec2;
	}
	input:checked + .slider:before {
		transform: translateX(26px);
	}
	button {
		color: inherit;
		width: 100%;
	}

	:global(body.dark-mode) .settings-modal {
		background-color: #1d3040;
		color: #bfc2c7;
	}
</style>
