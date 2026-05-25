import { createBrowserRouter } from "react-router-dom";
import Layout from "@layouts/Layout.js";
import Login from "@modules/auth/pages/Login.js";
import Signup from "@modules/auth/pages/Signup.js";
import ChatScreen from "@modules/chat/pages/ChatScreen.js";
import ProtectedRoute from "@components/ProtectedRoute.js";
import ForgotPassword from "@modules/auth/pages/ForgotPassword.js";
import ResetPassword from "@modules/auth/pages/ResetPassword.js";
import { ChatRoutePaths } from "@/modules/chat/api/routePaths";
import { AuthRoutePaths } from "@/modules/auth/api/routePaths";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: AuthRoutePaths.LOGIN,
        element: <Login />,
        children: [],
      },
      {
        path: AuthRoutePaths.SIGNUP,
        element: <Signup />,
        children: [],
      },
      {
        path: AuthRoutePaths.FORGOT_PASSWORD,
        element: <ForgotPassword />,
        children: [],
      },
      {
        path: AuthRoutePaths.RESET_PASSWORD,
        element: <ResetPassword />,
        children: [],
      },
      {
        path: ChatRoutePaths.CHAT,
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
