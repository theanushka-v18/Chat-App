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
import { AnimatePresence, motion } from "motion/react";
import { TbLoader } from "react-icons/tb";
import ChatShimmerBox from "./ChatShimmerBox";

const ChatSection = () => {
  const { userData } = useSelector((state) => state.auth);
  const { selectedUser, allUsers, isChatLoading } = useSelector(
    (state) => state.chat
  );
  const dispatch = useDispatch();

  const [chats, setChats] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  const dotVariants = {
    animate: {
      scale: [0.6, 1, 0.6],
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

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

            <AnimatePresence>
              {typingUser && (
                <motion.div
                  className="typing-indicator"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="typing-text">
                    {allUsers.find((u) => u._id === typingUser)?.name ||
                      "Someone"}{" "}
                    is typing
                  </span>
                  <div className="dots">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="dot"
                        variants={dotVariants}
                        animate="animate"
                        transition={{
                          delay: i * 0.2, // stagger effect
                          duration: 0.8,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <>
            {isChatLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {[1, 2, 3, 4].map((n) => {
                  return (
                    <div
                      style={{
                        alignSelf: n % 2 === 0 ? "flex-start" : "flex-end",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: n % 2 === 0 ? "flex-start" : "flex-end",
                        }}
                      >
                        <ChatShimmerBox width="300px" height="30px" />
                      </div>
                      <div>
                        <ChatShimmerBox width="500px" height="30px" />
                      </div>
                    </div>
                  );
                })}
              </div>
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
          </>
        )}
      </div>

      <InputSection onSendMessage={handleSendMessage} setChats={setChats} />
    </div>
  );
};

export default ChatSection;
