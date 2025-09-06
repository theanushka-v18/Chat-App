import { useDispatch, useSelector } from "react-redux";
import InputSection from "./InputSection";
import MsgCard from "./MsgCard";
import { useEffect, useState } from "react";
import { getChatHistory, incrementUnread } from "../redux/slices/chatSlice";
import socket from "../socket";
// import { getChatHistory } from "../redux/slices/chatSlice";

const ChatSection = () => {
  const { userData } = useSelector((state) => state.auth);
  const { selectedUser } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const [chats, setChats] = useState([]);

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
      // Update chat state
      // // ✅ Check if the message is for the currently selected user
      // if (
      //   (data.fromUserId === selectedUser && data.toUserId === userData.id) ||
      //   (data.toUserId === selectedUser && data.fromUserId === userData.id)
      // ) {
      //   setChats((prev) => [...prev, data]);
      // } else {
      //   dispatch(incrementUnread(data.fromUserId));
      // }
    console.log(data, 'data')
      const isCurrentChat =
        (data.sender === selectedUser && data.receiver === userData.id) ||
        (data.receiver === selectedUser && data.sender === userData.id);

      if (isCurrentChat) {
        setChats((prev) => [...prev, data]);
      } else {
        // only increment unread for *other* users
        dispatch(incrementUnread(data.sender));
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedUser, userData.id, dispatch]);

  // Handle sending new message
  const handleSendMessage = (message) => {
    if (!message.trim() || !selectedUser) return;

    const payload = {
      fromUserId: userData.id,
      toUserId: selectedUser,
      message,
      timestamp: new Date().toISOString(),
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
