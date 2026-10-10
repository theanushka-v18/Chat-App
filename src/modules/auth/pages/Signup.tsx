import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { signup } from "@modules/auth/redux/authSlice";
import { RoutePaths } from "@/api/RoutePaths";
import AuthField from "@modules/auth/components/AuthField";
import AuthShell, { AuthHeading } from "@modules/auth/components/AuthShell";
import { Anchor, Button, Group, Stack } from "@mantine/core";
import { brandGradient } from "@/theme";

const Signup = () => {
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading } = useAppSelector((state) => state.auth);

  const isButtonDisabled =
    !userDetails.fullName || !userDetails.email || !userDetails.password;

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
    const result = await dispatch(signup(userDetails));
    if (signup.fulfilled.match(result)) {
      navigate(RoutePaths.CHAT);
    }
  };

  return (
    <AuthShell>
      <AuthHeading
        title="Create your account"
        description="A few seconds and you can start chatting in real time."
      />

      <form onSubmit={handleSubmit} noValidate>
        <Stack gap="md">
          <AuthField
            id="fullName"
            name="fullName"
            label="Full name"
            placeholder="Ada Lovelace"
            value={userDetails.fullName}
            onChange={handleChange}
            autoComplete="name"
            icon="user"
          />

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
            placeholder="Choose a strong password"
            value={userDetails.password}
            onChange={handleChange}
            isPassword
            autoComplete="new-password"
            icon="lock"
          />

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
            Create account
          </Button>

          <Group justify="center" gap={6}>
            <Anchor component={Link} to={RoutePaths.LOGIN} fz="sm" fw={500}>
              Already have an account? Sign in
            </Anchor>
          </Group>
        </Stack>
      </form>
    </AuthShell>
  );
};

export default Signup;
