import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { LuSend } from "react-icons/lu";
import { useSelector } from "react-redux";
import socket from "@services/socket";
import type { RootState } from "@redux/store";
import { ActionIcon, Group, Textarea, Tooltip } from "@mantine/core";

interface IInputSectionProps {
  onSendMessage: (message: string) => void;
  /** Active conversation id, used for the typing socket events */
  recipientId?: string;
}

const InputSection = ({ onSendMessage, recipientId }: IInputSectionProps) => {
  const [message, setMessage] = useState("");
  const isTypingRef = useRef(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { selectedUser } = useSelector((state: RootState) => state.chat);
  const { userData } = useSelector((state: RootState) => state.auth);

  const activeId = recipientId ?? selectedUser?.id;

  // Reset the draft (and typing signal) when the conversation changes.
  useEffect(() => {
    setMessage("");
    isTypingRef.current = false;
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    socket.emit("stop_typing", {
      senderId: userData?.id,
      receiverId: activeId,
    });
  }, [activeId, userData?.id]);

  useEffect(
    () => () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    },
    [],
  );

  const stopTyping = () => {
    isTypingRef.current = false;
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    socket.emit("stop_typing", {
      senderId: userData?.id,
      receiverId: activeId,
    });
  };

  const handleSend = () => {
    if (message.trim() === "") return;
    onSendMessage(message);
    setMessage("");
    stopTyping();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing", {
        senderId: userData?.id,
        receiverId: activeId,
      });
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(stopTyping, 1200);
  };

  return (
    <Group gap="xs" align="flex-end" wrap="nowrap" w="100%">
      <Textarea
        style={{ flex: 1, minWidth: 0 }}
        autosize
        minRows={1}
        maxRows={5}
        aria-label="Message"
        placeholder="Type a message…"
        value={message}
        onChange={(event) => handleTyping(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        disabled={!activeId}
        radius="xl"
        px="md"
        styles={{
          input: {
            backgroundColor: "var(--app-surface)",
            border: "1px solid var(--app-border)",
            paddingTop: 10,
            paddingBottom: 10,
            fontSize: "0.95rem",
          },
        }}
      />
      <Tooltip label="Send (Enter)">
        <ActionIcon
          size={44}
          radius="xl"
          variant="gradient"
          gradient={{ from: "brand.5", to: "violet.5", deg: 135 }}
          aria-label="Send message"
          onClick={handleSend}
          disabled={!activeId || message.trim() === ""}
          style={{ flexShrink: 0, boxShadow: "var(--app-shadow-brand)" }}
        >
          <LuSend size={18} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export default InputSection;
