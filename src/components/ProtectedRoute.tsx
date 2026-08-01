// src/components/ProtectedRoute.tsx
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setIsAuthenticated } from "@modules/auth/redux/authSlice";
import type React from "react";
import type { RootState } from "@redux/store";
import { RoutePaths } from "@/api/RoutePaths";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (accessToken) {
      dispatch(setIsAuthenticated(true));
    }
  }, [accessToken, dispatch]);

  if (!accessToken) {
    // If not logged in → redirect to login
    return <Navigate to={RoutePaths.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
