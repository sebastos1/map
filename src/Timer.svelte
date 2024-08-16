<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';

	export let active = false;
	export let duration = 600;

	let timeLeft = duration;
	let timerInterval: number | undefined;
	let timerStartTime: number;

	const dispatch = createEventDispatcher();

	$: if (active && !timerInterval) {
		startTimer();
	} else if (!active && timerInterval) {
		stopTimer();
	}

	function startTimer() {
		timerStartTime = Date.now();
		timerInterval = window.setInterval(updateTimer, 1000);
	}

	function stopTimer() {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = undefined;
		}
		timeLeft = duration;
	}

	function updateTimer() {
		const elapsedSeconds = Math.floor((Date.now() - timerStartTime) / 1000);
		timeLeft = Math.max(duration - elapsedSeconds, 0);

		if (timeLeft <= 0) {
			stopTimer();
			dispatch('timerComplete');
		}
	}

	onDestroy(() => {
		if (timerInterval) clearInterval(timerInterval);
	});
</script>

<span class="timer">
	{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
</span>

<style>
	.timer {
		font-size: 1.5rem;
		font-weight: bold;
	}
</style>
