import { writable } from 'svelte/store';
import { apiRequest } from '../services/api';

export interface User {
	id: string;
	email: string;
	username: string;
}

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		token: null,
		isAuthenticated: false,
	});

	return {
		subscribe,
		login: async (emailOrUsername: string, password: string) => {
			const response = await apiRequest<{
				accessToken: string;
				user: User;
			}>('/auth/login', {
				method: 'POST',
				body: JSON.stringify({
					emailOrUsername,
					password,
				}),
			});

			localStorage.setItem('token', response.accessToken);
			set({
				user: response.user,
				token: response.accessToken,
				isAuthenticated: true,
			});

			return response;
		},
		register: async (email: string, username: string, password: string) => {
			const response = await apiRequest<User>('/auth/register', {
				method: 'POST',
				body: JSON.stringify({
					email,
					username,
					password,
				}),
			});

			// After registration, automatically login
			const loginResponse = await apiRequest<{
				accessToken: string;
				user: User;
			}>('/auth/login', {
				method: 'POST',
				body: JSON.stringify({
					emailOrUsername: email,
					password,
				}),
			});

			localStorage.setItem('token', loginResponse.accessToken);
			set({
				user: loginResponse.user,
				token: loginResponse.accessToken,
				isAuthenticated: true,
			});

			return loginResponse;
		},
		logout: () => {
			localStorage.removeItem('token');
			set({
				user: null,
				token: null,
				isAuthenticated: false,
			});
		},
		init: () => {
			const token = localStorage.getItem('token');
			if (token) {
				// Try to get user info from token (decode JWT)
				try {
					const payload = JSON.parse(atob(token.split('.')[1]));
					// For now, we'll just set token and mark as authenticated
					// In a real app, you might want to verify token with backend
					set({
						user: {
							id: payload.sub,
							email: payload.email,
							username: payload.username,
						},
						token,
						isAuthenticated: true,
					});
				} catch {
					// Invalid token, remove it
					localStorage.removeItem('token');
				}
			}
		},
	};
}

export const auth = createAuthStore();

