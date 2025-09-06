// src/components/ProtectedRoute.tsx
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setIsAuthenticated } from "../redux/slices/authSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);

  if (!accessToken) {
    // If not logged in → redirect to login
    return <Navigate to="/" replace />;
  }

  dispatch(setIsAuthenticated(true));

  return children;
};

export default ProtectedRoute;
