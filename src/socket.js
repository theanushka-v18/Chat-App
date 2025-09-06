import { io } from "socket.io-client";

const socket = io("https://itchy-pets-own.loca.lt", {
  withCredentials: true,
});

export default socket;
