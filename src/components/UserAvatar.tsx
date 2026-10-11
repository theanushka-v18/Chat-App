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
          bottom={-1}
          right={-1}
          w={dotSize}
          h={dotSize}
          role="img"
          aria-label={`${name} is online`}
        >
          {/* expanding halo ring */}
          <Box
            className="app-presence-ring"
            pos="absolute"
            inset={0}
            style={{
              borderRadius: "50%",
              backgroundColor: "var(--app-online)",
            }}
          />
          {/* solid status badge */}
          <Box
            pos="absolute"
            inset={0}
            style={{
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)",
              border: "2px solid var(--app-surface)",
              boxShadow: "0 0 6px rgba(34, 197, 94, 0.7)",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default UserAvatar;
