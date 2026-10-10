import { useSyncExternalStore } from "react";
import { Box, Notification, Stack, Text, Transition } from "@mantine/core";
import { MdErrorOutline, MdInfo, MdWarningAmber } from "react-icons/md";
import { LuCircleCheck } from "react-icons/lu";
import { notify, type NotifyTone } from "@services/notify";

const TONE_CONFIG: Record<NotifyTone, { color: string; icon: typeof MdInfo }> = {
  success: { color: "green", icon: LuCircleCheck },
  error: { color: "red", icon: MdErrorOutline },
  warning: { color: "yellow", icon: MdWarningAmber },
  info: { color: "blue", icon: MdInfo },
};

const Notifications = () => {
  const notifications = useSyncExternalStore(
    notify.subscribe,
    notify.getNotifications,
    notify.getNotifications,
  );

  return (
    <Box
      pos="fixed"
      top={{ base: "4.75rem", sm: "1rem" }}
      left={{ base: "0.5rem", sm: "auto" }}
      right={{ base: "0.5rem", sm: "1rem" }}
      style={{ zIndex: 1000, pointerEvents: "none" }}
    >
      <Stack gap="sm" maw={400} ml="auto">
        {notifications.map((notification) => {
          const { color, icon: Icon } = TONE_CONFIG[notification.tone];
          const titleProps = notification.title
            ? { title: notification.title }
            : {};

          return (
            <Transition
              key={notification.id}
              mounted
              transition="slide-left"
              duration={200}
              timingFunction="ease"
            >
              {(styles) => (
                <Notification
                  {...titleProps}
                  icon={<Icon size={20} />}
                  color={color}
                  withCloseButton
                  onClose={() => notify.hide(notification.id)}
                  radius="lg"
                  withBorder
                  variant="light"
                  style={{
                    ...styles,
                    pointerEvents: "auto",
                    boxShadow: "var(--app-shadow-lg)",
                    backgroundColor: "var(--app-surface)",
                  }}
                >
                  <Text fz="sm" lh={1.45}>
                    {notification.message}
                  </Text>
                </Notification>
              )}
            </Transition>
          );
        })}
      </Stack>
    </Box>
  );
};

export default Notifications;
