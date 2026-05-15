import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout.js";
import Login from "../components/Login.js";
import Signup from "../components/Signup.js";
import ChatScreen from "../components/ChatScreen.js";
import ProtectedRoute from "../components/ProtectedRoute.js";
import ForgotPassword from "../components/ForgotPassword.js";
import ResetPassword from "../components/ResetPassword.js";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Login />,
        children: [],
      },
      {
        path: "/signup",
        element: <Signup />,
        children: [],
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
        children: [],
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
        children: [],
      },
      {
        path: "/chat",
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
