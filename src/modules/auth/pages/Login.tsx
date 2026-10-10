import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { login } from "@modules/auth/redux/authSlice";
import { RoutePaths } from "@/api/RoutePaths";
import AuthField from "@modules/auth/components/AuthField";
import AuthShell, { AuthHeading } from "@modules/auth/components/AuthShell";
import { Anchor, Button, Group, Stack, Text } from "@mantine/core";
import { brandGradient } from "@/theme";

const Login = () => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading } = useAppSelector((state) => state.auth);
  const isButtonDisabled = !userDetails.email || !userDetails.password;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "email") {
      if (e.target.value.length > 255) {
        return; // Prevent further input if the email exceeds 255 characters
      }
    }
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(login(userDetails));

    if (login.fulfilled.match(result)) {
      navigate(RoutePaths.CHAT);
    }
  };

  return (
    <AuthShell>
      <AuthHeading
        title="Welcome back"
        description="Sign in to pick up your conversations where you left off."
      />

      <form onSubmit={handleSubmit} noValidate>
        <Stack gap="md">
          <AuthField
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={userDetails.email.toLowerCase()}
            onChange={handleChange}
            autoComplete="email"
            icon="mail"
          />

          <AuthField
            id="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={userDetails.password}
            onChange={handleChange}
            isPassword
            autoComplete="current-password"
            icon="lock"
          />

          <Group justify="flex-end" mt={-6}>
            <Anchor
              component={Link}
              to={RoutePaths.FORGOT_PASSWORD}
              fz="sm"
              fw={500}
            >
              Forgot password?
            </Anchor>
          </Group>

          <Button
            type="submit"
            size="md"
            fullWidth
            disabled={isButtonDisabled}
            loading={isLoading}
            variant="gradient"
            gradient={brandGradient}
            style={{ boxShadow: "var(--app-shadow-brand)" }}
          >
            Sign in
          </Button>

          <Group justify="center" gap={6}>
            <Text fz="sm" c="dimmed">
              New here?
            </Text>
            <Anchor component={Link} to={RoutePaths.SIGNUP} fz="sm" fw={600}>
              Create an account
            </Anchor>
          </Group>
        </Stack>
      </form>
    </AuthShell>
  );
};

export default Login;
