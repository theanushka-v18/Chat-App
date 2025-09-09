import { useDispatch, useSelector } from "react-redux";
import InputSection from "./InputSection";
import MsgCard from "./MsgCard";
import { useEffect, useState } from "react";
import {
  getChatHistory,
  incrementUnread,
  setSelectedUser,
} from "../redux/slices/chatSlice";
import socket from "../socket";

const ChatSection = () => {
  const { userData } = useSelector((state) => state.auth);
  const { selectedUser, allUsers } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const [chats, setChats] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      dispatch(
        getChatHistory({ fromUserId: userData.id, toUserId: selectedUser })
      ).then((res) => {
        if (res?.payload?.chats) {
          setChats(res.payload.chats); // initialize local chats with history
        }
      });
    }
  }, [userData, selectedUser]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      const isCurrentChat =
        (data.sender === selectedUser && data.receiver === userData.id) ||
        (data.receiver === selectedUser && data.sender === userData.id);

      if (isCurrentChat) {
        setChats((prev) => [...prev, data]);
      } else {
        // only increment unread for *other* users
        dispatch(incrementUnread(data.sender));

        if (Notification.permission === "granted") {
          const notification = new Notification(
            data.senderName || "New Message",
            {
              body: data.message,
            }
          );

          notification.onclick = () => {
            window.focus();
            dispatch(setSelectedUser(data.sender));
          };
        }
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedUser, userData.id, dispatch]);

  useEffect(() => {
    socket.on("typing", ({ senderId }) => {
      setTypingUser(senderId);
    });

    socket.on("stop_typing", ({ senderId }) => {
      if (typingUser === senderId) {
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [allUsers, typingUser]);

  // Handle sending new message
  const handleSendMessage = (message) => {
    if (!message.trim() || !selectedUser) return;

    const payload = {
      fromUserId: userData.id,
      toUserId: selectedUser,
      message,
      timestamp: new Date().toISOString(),
      senderName: userData.name,
    };

    // Emit to socket
    socket.emit("send_message", payload);

    // Optimistically update UI
    setChats((prev) => [...prev, payload]);
  };

  return (
    <div className="chat-section">
      <div className="message-area">
        {chats?.length > 0 ? (
          <>
            {chats?.map((chat) => {
              return <MsgCard chat={chat} />;
            })}
            {/* Typing indicator */}
            {typingUser && (
              <p style={{ color: "#757fb2" }}>
                {allUsers.find((u) => u._id === typingUser)?.name || "Someone"}{" "}
                is typing...
              </p>
            )}
          </>
        ) : (
          <h1
            style={{
              color: "#757fb2",
              fontSize: "2.5rem",
              margin: "auto",
            }}
          >
            Chat history not available
          </h1>
        )}
      </div>

      <InputSection onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatSection;
