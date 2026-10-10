import {
  Button,
  createTheme,
  Drawer,
  Menu,
  Modal,
  PasswordInput,
  ScrollArea,
  Textarea,
  TextInput,
  Tooltip,
  type MantineColorsTuple,
} from "@mantine/core";

const brand: MantineColorsTuple = [
  "#eef0fb",
  "#dde1f6",
  "#b9c1ea",
  "#93a0dd",
  "#7381d2",
  "#5d6ac6",
  "#4a57a8",
  "#3c4790",
  "#313a78",
  "#28305d",
];

export const theme = createTheme({
  primaryColor: "brand",
  primaryShade: { light: 6, dark: 4 },
  colors: { brand },
  fontFamily: "var(--app-font-family)",
  fontFamilyMonospace:
    "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  headings: {
    fontFamily: "var(--app-font-family)",
    fontWeight: "700",
    sizes: {
      h1: { fontSize: "1.9rem", lineHeight: "1.25" },
      h2: { fontSize: "1.55rem", lineHeight: "1.3" },
      h3: { fontSize: "1.25rem", lineHeight: "1.35" },
      h4: { fontSize: "1.05rem", lineHeight: "1.4" },
    },
  },
  defaultRadius: "md",
  radius: {
    xs: "0.375rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
  },
  respectReducedMotion: true,
  cursorType: "pointer",
  components: {
    Button: {
      defaultProps: {
        radius: "md",
        fw: 600,
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: "md",
      },
    },
    TextInput: {
      defaultProps: {
        radius: "md",
        size: "md",
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: "md",
        size: "md",
      },
    },
    Textarea: {
      defaultProps: {
        radius: "md",
      },
    },
    Menu: {
      defaultProps: {
        radius: "md",
        shadow: "md",
      },
    },
    Modal: {
      defaultProps: {
        radius: "lg",
        centered: true,
        overlayProps: { backgroundOpacity: 0.5, blur: 6 },
      },
    },
    Drawer: {
      defaultProps: {
        overlayProps: { backgroundOpacity: 0.5, blur: 6 },
      },
    },
    Tooltip: {
      defaultProps: {
        radius: "md",
        withArrow: true,
        openDelay: 400,
      },
    },
    ScrollArea: {
      defaultProps: {
        scrollbarSize: 8,
      },
    },
  },
});

export const brandGradient = {
  from: "brand.5",
  to: "violet.5",
  deg: 135,
} as const;
