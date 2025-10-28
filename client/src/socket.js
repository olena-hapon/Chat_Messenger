import { io } from "socket.io-client";

const socket = io("https://chat-messenger-yiim.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
