import { io } from "socket.io-client";

const socket = io("https://chat-messenger-yiim.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
  secure: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;

