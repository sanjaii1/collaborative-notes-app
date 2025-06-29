import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// Call this function after login, with the userId
export function connectSocket(userId: string): Socket {
  if (!socket) {
    socket = io("http://localhost:5000", {
      query: { userId },
      transports: ["websocket"],
    });
  }
  return socket;
}

// Use this to get the socket anywhere else
export function getSocket(): Socket | null {
  return socket;
}