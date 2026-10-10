import { Box, Group, Paper, Text } from "@mantine/core";
import type { TChatMessage } from "@modules/chat/redux/chatSlice";
import UserAvatar from "@components/UserAvatar";
import { formatTime } from "@utils/format";

interface IMsgCardProps {
  msg: TChatMessage;
  isOwn: boolean;
  showAvatar: boolean;
  senderName: string;
}

/**
 * One chat bubble. Avatar only renders on the last message of a run so
 * consecutive messages from the same person stay visually grouped.
 */
const MsgCard = ({ msg, isOwn, showAvatar, senderName }: IMsgCardProps) => (
  <Group
    align="flex-end"
    gap="xs"
    justify={isOwn ? "flex-end" : "flex-start"}
    wrap="nowrap"
    style={{ minWidth: 0 }}
  >
    {!isOwn && (
      <Box w={28} style={{ flexShrink: 0 }}>
        {showAvatar && <UserAvatar name={senderName} size={28} />}
      </Box>
    )}

    <Box style={{ maxWidth: "min(78%, 560px)", minWidth: 0 }}>
      <Paper
        radius="lg"
        px="sm"
        py={7}
        style={{
          background: isOwn
            ? "var(--app-bubble-me)"
            : "var(--app-bubble-them)",
          color: isOwn
            ? "var(--app-bubble-me-text)"
            : "var(--app-bubble-them-text)",
          borderRadius: isOwn
            ? "1rem 1rem 0.25rem 1rem"
            : "1rem 1rem 1rem 0.25rem",
          border: isOwn
            ? "none"
            : "1px solid var(--app-border)",
          boxShadow: "var(--app-shadow-xs)",
          overflowWrap: "anywhere",
        }}
      >
        <Text fz="0.925rem" lh={1.45} style={{ whiteSpace: "pre-wrap" }}>
          {msg.message}
        </Text>
        <Text
          fz="0.68rem"
          mt={2}
          ta="right"
          c={isOwn ? "rgba(255,255,255,0.75)" : "var(--app-text-subtle)"}
        >
          {formatTime(msg.timestamp)}
        </Text>
      </Paper>
    </Box>
  </Group>
);

export default MsgCard;
