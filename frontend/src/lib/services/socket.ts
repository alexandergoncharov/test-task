import { io, Socket } from 'socket.io-client';
import type { Message } from '../stores/messages';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export function connectSocket(token: string): Promise<Socket> {
	// If socket exists and is connected, check if we need to reconnect with new token
	if (socket?.connected) {
		// If token changed, disconnect and reconnect
		const currentToken = (socket as any).auth?.token;
		if (currentToken !== token) {
			socket.disconnect();
			socket = null;
		} else {
			return new Promise((resolve, reject) => {
				socket!.once('authenticated', () => {
					resolve(socket!);
				});
			});
		}
	}

	return new Promise((resolve, reject) => {
		socket = io(SOCKET_URL, {
			auth: {
				token
			},
			transports: ['websocket', 'polling'],
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5
		});

		let authenticated = false;
		let timeoutId: NodeJS.Timeout;

		const cleanup = () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};

		// Subscribe to authenticated event BEFORE connection
		socket.on('authenticated', () => {
			authenticated = true;
			cleanup();
			resolve(socket!);
		});

		socket.on('disconnect', () => {
			authenticated = false;
			cleanup();
		});

		socket.on('connect_error', (error) => {
			cleanup();
			reject(error);
		});

		// Timeout if authentication doesn't happen
		// Give backend time to process handleConnection (which is async)
		timeoutId = setTimeout(() => {
			if (!authenticated && socket) {
				// If socket is connected but we didn't get authenticated event,
				// it might have been sent before we subscribed
				// Try to proceed anyway after a short delay
				if (socket.connected) {
					setTimeout(() => {
						cleanup();
						resolve(socket!);
					}, 500);
				} else {
					cleanup();
					reject(new Error('Authentication timeout'));
				}
			}
		}, 10000);
	});
}

export function disconnectSocket() {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
}

export function joinConversation(conversationId: string): Promise<void> {
	return new Promise((resolve, reject) => {
		if (!socket || !socket.connected) {
			reject(new Error('Socket not connected'));
			return;
		}

		socket.emit('joinConversation', conversationId, (response: any) => {
			if (response.error) {
				reject(new Error(response.error));
			} else {
				resolve();
			}
		});
	});
}

export function leaveConversation(conversationId: string): void {
	if (!socket || !socket.connected) {
		return;
	}

	socket.emit('leaveConversation', conversationId);
}

export function onNewMessage(callback: (message: Message) => void): () => void {
	if (!socket) {
		return () => {};
	}

	socket.on('message:new', (message: any) => {
		// Ensure createdAt is a string
		const formattedMessage: Message = {
			...message,
			createdAt: typeof message.createdAt === 'string' 
				? message.createdAt 
				: new Date(message.createdAt).toISOString()
		};
		callback(formattedMessage);
	});

	return () => {
		if (socket) {
			socket.off('message:new');
		}
	};
}

export function getSocket(): Socket | null {
	return socket;
}

