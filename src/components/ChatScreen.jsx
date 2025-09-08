import { useEffect } from "react";
import AllUsers from "./AllUsers";
import ChatSection from "./ChatSection";
import { useSelector } from "react-redux";
import socket from "../socket.js";
import { useLocation } from "react-router-dom";
import { useToast } from "../hooks/useToast.jsx";

const ChatScreen = () => {
  const { userData } = useSelector((state) => state.auth);
  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    showToast({ message: location.state.toastMessage, type: "success" });
    if ("Notification" in Window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

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
