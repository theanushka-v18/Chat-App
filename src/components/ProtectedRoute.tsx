// src/components/ProtectedRoute.tsx
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setIsAuthenticated } from "../redux/slices/authSlice.js";
import type React from "react";
import type { RootState } from "../redux/store.js";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  if (!accessToken) {
    // If not logged in → redirect to login
    return <Navigate to="/" replace />;
  }

  dispatch(setIsAuthenticated(true));

  return children;
};

export default ProtectedRoute;
