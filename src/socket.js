import { io } from "socket.io-client";

const socket = io("https://chat-app-backend-u15o.onrender.com", {
  withCredentials: true,
});

export default socket;
