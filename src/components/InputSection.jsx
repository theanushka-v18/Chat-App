import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { useSelector } from "react-redux";
import socket from "../socket.js";

const InputSection = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  let typingTimeout;
  const { selectedUser } = useSelector((state) => state.chat);
  const { userData } = useSelector((state) => state.auth);

  const handleSend = () => {
    if (message.trim() === "") return;

    onSendMessage(message);
    setMessage(""); // clear input
  };

  return (
    <div className="input-section">
      <input
        type="text"
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (!isTyping) {
            setIsTyping(true);
            socket.emit("typing", {
              senderId: userData.id,
              receiverId: selectedUser,
            });
          }

          clearTimeout(typingTimeout);

          typingTimeout = setTimeout(() => {
            setIsTyping(false);
            socket.emit("stop_typing", {
              senderId: userData.id,
              receiverId: selectedUser,
            });
          }, 1000);
        }}
        disabled={!selectedUser}
      />
      <button className="primary-button" onClick={handleSend}>
        <IoSend />
      </button>
    </div>
  );
};

export default InputSection;
