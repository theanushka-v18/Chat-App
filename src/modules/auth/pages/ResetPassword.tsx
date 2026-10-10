import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "@modules/auth/redux/authSlice";
import { notify } from "@services/notify";
import { RoutePaths } from "@/api/RoutePaths";
import AuthField from "@modules/auth/components/AuthField";
import AuthShell, { AuthHeading } from "@modules/auth/components/AuthShell";
import { Button, Group, Stack } from "@mantine/core";
import { brandGradient } from "@/theme";

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [resetPasswordDetails, setResetPasswordDetails] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const { isLoading } = useAppSelector((state) => state.auth);

  const isFormIncomplete =
    !resetPasswordDetails.newPassword || !resetPasswordDetails.confirmNewPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetPasswordDetails({
      ...resetPasswordDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      resetPasswordDetails.newPassword !==
      resetPasswordDetails.confirmNewPassword
    ) {
      notify.warning("Confirm password should be same as new password", {
        autoClose: 2000,
      });
      return;
    }
    dispatch(
      resetPassword({ token, newPassword: resetPasswordDetails.newPassword }),
    ).then((res) => {
      if (res.type === "resetPassword/fulfilled") {
        navigate(RoutePaths.LOGIN);
      }
    });
  };

  return (
    <AuthShell>
      <AuthHeading
        title="Choose a new password"
        description="Pick something you have not used before, then confirm it below."
      />

      <form onSubmit={handleSubmit} noValidate>
        <Stack gap="md">
          <AuthField
            id="newPassword"
            name="newPassword"
            label="New password"
            placeholder="At least 8 characters"
            value={resetPasswordDetails.newPassword}
            onChange={handleChange}
            isPassword
            autoComplete="new-password"
            icon="lock"
          />

          <AuthField
            id="confirmNewPassword"
            name="confirmNewPassword"
            label="Confirm new password"
            placeholder="Re-enter new password"
            value={resetPasswordDetails.confirmNewPassword}
            onChange={handleChange}
            isPassword
            autoComplete="new-password"
            icon="lock"
          />

          <Button
            type="submit"
            size="md"
            fullWidth
            disabled={isFormIncomplete}
            loading={isLoading}
            variant="gradient"
            gradient={brandGradient}
            style={{ boxShadow: "var(--app-shadow-brand)" }}
          >
            Reset password
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

export default ResetPassword;
