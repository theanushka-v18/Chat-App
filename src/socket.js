import { io } from "socket.io-client";

const socket = io("https://chat-app-backend-u15o.onrender.com", {
// const socket = io("http://localhost:3000", {
  withCredentials: true,
});

export default socket;
