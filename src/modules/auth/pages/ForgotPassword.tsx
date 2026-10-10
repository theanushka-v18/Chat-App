import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "@modules/auth/redux/authSlice";
import { RoutePaths } from "@/api/RoutePaths";
import AuthField from "@modules/auth/components/AuthField";
import AuthShell, { AuthHeading } from "@modules/auth/components/AuthShell";
import { Alert, Button, Group, Stack, Text } from "@mantine/core";
import { LuCircleCheck, LuMail } from "react-icons/lu";
import { brandGradient } from "@/theme";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { isLoading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(forgotPassword({ email })).then((res) => {
      if (res.type === "forgotPassword/fulfilled") {
        setIsEmailSent(true);
      }
    });
  };

  return (
    <AuthShell>
      <AuthHeading
        title="Reset your password"
        description="Enter the email linked to your account and we will send you a reset link."
      />

      <form onSubmit={handleSubmit} noValidate>
        <Stack gap="md">
          {isEmailSent ? (
            <Alert
              variant="light"
              color="green"
              radius="md"
              icon={<LuCircleCheck size={20} />}
              title="Check your inbox"
            >
              A password reset link was sent to <Text span fw={600}>{email}</Text>.
              Open it on this device to choose a new password.
            </Alert>
          ) : (
            <AuthField
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              icon="mail"
            />
          )}

          <Button
            type="submit"
            size="md"
            fullWidth
            loading={isLoading && !isEmailSent}
            variant="gradient"
            gradient={brandGradient}
            style={{ boxShadow: "var(--app-shadow-brand)" }}
            leftSection={isEmailSent ? <LuMail size={18} /> : undefined}
          >
            {isEmailSent ? "Resend link" : "Send reset link"}
          </Button>

          <Group justify="center" gap={6}>
            <Button
              type="button"
              variant="subtle"
              color="gray"
              size="sm"
              onClick={() => navigate(RoutePaths.LOGIN)}
            >
              Back to sign in
            </Button>
          </Group>
        </Stack>
      </form>
    </AuthShell>
  );
};

export default ForgotPassword;
