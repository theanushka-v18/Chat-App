import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  getAllUsers,
  setSelectedUser,
  setPresence,
  updateUserPresence,
  resetChatState,
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

  // Connect socket when authenticated user is ready
  useEffect(() => {
    if (!userData?.id) return;

    const handleConnect = () => {
      // Server handles identity; ensure auth token is up to date on reconnect
      socket.auth = { token: localStorage.getItem("accessToken") };
    };

    const handleInitialPresence = (data: { online: string[] }) => {
      dispatch(setPresence({ onlineUserIds: data.online || [] }));
    };

    const handleOnline = (data: { userId: string }) => {
      if (data?.userId) {
        dispatch(updateUserPresence({ userId: data.userId, isOnline: true }));
      }
    };

    const handleOffline = (data: { userId: string; lastSeen?: string }) => {
      if (data?.userId) {
        dispatch(
          updateUserPresence({
            userId: data.userId,
            isOnline: false,
            ...(data.lastSeen ? { lastSeen: data.lastSeen } : {}),
          }),
        );
      }
    };

    // Register listeners BEFORE connecting so we never miss presence:initial.
    socket.on("connect", handleConnect);
    socket.on("presence:initial", handleInitialPresence);
    socket.on("presence:online", handleOnline);
    socket.on("presence:offline", handleOffline);

    // Update auth token before connecting in case it changed
    socket.auth = { token: localStorage.getItem("accessToken") };
    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("presence:initial", handleInitialPresence);
      socket.off("presence:online", handleOnline);
      socket.off("presence:offline", handleOffline);
      socket.disconnect();
    };
  }, [userData?.id, dispatch]);

  const handleSelectUser = (user: TUserData) => {
    dispatch(setSelectedUser(user as any));
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
