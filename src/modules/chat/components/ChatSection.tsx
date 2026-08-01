import { useAppDispatch, useAppSelector } from "@redux/hooks";
import InputSection from "./InputSection";
import MsgCard from "./MsgCard";
import { useEffect, useState } from "react";
import {
  getChatHistory,
  incrementUnread,
  setSelectedUser,
  type TChatMessage,
} from "@modules/chat/redux/chatSlice";
import socket from "@services/socket";
import { AnimatePresence, motion, type Variants } from "motion/react";
import ChatShimmerBox from "./ChatShimmerBox";

const ChatSection = () => {
  const { userData } = useAppSelector((state) => state.auth);
  const { selectedUser, allUsers, isChatLoading } = useAppSelector(
    (state) => state.chat,
  );
  const dispatch = useAppDispatch();

  const [chats, setChats] = useState<TChatMessage[]>([]);
  const [typingUser, setTypingUser] = useState(null);

  const dotVariants: Variants = {
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
    if (selectedUser && userData?.id) {
      dispatch(
        getChatHistory({
          fromUserId: userData.id,
          toUserId: selectedUser.id,
        }),
      )
        .unwrap()
        .then((payload) => {
          if (payload.chats) {
            setChats(payload.chats); // initialize local chats with history
          }
        });
    }
  }, [userData, selectedUser]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      const isCurrentChat =
        (data.sender === selectedUser?.id && data.receiver === userData?.id) ||
        (data.receiver === selectedUser?.id && data.sender === userData?.id);

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
            },
          );

          notification.onclick = () => {
            window.focus();
            const senderUser = allUsers.find((u) => u.id === data.sender);
            if (senderUser) {
              dispatch(setSelectedUser(senderUser));
            }
          };
        }
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedUser, userData?.id, dispatch, allUsers]);

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
  const handleSendMessage = (message: string) => {
    if (!message.trim() || !selectedUser) return;

    const payload = {
      fromUserId: userData?.id,
      toUserId: selectedUser?.id,
      message,
      timestamp: new Date().toISOString(),
      senderName: userData?.name,
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
            {chats?.map((chat, idx) => {
              return <MsgCard key={chat.timestamp} chat={chat} />;
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
                    {allUsers.find((u) => u.id === typingUser)?.name ||
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
                      key={n}
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
