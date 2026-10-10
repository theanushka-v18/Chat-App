import { Avatar, Box, type AvatarProps } from "@mantine/core";
import { getAvatarColor, getInitials } from "@utils/format";

interface IUserAvatarProps extends Omit<AvatarProps, "children" | "color"> {
  /** Used for initials + deterministic background color */
  name: string;
  /** Overrides the auto picked color */
  avatarColor?: string;
  /** Renders a small presence dot */
  online?: boolean;
}

/**
 * Avatar that renders the user's image when available and falls back to
 * colored initials, so the UI never shows broken/empty circles.
 */
const UserAvatar = ({
  name,
  src,
  avatarColor,
  online = false,
  size = 40,
  ...rest
}: IUserAvatarProps) => {
  const color = avatarColor ?? getAvatarColor(name);
  const numericSize = typeof size === "number" ? size : parseFloat(String(size));
  const dotSize = Number.isFinite(numericSize)
    ? Math.max(8, Math.round(numericSize / 4))
    : 10;

  return (
    <Box pos="relative" style={{ flexShrink: 0 }}>
      <Avatar src={src ?? null} size={size} color={color} {...rest}>
        {getInitials(name)}
      </Avatar>
      {online && (
        <Box
          pos="absolute"
          bottom={0}
          right={0}
          w={dotSize}
          h={dotSize}
          style={{
            borderRadius: "50%",
            backgroundColor: "var(--app-online)",
            border: "2px solid var(--app-surface)",
          }}
        />
      )}
    </Box>
  );
};

export default UserAvatar;
