import { io } from "socket.io-client";

const socket = io("https://quick-loops-build.loca.lt", {
  withCredentials: true,
});

export default socket;
