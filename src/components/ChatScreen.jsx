import { useEffect } from "react";
import AllUsers from "./AllUsers";
import ChatSection from "./ChatSection";
import { useSelector } from "react-redux";
import socket from "../socket.js";

const ChatScreen = () => {
  const { userData } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (userData.id) {
      socket.emit("join", userData.id); // ✅ user joins their room
    }
  }, [userData.id]);

  return (
    <div className="chat-screen-container">
      <AllUsers />
      <ChatSection />
    </div>
  );
};

export default ChatScreen;
