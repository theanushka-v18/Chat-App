import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "@redux/store";
import Notifications from "@components/Notifications";
import "@mantine/core/styles.css";
import "./App.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <App />
        <Notifications />
      </MantineProvider>
    </Provider>
  </StrictMode>,
);
