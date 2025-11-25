const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiError {
	message: string;
	statusCode?: number;
}

export async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const token = localStorage.getItem('token');
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...options.headers,
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const response = await fetch(`${API_URL}${endpoint}`, {
		...options,
		headers,
	});

	if (!response.ok) {
		const error: ApiError = {
			message: 'An error occurred',
			statusCode: response.status,
		};

		try {
			const data = await response.json();
			error.message = data.message || error.message;
		} catch {
			// If response is not JSON, use status text
			error.message = response.statusText || error.message;
		}

		throw error;
	}

	return response.json();
}

