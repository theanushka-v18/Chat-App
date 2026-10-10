import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  getAllUsers,
  setSelectedUser,
  type TChatMessage,
} from "@modules/chat/redux/chatSlice";
import type { TUserData } from "@modules/auth/redux/authSlice";
import AllUsers from "@modules/chat/components/AllUsers";
import ChatSection from "@modules/chat/components/ChatSection";
import { BackgroundImage, Box, Drawer, Flex } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import bgImg from "@assets/bg-img.jpg";
import socket from "@services/socket";

/**
 * Two pane layout on wide screens:
 *   1. conversations list  (md and up, drawer below)
 *   2. active conversation  (always visible)
 */
const ChatScreen = () => {
  const dispatch = useAppDispatch();
  const { selectedUser, unreadCounts } = useAppSelector((state) => state.chat);
  const { userData } = useAppSelector((state) => state.auth);
  const [chats, setChats] = useState<TChatMessage[]>([]);
  const [isUserListOpen, setIsUserListOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 61.99em)", undefined, {
    getInitialValueInEffect: false,
  });

  // Load the list of people once the signed-in user is known.
  useEffect(() => {
    if (!userData?.id) return;
    dispatch(getAllUsers({ name: userData.name }));
  }, [dispatch, userData?.id, userData?.name]);

  // Join our room so io.to(userId).emit(...) actually reaches this socket.
  // Re-run on reconnect: rooms are server-side and die with the connection.
  useEffect(() => {
    if (!userData?.id) return;

    const join = () => socket.emit("join", userData.id);
    if (socket.connected) join();
    socket.on("connect", join);

    return () => {
      socket.off("connect", join);
    };
  }, [userData?.id]);

  const handleSelectUser = (user: TUserData) => {
    dispatch(setSelectedUser(user));
    setIsUserListOpen(false);
  };

  return (
    <Box h="100%" pos="relative" style={{ overflow: "hidden" }}>
      <BackgroundImage
        src={bgImg}
        style={{ position: "absolute", inset: 0, opacity: 0.32 }}
      />

      <Flex h="100%" gap={0} wrap="nowrap" style={{ position: "relative" }}>
        <Box
          visibleFrom="md"
          w={{ md: 300, lg: 320 }}
          h="100%"
          style={{
            flexShrink: 0,
            backgroundColor: "var(--app-surface)",
            borderRight: "1px solid var(--app-border)",
          }}
        >
          <AllUsers
            unreadCounts={unreadCounts}
            selectedUser={selectedUser}
            onSelectUser={handleSelectUser}
          />
        </Box>

        <Box h="100%" style={{ flex: 1, minWidth: 0 }}>
          <ChatSection
            onOpenUserList={() => setIsUserListOpen(true)}
            chats={chats}
            setChats={setChats}
          />
        </Box>
      </Flex>

      {/* Conversations list on phones and tablets */}
      <Drawer
        opened={isUserListOpen && isMobile}
        onClose={() => setIsUserListOpen(false)}
        size="min(88vw, 340px)"
        padding={0}
        withCloseButton={false}
        overlayProps={{ backgroundOpacity: 0.4, blur: 3 }}
        styles={{
          body: {
            height: "100dvh",
            display: "flex",
            flexDirection: "column",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          },
          content: { backgroundColor: "var(--app-surface)" },
        }}
      >
        <AllUsers
          unreadCounts={unreadCounts}
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
          onClose={() => setIsUserListOpen(false)}
        />
      </Drawer>
    </Box>
  );
};

export default ChatScreen;
