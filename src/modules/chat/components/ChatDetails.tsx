import {
  ActionIcon,
  Badge,
  Box,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import type { ReactNode } from "react";
import {
  LuClock,
  LuMail,
  LuMessagesSquare,
  LuUser,
  LuX,
} from "react-icons/lu";
import type { TChatMessage } from "@modules/chat/redux/chatSlice";
import type { TUserData } from "@modules/auth/redux/authSlice";
import UserAvatar from "@components/UserAvatar";
import { formatDayLabel, formatRelative, formatTime } from "@utils/format";

interface IChatDetailsProps {
  selectedUser: TUserData | null;
  chats: TChatMessage[];
  unreadCounts: Record<string, number>;
  /** Rendered as a close button when the pane is shown inside a drawer */
  onClose?: () => void;
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <Group gap="sm" wrap="nowrap" align="flex-start">
    <Box c="dimmed" mt={2} style={{ flexShrink: 0 }}>
      {icon}
    </Box>
    <Box style={{ minWidth: 0 }}>
      <Text fz="xs" c="dimmed" lh={1.3}>
        {label}
      </Text>
      <Text fz="sm" fw={500} lh={1.4} style={{ overflowWrap: "anywhere" }}>
        {value}
      </Text>
    </Box>
  </Group>
);

/**
 * Right hand information pane: who you are talking to plus a transcript
 * summary of the active conversation. Only rendered on wide screens.
 */
const ChatDetails = ({
  selectedUser,
  chats,
  unreadCounts,
  onClose,
}: IChatDetailsProps) => {
  const lastMessage = chats[chats.length - 1];
  const unread = selectedUser ? (unreadCounts[selectedUser.id] ?? 0) : 0;
  const recentMessages = chats.slice(-6).reverse();

  return (
    <Stack h="100%" gap={0}>
      <Box
        px="md"
        py="md"
        style={{
          flexShrink: 0,
          borderBottom: "1px solid var(--app-border)",
        }}
      >
        <Group justify="space-between" gap="xs" wrap="nowrap">
          <Text fw={700} fz="lg" lh={1.2}>
            Details
          </Text>
          <Group gap="xs" wrap="nowrap">
            <Badge variant="light" color="gray" size="sm">
              Live
            </Badge>
            {onClose && (
              <ActionIcon
                variant="subtle"
                color="gray"
                aria-label="Close details"
                onClick={onClose}
              >
                <LuX size={18} />
              </ActionIcon>
            )}
          </Group>
        </Group>
      </Box>

      <ScrollArea style={{ flex: 1, minHeight: 0 }} type="hover">
        <Stack gap="lg" px="md" pb="lg">
          <Stack gap="xs" align="center" ta="center">
            <UserAvatar name={selectedUser?.name ?? "User"} size={84} />
            <Text fw={700} fz="lg" lineClamp={1} w="100%">
              {selectedUser?.name ?? "No conversation"}
            </Text>
            <Text fz="sm" c="dimmed" lineClamp={1} w="100%">
              {selectedUser?.email}
            </Text>
          </Stack>

          <Divider />

          <Stack gap="md">
            <InfoRow
              icon={<LuUser size={18} />}
              label="Name"
              value={selectedUser?.name ?? "—"}
            />
            <InfoRow
              icon={<LuMail size={18} />}
              label="Email"
              value={selectedUser?.email ?? "—"}
            />
            <InfoRow
              icon={<LuMessagesSquare size={18} />}
              label="Messages in this chat"
              value={chats.length > 0 ? String(chats.length) : "None yet"}
            />
            <InfoRow
              icon={<LuClock size={18} />}
              label="Last activity"
              value={lastMessage ? formatRelative(lastMessage.timestamp) : "—"}
            />
          </Stack>

          {unread > 0 && (
            <Box
              px="sm"
              py="xs"
              style={{
                borderRadius: "0.75rem",
                backgroundColor: "var(--app-primary-soft)",
              }}
            >
              <Text fz="xs" fw={600} c="var(--app-primary)">
                {unread} unread {unread === 1 ? "message" : "messages"}
              </Text>
            </Box>
          )}

          <Divider />

          <Stack gap="sm">
            <Text fw={600} fz="sm">
              Recent messages
            </Text>

            {recentMessages.length === 0 ? (
              <Text fz="xs" c="dimmed" lh={1.5}>
                Messages from this conversation will be summarised here.
              </Text>
            ) : (
              recentMessages.map((message, index) => (
                <Box key={`${message.timestamp}-${index}`}>
                  <Text fz="sm" lh={1.45} lineClamp={3}>
                    {message.message}
                  </Text>
                  <Text fz="xs" c="dimmed" mt={2}>
                    {formatDayLabel(message.timestamp)} ·{" "}
                    {formatTime(message.timestamp)}
                  </Text>
                </Box>
              ))
            )}
          </Stack>
        </Stack>
      </ScrollArea>
    </Stack>
  );
};

export default ChatDetails;
