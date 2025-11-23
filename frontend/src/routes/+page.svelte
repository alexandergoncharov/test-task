<script lang="ts">
	import { onMount } from 'svelte';
</script>

<svelte:head>
	<title>Real-time Chat Application</title>
</svelte:head>

<div class="container">
	<h1>Real-time Chat Application</h1>
	<p>Welcome to the chat application</p>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	p {
		font-size: 1.2rem;
		color: #666;
	}
</style>

