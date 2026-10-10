import Navbar from "@components/Navbar";
import { Outlet } from "react-router-dom";
import { Box } from "@mantine/core";

const Layout = () => {
  return (
    <Box
      h="100dvh"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Navbar />
      <Box
        component="main"
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
