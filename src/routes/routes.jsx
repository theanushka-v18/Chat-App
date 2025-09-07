import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout";
import Login from "../components/Login";
import Signup from "../components/Signup";
import ChatScreen from "../components/ChatScreen";
import ProtectedRoute from "../components/ProtectedRoute";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";

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
