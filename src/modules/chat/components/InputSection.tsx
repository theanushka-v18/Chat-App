import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useSelector } from "react-redux";
import socket from "@services/socket";
import type { RootState } from "@redux/store";
import type { TChatMessage } from "@modules/chat/redux/chatSlice";

const InputSection = ({
  onSendMessage,
  setChats,
}: {
  onSendMessage: (message: string) => void;
  setChats: React.Dispatch<React.SetStateAction<TChatMessage[]>>;
}) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  let typingTimeout: number | undefined;
  const { selectedUser } = useSelector((state: RootState) => state.chat);
  const { userData } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setMessage("");
    setChats([]);
  }, [selectedUser]);

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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
          }
        }}
        onChange={(e) => {
          setMessage(e.target.value);
          if (!isTyping) {
            setIsTyping(true);
            socket.emit("typing", {
              senderId: userData?.id,
              receiverId: selectedUser?.id,
            });
          }

          clearTimeout(typingTimeout);

          typingTimeout = setTimeout(() => {
            setIsTyping(false);
            socket.emit("stop_typing", {
              senderId: userData?.id,
              receiverId: selectedUser?.id,
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
