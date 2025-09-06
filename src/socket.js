import { io } from "socket.io-client";

const socket = io("https://little-papayas-vanish.loca.lt", {
  withCredentials: true,
});

export default socket;
