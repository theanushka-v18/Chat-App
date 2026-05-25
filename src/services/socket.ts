import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";

const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io("https://chat-app-backend-u15o.onrender.com", {
// const socket = io("http://localhost:3000", {
  withCredentials: true,
});

export default socket;
  