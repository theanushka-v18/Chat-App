import { createBrowserRouter } from "react-router-dom";
import Layout from "@layouts/Layout";
import Login from "@modules/auth/pages/Login";
import Signup from "@modules/auth/pages/Signup";
import ChatScreen from "@modules/chat/pages/ChatScreen";
import ProtectedRoute from "@components/ProtectedRoute";
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
        element: <Login />,
        children: [],
      },
      {
        path: RoutePaths.SIGNUP,
        element: <Signup />,
        children: [],
      },
      {
        path: RoutePaths.FORGOT_PASSWORD,
        element: <ForgotPassword />,
        children: [],
      },
      {
        path: RoutePaths.RESET_PASSWORD,
        element: <ResetPassword />,
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
