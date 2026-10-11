import { useAppDispatch, useAppSelector } from "@redux/hooks";
import InputSection from "./InputSection";
import MsgCard from "./MsgCard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  getChatHistory,
  incrementUnread,
  setSelectedUser,
  type TChatMessage,
} from "@modules/chat/redux/chatSlice";
import socket from "@services/socket";
import { AnimatePresence, motion, type Variants } from "motion/react";
import ChatShimmerBox from "./ChatShimmerBox";
import { LuArrowDown, LuList, LuMessageCircle } from "react-icons/lu";
import {
  ActionIcon,
  Box,
  Center,
  Flex,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import UserAvatar from "@components/UserAvatar";
import { dayKey, formatDayLabel, formatLastSeen } from "@utils/format";

type ChatSectionProps = {
  onOpenUserList: () => void;
  chats: TChatMessage[];
  setChats: Dispatch<SetStateAction<TChatMessage[]>>;
};

type ChatItem =
  | { type: "divider"; key: string; label: string }
  | { type: "message"; key: string; msg: TChatMessage };

const BOTTOM_THRESHOLD = 140;

const dotVariants: Variants = {
  animate: {
    scale: [0.6, 1, 0.6],
    opacity: [0.3, 1, 0.3],
    transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
  },
};

const ChatSection = ({
  onOpenUserList,
  chats,
  setChats,
}: ChatSectionProps) => {
  const { userData } = useAppSelector((state) => state.auth);
  const { selectedUser, allUsers, isChatLoading } = useAppSelector(
    (state) => state.chat,
  );
  const dispatch = useAppDispatch();

  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isNearBottomRef = useRef(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTo({ top: viewport.scrollHeight, behavior });
    isNearBottomRef.current = true;
    setShowScrollButton(false);
  }, []);

  const handleScroll = useCallback(({ y }: { x: number; y: number }) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const distanceFromBottom = viewport.scrollHeight - y - viewport.clientHeight;
    const isNearBottom = distanceFromBottom <= BOTTOM_THRESHOLD;
    isNearBottomRef.current = isNearBottom;
    setShowScrollButton(!isNearBottom);
  }, []);

  // Load history whenever the active conversation changes.
  useEffect(() => {
    if (!selectedUser || !userData?.id) return;

    let isActive = true;
    setChats([]);
    isNearBottomRef.current = true;
    dispatch(
      getChatHistory({ fromUserId: userData.id, toUserId: selectedUser.id }),
    )
      .unwrap()
      .then((payload) => {
        if (!isActive) return;
        setChats(payload.chats ?? []);
        isNearBottomRef.current = true;
        requestAnimationFrame(() => scrollToBottom("auto"));
      });

    return () => {
      isActive = false;
    };
  }, [userData?.id, selectedUser, dispatch, setChats, scrollToBottom]);

  // Incoming messages (chat + unread counter + desktop notification).
  useEffect(() => {
    socket.on("receive_message", (data) => {
      const isCurrentChat =
        (data.sender === selectedUser?.id && data.receiver === userData?.id) ||
        (data.receiver === selectedUser?.id && data.sender === userData?.id) ||
        (data.sender === userData?.id && data.receiver === selectedUser?.id);

      if (isCurrentChat) {
        setChats((prev) => [...prev, data]);
      } else {
        if (data.sender && data.sender !== userData?.id) {
          dispatch(incrementUnread(data.sender));
        }

        if (Notification.permission === "granted") {
          const notification = new Notification(
            data.senderName || "New Message",
            { body: data.message },
          );

          notification.onclick = () => {
            window.focus();
            const senderUser = allUsers.find((u) => u.id === data.sender);
            if (senderUser) dispatch(setSelectedUser(senderUser));
          };
        }
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedUser, userData?.id, dispatch, allUsers, setChats]);

  // Typing indicator (registered once, uses a ref for the current state).
  const typingRef = useRef<string | null>(null);
  useEffect(() => {
    socket.on("typing", ({ senderId }) => {
      typingRef.current = senderId;
      setTypingUser(senderId);
    });

    socket.on("stop_typing", ({ senderId }) => {
      if (typingRef.current === senderId) {
        typingRef.current = null;
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, []);

  // Keep the newest message in view unless the reader scrolled up.
  useEffect(() => {
    if (isNearBottomRef.current) {
      requestAnimationFrame(() => scrollToBottom("smooth"));
    }
  }, [chats.length, typingUser, scrollToBottom]);

  const chatItems = useMemo<ChatItem[]>(() => {
    const items: ChatItem[] = [];
    let previousDay = "";

    chats.forEach((msg, index) => {
      const key = dayKey(msg.timestamp);
      if (key !== previousDay) {
        previousDay = key;
        items.push({
          type: "divider",
          key: `divider-${key}-${index}`,
          label: formatDayLabel(msg.timestamp),
        });
      }
      items.push({
        type: "message",
        key: `msg-${msg.timestamp ?? index}-${index}`,
        msg,
      });
    });

    return items;
  }, [chats]);

  const typingName = typingUser
    ? allUsers.find((user) => user.id === typingUser)?.name
    : undefined;

  const handleSendMessage = (message: string) => {
    if (!message.trim() || !selectedUser || !userData?.id) return;

    const payload = {
      fromUserId: userData.id,
      toUserId: selectedUser.id,
      message,
      timestamp: new Date().toISOString(),
      senderName: userData.name,
    };

    socket.emit("send_message", payload);

    // Optimistic echo, tagged so it renders as our own message.
    setChats((prev) => [
      ...prev,
      { ...payload, sender: userData.id, receiver: selectedUser.id },
    ]);
  };

  return (
    <Flex direction="column" h="100%" w="100%" style={{ minWidth: 0 }}>
      <Group
        component="header"
        justify="space-between"
        wrap="nowrap"
        gap="sm"
        px={{ base: "xs", sm: "md" }}
        py="sm"
        style={{
          flexShrink: 0,
          borderBottom: "1px solid var(--app-border)",
          backgroundColor: "var(--app-surface-glass)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
          <Box hiddenFrom="md" style={{ flexShrink: 0 }}>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              aria-label="Open chats list"
              onClick={onOpenUserList}
            >
              <LuList size={20} />
            </ActionIcon>
          </Box>

           {selectedUser ? (
             <UserAvatar
               name={selectedUser.name}
               src={selectedUser.profileImage?.url ?? null}
               size={38}
               online={(selectedUser as any).isOnline}
             />
           ) : (
            <ThemeIcon size={38} radius="xl" variant="light">
              <LuMessageCircle size={20} />
            </ThemeIcon>
          )}

          <Box style={{ minWidth: 0 }}>
            <Text fw={700} fz="0.95rem" lineClamp={1}>
              {selectedUser?.name ?? "Orbither"}
            </Text>
            <Text
              fz="xs"
              c={(selectedUser as any)?.isOnline ? "teal" : "dimmed"}
              lineClamp={1}
            >
              {typingName
                ? `${typingName} is typing…`
                : !selectedUser
                  ? "Pick a conversation to start"
                  : (selectedUser as any).isOnline
                    ? "Online"
                    : formatLastSeen((selectedUser as any).lastSeen) ||
                      selectedUser.email}
            </Text>
          </Box>
        </Group>
      </Group>

      <Box style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <ScrollArea
          style={{ height: "100%" }}
          type="hover"
          scrollbarSize={6}
          viewportRef={viewportRef}
          onScrollPositionChange={handleScroll}
        >
          <Stack
            gap={6}
            p={{ base: "xs", sm: "md" }}
            pb="lg"
            mih="100%"
            justify={chats.length > 0 ? "flex-end" : "center"}
          >
            {!selectedUser ? (
              <Center py="xl" px="sm">
                <Stack gap="sm" align="center" ta="center">
                  <ThemeIcon size={64} radius="xl" variant="light">
                    <LuMessageCircle size={30} />
                  </ThemeIcon>
                  <Text fw={700} fz={{ base: "1rem", sm: "1.15rem" }}>
                    Your conversations live here
                  </Text>
                  <Text fz="sm" c="dimmed" maw={380} lh={1.5}>
                    {allUsers.length > 0
                      ? "Choose someone from the chats list to start messaging in real time."
                      : "No one else has signed up yet. Come back once a friend joins."}
                  </Text>
                </Stack>
              </Center>
            ) : isChatLoading ? (
              <Stack gap="md" align="stretch">
                {[1, 2, 3, 4].map((row) => (
                  <Stack
                    key={row}
                    gap={6}
                    align={row % 2 === 0 ? "flex-start" : "flex-end"}
                  >
                    <ChatShimmerBox width="45%" height={14} />
                    <ChatShimmerBox width={row % 2 === 0 ? "70%" : "82%"} height={34} />
                  </Stack>
                ))}
              </Stack>
            ) : chatItems.length > 0 ? (
              <>
                {chatItems.map((item, index) => {
                  if (item.type === "divider") {
                    return (
                      <Group key={item.key} justify="center" my={6}>
                        <Paper
                          radius="xl"
                          px="sm"
                          py={3}
                          style={{
                            backgroundColor: "var(--app-surface)",
                            border: "1px solid var(--app-border)",
                          }}
                        >
                          <Text fz="0.7rem" fw={600} c="dimmed" tt="uppercase">
                            {item.label}
                          </Text>
                        </Paper>
                      </Group>
                    );
                  }

                  const nextItem = chatItems[index + 1];
                  const isOwn = item.msg.sender === userData?.id;
                  const isLastOfRun =
                    !nextItem ||
                    nextItem.type !== "message" ||
                    nextItem.msg.sender !== item.msg.sender;

                  return (
                    <MsgCard
                      key={item.key}
                      msg={item.msg}
                      isOwn={isOwn}
                      showAvatar={isLastOfRun}
                      senderName={selectedUser?.name ?? "User"}
                    />
                  );
                })}

                <AnimatePresence>
                  {typingUser && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.25 }}
                      style={{ paddingLeft: 36 }}
                    >
                      <Paper
                        radius="lg"
                        px="sm"
                        py={6}
                        style={{
                          width: "fit-content",
                          backgroundColor: "var(--app-bubble-them)",
                          border: "1px solid var(--app-border)",
                          borderRadius: "1rem 1rem 1rem 0.25rem",
                          boxShadow: "var(--app-shadow-xs)",
                        }}
                      >
                        <Group gap={5} wrap="nowrap">
                          {[0, 1, 2].map((dot) => (
                            <motion.span
                              key={dot}
                              variants={dotVariants}
                              animate="animate"
                              transition={{ delay: dot * 0.15 }}
                              style={{
                                width: 7,
                                height: 7,
                                flexShrink: 0,
                                borderRadius: "50%",
                                backgroundColor: "var(--app-text-subtle)",
                              }}
                            />
                          ))}
                          <Text fz="xs" c="dimmed" ml={4}>
                            {typingName || "Someone"} is typing
                          </Text>
                        </Group>
                      </Paper>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Center py="xl" px="sm">
                <Stack gap="xs" align="center" ta="center">
                  <ThemeIcon size={56} radius="xl" variant="light" color="grape">
                    <LuMessageCircle size={26} />
                  </ThemeIcon>
                  <Text fw={600} fz="sm">
                    No messages yet
                  </Text>
                  <Text fz="xs" c="dimmed" maw={300} lh={1.5}>
                    Say hello to {selectedUser?.name} — messages are delivered
                    instantly.
                  </Text>
                </Stack>
              </Center>
            )}
          </Stack>
        </ScrollArea>

        <AnimatePresence>
          {showScrollButton && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                right: "max(0.75rem, env(safe-area-inset-right))",
                bottom: "0.75rem",
              }}
            >
              <ActionIcon
                size="lg"
                radius="xl"
                variant="filled"
                color="gray"
                aria-label="Scroll to latest messages"
                onClick={() => scrollToBottom("smooth")}
                style={{
                  backgroundColor: "var(--app-surface)",
                  color: "var(--app-text)",
                  border: "1px solid var(--app-border)",
                  boxShadow: "var(--app-shadow-md)",
                }}
              >
                <LuArrowDown size={18} />
              </ActionIcon>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {selectedUser && (
        <Box
          px={{ base: "xs", sm: "md" }}
          py="xs"
          style={{
            flexShrink: 0,
            borderTop: "1px solid var(--app-border)",
            backgroundColor: "var(--app-surface-glass)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
          }}
        >
          <InputSection
            onSendMessage={handleSendMessage}
            recipientId={selectedUser.id}
          />
        </Box>
      )}
    </Flex>
  );
};

export default ChatSection;
