import { useEffect } from "react";
import AllUsers from "./AllUsers";
import ChatSection from "./ChatSection";
import { useAppSelector } from "../redux/hooks";
import socket from "../socket";

const ChatScreen = () => {
  const { userData } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if ("Notification" in Window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  useEffect(() => {
    if (userData?._id) {
      socket.emit("join", userData._id); // ✅ user joins their room
    }
  }, [userData?._id]);

  return (
    <div className="chat-screen-container">
      <AllUsers />
      <ChatSection />
    </div>
  );
};

export default ChatScreen;
