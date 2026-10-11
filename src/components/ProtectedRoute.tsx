// src/components/ProtectedRoute.tsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type React from "react";
import type { RootState } from "@redux/store";
import { RoutePaths } from "@/api/RoutePaths";
import { Center, Loader } from "@mantine/core";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, isInitialized } = useSelector(
    (state: RootState) => state.auth,
  );

  // Wait for the startup session restore before deciding — prevents the
  // "logged out on refresh" flash/redirect before bootstrapAuth resolves.
  if (!isInitialized) {
    return (
      <Center h="60dvh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!accessToken) {
    // If not logged in → redirect to login
    return <Navigate to={RoutePaths.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
