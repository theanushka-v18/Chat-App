import { Skeleton } from "@mantine/core";

type ChatShimmerBoxProps = {
  width?: string | number;
  height?: string | number;
  /** Matches the bubble radius used by MsgCard */
  radius?: string;
};

/** Loading placeholder shaped like a chat bubble. */
const ChatShimmerBox = ({
  width = "100%",
  height = 20,
  radius = "lg",
}: ChatShimmerBoxProps) => (
  <Skeleton
    width={width}
    height={height}
    radius={radius}
    style={{ flexShrink: 0 }}
  />
);

export default ChatShimmerBox;
