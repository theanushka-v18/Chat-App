import AuthContainer from "../components/Login.js";
import Navbar from "../components/Navbar.js";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;
