import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import chatAppLogo from "@assets/chat-app-logo.png";
import userLogo from "@assets/user-logo.png";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { LuLogOut } from "react-icons/lu";
import {
  changePassword,
  logout,
  logoutReducer,
} from "@modules/auth/redux/authSlice";
import { useNavigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { notify } from "@services/notify";
import { RoutePaths } from "@/api/RoutePaths";
import AuthField from "@modules/auth/components/AuthField";
import UserAvatar from "@components/UserAvatar";
import { useMediaQuery } from "@mantine/hooks";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  Menu,
  Modal,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { LuMoon, LuSun } from "react-icons/lu";
import type { RootState } from "@/redux/store";

const emptyPasswordDetails = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const toDisplayName = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const ColorSchemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const nextScheme = computedColorScheme === "dark" ? "light" : "dark";

  return (
    <Tooltip label={`Switch to ${nextScheme} mode`}>
      <ActionIcon
        variant="subtle"
        color="gray"
        size="lg"
        aria-label={`Switch to ${nextScheme} mode`}
        onClick={() => setColorScheme(nextScheme)}
      >
        {computedColorScheme === "dark" ? (
          <LuSun size={20} />
        ) : (
          <LuMoon size={20} />
        )}
      </ActionIcon>
    </Tooltip>
  );
};

const Navbar = () => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [changePasswordDetails, setChangePasswordDetails] =
    useState(emptyPasswordDetails);

  const isMobile = useMediaQuery("(max-width: 47.99em)", undefined, {
    getInitialValueInEffect: false,
  });

  const { userData, isAuthenticated, isLoading } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const displayName = toDisplayName(userData?.name) || "Account";

  const closeChangePassword = () => {
    setIsChangePasswordOpen(false);
    setChangePasswordDetails(emptyPasswordDetails);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChangePasswordDetails({
      ...changePasswordDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      changePasswordDetails.newPassword !==
      changePasswordDetails.confirmPassword
    ) {
      notify.warning("Confirm password should be same as new password", {
        autoClose: 2000,
      });
      return;
    }
    dispatch(
      changePassword({
        currentPassword: changePasswordDetails.oldPassword,
        newPassword: changePasswordDetails.newPassword,
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(logout());
        dispatch(logoutReducer());
        navigate(RoutePaths.LOGIN);
        closeChangePassword();
        notify.success("Password changed successfully! Please login again", {
          autoClose: 2000,
        });
      });
  };

  const handleLogout = async () => {
    const result = await dispatch(logout());

    if (logout.fulfilled.match(result)) {
      navigate(RoutePaths.LOGIN);
      dispatch(logoutReducer());
    }
  };

  return (
    <>
      <Flex
        component="header"
        align="center"
        justify="space-between"
        gap="sm"
        px={{ base: "sm", sm: "lg" }}
        py={{ base: "xs", sm: "sm" }}
        wrap="nowrap"
        style={{
          backgroundColor: "var(--app-surface-glass)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--app-border)",
          paddingTop: "max(0.5rem, env(safe-area-inset-top))",
          position: "relative",
          zIndex: 100,
        }}
      >
        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
          <ThemeIcon
            w={{ base: 34, sm: 40 }}
            h={{ base: 34, sm: 40 }}
            radius="md"
            variant="gradient"
            gradient={{ from: "brand.5", to: "violet.5", deg: 135 }}
            style={{ flexShrink: 0, boxShadow: "var(--app-shadow-brand)" }}
          >
            <Image src={chatAppLogo} alt="" w={22} h={22} fit="contain" />
          </ThemeIcon>
          <Text
            fw={700}
            fz={{ base: "0.95rem", sm: "1.15rem" }}
            lh={1.2}
            style={{ whiteSpace: "nowrap", flexShrink: 0 }}
          >
            Orbither
          </Text>
        </Group>

        <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
          <ColorSchemeToggle />

          {isAuthenticated && (
            <Menu width={280} position="bottom-end" withinPortal>
              <Menu.Target>
                <UnstyledButton
                  aria-label="Account menu"
                  px={4}
                  py={4}
                  style={{ borderRadius: "0.75rem", flexShrink: 0 }}
                >
                  <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
                    <Box visibleFrom="sm" maw={160} style={{ minWidth: 0 }}>
                      <Text
                        fz="0.85rem"
                        fw={600}
                        lineClamp={1}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {displayName}
                      </Text>
                    </Box>
                    <UserAvatar
                      name={userData?.name || "User"}
                      src={userLogo}
                      size={36}
                      online
                    />
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>
                  <Group gap="xs" wrap="nowrap">
                    <UserAvatar
                      name={userData?.name || "User"}
                      src={userLogo}
                      size={38}
                    />
                    <Box style={{ minWidth: 0 }}>
                      <Text fw={600} fz="sm" lineClamp={1}>
                        {displayName}
                      </Text>
                      <Text fz="xs" c="dimmed" lineClamp={1}>
                        {userData?.email}
                      </Text>
                    </Box>
                  </Group>
                </Menu.Label>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<RiLockPasswordFill size={18} />}
                  onClick={() => setIsChangePasswordOpen(true)}
                >
                  Change Password
                </Menu.Item>
                <Menu.Item
                  color="red"
                  disabled={isLoading}
                  leftSection={<LuLogOut size={18} />}
                  onClick={handleLogout}
                >
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Flex>

      <Modal
        opened={isChangePasswordOpen}
        onClose={closeChangePassword}
        title={
          <Group gap="xs" wrap="nowrap">
            <ThemeIcon variant="light" size="md">
              <RiLockPasswordFill size={16} />
            </ThemeIcon>
            <Text fw={700}>Change password</Text>
          </Group>
        }
        size="sm"
        fullScreen={isMobile}
        centered={!isMobile}
        padding="lg"
      >
        <form onSubmit={handleSubmit} noValidate>
          <Stack gap="md">
            <AuthField
              id="oldPassword"
              name="oldPassword"
              label="Current password"
              placeholder="Enter current password"
              value={changePasswordDetails.oldPassword}
              onChange={handleChange}
              isPassword
              autoComplete="current-password"
            />

            <AuthField
              id="newPassword"
              name="newPassword"
              label="New password"
              placeholder="Enter new password"
              value={changePasswordDetails.newPassword}
              onChange={handleChange}
              isPassword
              autoComplete="new-password"
            />

            <AuthField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm password"
              placeholder="Re-enter new password"
              value={changePasswordDetails.confirmPassword}
              onChange={handleChange}
              isPassword
              autoComplete="new-password"
            />

            <Divider my={4} />

            <Group grow gap="sm">
              <Button type="submit" loading={isLoading} fullWidth>
                Save changes
              </Button>
              <Button
                type="button"
                variant="light"
                color="gray"
                fullWidth
                onClick={closeChangePassword}
              >
                Cancel
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default Navbar;
