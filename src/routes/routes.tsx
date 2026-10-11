import { createBrowserRouter } from "react-router-dom";
import Layout from "@layouts/Layout";
import Login from "@modules/auth/pages/Login";
import Signup from "@modules/auth/pages/Signup";
import ChatScreen from "@modules/chat/pages/ChatScreen";
import ProtectedRoute from "@components/ProtectedRoute";
import GuestRoute from "@components/GuestRoute";
import ForgotPassword from "@modules/auth/pages/ForgotPassword";
import ResetPassword from "@modules/auth/pages/ResetPassword";
import { RoutePaths } from "@/api/RoutePaths";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: RoutePaths.LOGIN,
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ),
        children: [],
      },
      {
        path: RoutePaths.SIGNUP,
        element: (
          <GuestRoute>
            <Signup />
          </GuestRoute>
        ),
        children: [],
      },
      {
        path: RoutePaths.FORGOT_PASSWORD,
        element: (
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        ),
        children: [],
      },
      {
        path: RoutePaths.RESET_PASSWORD,
        element: (
          <GuestRoute>
            <ResetPassword />
          </GuestRoute>
        ),
        children: [],
      },
      {
        path: RoutePaths.CHAT,
        element: (
          <ProtectedRoute>
            <ChatScreen />
          </ProtectedRoute>
        ),
        children: [],
      },
    ],
  },
]);
