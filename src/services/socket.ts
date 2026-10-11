import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io(SOCKET_URL, {
  withCredentials: true,
  auth: (callback) => {
    const token = localStorage.getItem("accessToken");
    callback({ token: token || null });
  },
  autoConnect: false,
});

export const updateSocketAuthToken = () => {
  const token = localStorage.getItem("accessToken");
  socket.auth = { token: token || null };
};

export const getSocket = () => socket;
export default socket;
