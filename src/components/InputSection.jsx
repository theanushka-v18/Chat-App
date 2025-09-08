import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { useSelector } from "react-redux";

const InputSection = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const { selectedUser } = useSelector((state) => state.chat);

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
        onChange={(e) => setMessage(e.target.value)}
        disabled={!selectedUser}
      />
      <button className="primary-button" onClick={handleSend}>
        <IoSend />
      </button>
    </div>
  );
};

export default InputSection;
