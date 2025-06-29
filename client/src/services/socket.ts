import { io, Socket } from "socket.io-client";

const userId = localStorage.getItem("userId"); 

const socket: Socket = io("http://localhost:5000", {
  query: { userId }, 
  transports: ["websocket"], 
});

export default socket;
