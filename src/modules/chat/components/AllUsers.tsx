import { useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Center,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { LuSearch, LuUserPlus, LuX } from "react-icons/lu";
import { useAppSelector } from "@redux/hooks";
import type { TUserData } from "@modules/auth/redux/authSlice";
import UserAvatar from "@components/UserAvatar";
import UserShimmerBox from "./UserShimmerBox";

interface IAllUsersProps {
  unreadCounts: Record<string, number>;
  selectedUser: TUserData | null;
  onSelectUser?: (user: TUserData) => void;
  /** Rendered as a close button when the list lives inside a drawer */
  onClose?: () => void;
}

const AllUsers = ({
  unreadCounts,
  selectedUser,
  onSelectUser,
  onClose,
}: IAllUsersProps) => {
  const [search, setSearch] = useState("");
  const { allUsers, isUsersLoading } = useAppSelector((state) => state.chat);
  const userData = useAppSelector((state) => state.auth.userData);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allUsers;
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term),
    );
  }, [allUsers, search]);

  const handleSelect = (user: TUserData) => {
    if (user.id === userData?.id) return;
    onSelectUser?.(user);
  };

  const renderShimmer = () => (
    <Stack gap="xs">
      {Array.from({ length: 6 }).map((_, index) => (
        <UserShimmerBox key={index} />
      ))}
    </Stack>
  );

  return (
    <Stack h="100%" gap={0}>
      <Box px="md" pt="md" pb="sm">
        <Group justify="space-between" gap="xs" wrap="nowrap" mb="sm">
          <Box style={{ minWidth: 0 }}>
            <Text fw={700} fz="lg" lh={1.2}>
              Chats
            </Text>
            <Text fz="xs" c="dimmed">
              {allUsers.length === 0
                ? "No one else is here yet"
                : `${allUsers.length} ${allUsers.length === 1 ? "person" : "people"} available`}
            </Text>
          </Box>
          {onClose && (
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              aria-label="Close chats list"
              onClick={onClose}
            >
              <LuX size={20} />
            </ActionIcon>
          )}
        </Group>

        <TextInput
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search people"
          aria-label="Search people"
          leftSection={<LuSearch size={18} />}
          rightSection={
            search ? (
              <UnstyledButton
                aria-label="Clear search"
                onClick={() => setSearch("")}
                style={{ display: "flex" }}
              >
                <LuX size={16} />
              </UnstyledButton>
            ) : null
          }
          rightSectionPointerEvents="all"
          radius="xl"
        />
      </Box>

      <ScrollArea style={{ flex: 1, minHeight: 0 }} type="hover">
        <Stack gap={2} px="xs" pb="md">
          {isUsersLoading && renderShimmer()}

          {!isUsersLoading && filteredUsers.length === 0 && (
            <Center py="xl" px="sm">
              <Stack gap="xs" align="center">
                <ThemeIcon
                  size={54}
                  radius="xl"
                  variant="light"
                  color={search ? "gray" : "brand"}
                >
                  {search ? <LuSearch size={26} /> : <LuUserPlus size={26} />}
                </ThemeIcon>
                <Text fw={600} fz="sm" ta="center">
                  {search ? "No matches" : "No conversations yet"}
                </Text>
                <Text fz="xs" c="dimmed" ta="center" maw={220} lh={1.5}>
                  {search
                    ? `Nobody matches "${search}". Try another name.`
                    : "Once other people join Orbither they will show up here."}
                </Text>
              </Stack>
            </Center>
          )}

          {filteredUsers.map((user) => {
            const unread = unreadCounts[user.id] ?? 0;
            const isActive = user.id === selectedUser?.id;

            return (
              <UnstyledButton
                key={user.id}
                onClick={() => handleSelect(user)}
                aria-pressed={isActive}
                styles={{
                  root: {
                    borderRadius: "0.75rem",
                    padding: "0.55rem 0.65rem",
                    backgroundColor: isActive
                      ? "var(--app-primary-soft)"
                      : "transparent",
                    transition: "background-color 120ms ease",
                    "&:hover": {
                      backgroundColor: isActive
                        ? "var(--app-primary-soft)"
                        : "var(--app-surface-muted)",
                    },
                  },
                }}
              >
                <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                  <UserAvatar
                    name={user.name}
                    src={user.profileImage?.url ?? null}
                    size={42}
                  />
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Group gap="xs" wrap="nowrap" justify="space-between">
                      <Text
                        fz="0.9rem"
                        fw={isActive ? 700 : 500}
                        lineClamp={1}
                        c={isActive ? "var(--app-primary)" : "var(--app-text)"}
                      >
                        {user.name}
                      </Text>
                      {unread > 0 && (
                        <Badge
                          size="sm"
                          variant="filled"
                          color="brand"
                          circle
                          style={{ flexShrink: 0 }}
                        >
                          {unread > 99 ? "99+" : unread}
                        </Badge>
                      )}
                    </Group>
                    <Text fz="xs" c="dimmed" lineClamp={1} visibleFrom="xs">
                      {user.email}
                    </Text>
                  </Box>
                </Group>
              </UnstyledButton>
            );
          })}
        </Stack>
      </ScrollArea>
    </Stack>
  );
};

export default AllUsers;
