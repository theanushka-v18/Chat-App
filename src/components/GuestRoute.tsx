// src/components/GuestRoute.tsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type React from "react";
import type { RootState } from "@redux/store";
import { RoutePaths } from "@/api/RoutePaths";
import { Center, Loader } from "@mantine/core";

/**
 * Wraps public/auth pages so an already-authenticated user is sent to the
 * chat instead of seeing login, signup or password-reset screens.
 */
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, isInitialized } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isInitialized) {
    return (
      <Center h="60dvh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (accessToken) {
    return <Navigate to={RoutePaths.CHAT} replace />;
  }

  return children;
};

export default GuestRoute;
