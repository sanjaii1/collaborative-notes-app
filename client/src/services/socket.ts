import { io, Socket } from "socket.io-client";

const userId = localStorage.getItem("userId"); // or get from auth store

const socket: Socket = io("http://localhost:5000", {
  query: { userId }, // ✅ This enables room joining on backend
  transports: ["websocket"], // ✅ Optional: Force websocket
});

export default socket;
