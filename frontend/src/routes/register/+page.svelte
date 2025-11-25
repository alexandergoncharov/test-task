<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import type { ApiError } from '$lib/services/api';

	let email = '';
	let username = '';
	let password = '';
	let confirmPassword = '';
	let error = '';
	let loading = false;

	function validateForm(): string | null {
		if (!email || !username || !password || !confirmPassword) {
			return 'All fields are required';
		}

		if (password.length < 6) {
			return 'Password must be at least 6 characters long';
		}

		if (password !== confirmPassword) {
			return 'Passwords do not match';
		}

		if (username.length < 3) {
			return 'Username must be at least 3 characters long';
		}

		if (!/^[a-zA-Z0-9_]+$/.test(username)) {
			return 'Username can only contain letters, numbers and underscores';
		}

		return null;
	}

	async function handleSubmit() {
		error = '';
		const validationError = validateForm();

		if (validationError) {
			error = validationError;
			return;
		}

		loading = true;

		try {
			await auth.register(email, username, password);
			goto('/conversations');
		} catch (err) {
			const apiError = err as ApiError;
			error = apiError.message || 'Registration failed. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Register - Chat App</title>
</svelte:head>

<div class="container">
	<div class="card">
		<h1>Register</h1>

		{#if error}
			<div class="error">{error}</div>
		{/if}

		<form on:submit|preventDefault={handleSubmit}>
			<div class="form-group">
				<label for="email">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					disabled={loading}
				/>
			</div>

			<div class="form-group">
				<label for="username">Username</label>
				<input
					id="username"
					type="text"
					bind:value={username}
					required
					disabled={loading}
					minlength="3"
					maxlength="20"
					pattern="[a-zA-Z0-9_]+"
				/>
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					disabled={loading}
					minlength="6"
				/>
			</div>

			<div class="form-group">
				<label for="confirmPassword">Confirm Password</label>
				<input
					id="confirmPassword"
					type="password"
					bind:value={confirmPassword}
					required
					disabled={loading}
					minlength="6"
				/>
			</div>

			<button type="submit" disabled={loading}>
				{loading ? 'Registering...' : 'Register'}
			</button>
		</form>

		<p class="link-text">
			Already have an account? <a href="/login">Login here</a>
		</p>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 1rem;
	}

	.card {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		padding: 2rem;
		width: 100%;
		max-width: 400px;
	}

	h1 {
		margin: 0 0 1.5rem 0;
		text-align: center;
		color: #213547;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: #213547;
		font-weight: 500;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #646cff;
	}

	input:disabled {
		background-color: #f5f5f5;
		cursor: not-allowed;
	}

	button {
		width: 100%;
		padding: 0.75rem;
		background-color: #646cff;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		margin-top: 1rem;
	}

	button:hover:not(:disabled) {
		background-color: #535bf2;
	}

	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.error {
		background-color: #fee;
		color: #c33;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.link-text {
		text-align: center;
		margin-top: 1.5rem;
		color: #666;
	}

	.link-text a {
		color: #646cff;
		text-decoration: none;
	}

	.link-text a:hover {
		text-decoration: underline;
	}
</style>

