import type { ReactNode } from "react";
import {
  Box,
  Center,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import homePageImg from "@assets/home-page.png";
import chatAppLogo from "@assets/chat-app-logo.png";

const safePadding = {
  paddingTop: "max(1rem, env(safe-area-inset-top))",
  paddingRight: "max(1rem, env(safe-area-inset-right))",
  paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
  paddingLeft: "max(1rem, env(safe-area-inset-left))",
};

/**
 * Split auth layout.
 *
 * - The glow lives in the container's own `background` (no absolutely
 *   positioned layer), so nothing can be clipped by an `overflow: hidden`.
 * - The grid is centred with `margin: auto` instead of flex `align-items`,
 *   so short viewports scroll instead of clipping the top and bottom.
 * - Both columns stretch to the same row height: the card grows to match the
 *   illustration and the illustration frame fills whatever height it is given.
 */
const AuthShell = ({ children }: { children: ReactNode }) => (
  <Box
    style={{
      height: "100%",
      display: "flex",
      overflowY: "auto",
      overflowX: "hidden",
      backgroundColor: "var(--app-canvas)",
      backgroundImage:
        "radial-gradient(52rem 34rem at 10% 4%, var(--app-auth-glow-1), transparent 62%), radial-gradient(46rem 30rem at 92% 10%, var(--app-auth-glow-2), transparent 64%), radial-gradient(40rem 28rem at 76% 100%, var(--app-auth-glow-3), transparent 64%)",
      ...safePadding,
    }}
  >
    <Grid gap={{ base: "lg", md: "xl" }} w="100%" maw={1040} style={{ margin: "auto" }}>
      <Grid.Col span={{ base: 12, md: 6, lg: 5 }} style={{ display: "flex" }}>
        <Paper
          radius="lg"
          p={{ base: "md", sm: "xl" }}
          style={{
            flex: 1,
            maxWidth: 480,
            marginInline: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "var(--app-surface)",
            border: "1px solid var(--app-border)",
            boxShadow: "var(--app-shadow-lg)",
          }}
        >
          {/* brand lockup replaces the illustration on phones and tablets */}
          <Group
            hiddenFrom="md"
            justify="center"
            gap="sm"
            wrap="nowrap"
            mb="lg"
          >
            <ThemeIcon
              w={46}
              h={46}
              radius="md"
              variant="gradient"
              gradient={{ from: "brand.5", to: "violet.5", deg: 135 }}
              style={{ flexShrink: 0, boxShadow: "var(--app-shadow-brand)" }}
            >
              <Image src={chatAppLogo} alt="" w={24} h={24} fit="contain" />
            </ThemeIcon>
            <Text fw={800} fz="1.25rem" lh={1.1}>
              Orbither
            </Text>
          </Group>

          {children}
        </Paper>
      </Grid.Col>

      <Grid.Col
        span={{ base: 12, md: 6, lg: 7 }}
        visibleFrom="md"
        style={{ display: "flex" }}
      >
        <Box style={{ flex: 1, position: "relative", minHeight: 360 }}>
          {/* soft halo behind the frame, kept inside the column bounds */}
          <Box
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "2.5rem",
              transform: "scale(0.94)",
              backgroundImage:
                "linear-gradient(140deg, var(--app-auth-glow-1), var(--app-auth-glow-2) 50%, var(--app-auth-glow-3))",
              opacity: 0.7,
              filter: "blur(34px)",
            }}
          />
          {/* 1px gradient hairline around the frame */}
          <Box
            style={{
              position: "absolute",
              inset: 0,
              padding: 1,
              borderRadius: "1.75rem",
              backgroundImage:
                "linear-gradient(150deg, var(--app-auth-glow-1), transparent 42%, var(--app-auth-glow-3))",
              opacity: 0.9,
            }}
          >
            <Box
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "calc(1.75rem - 1px)",
                overflow: "hidden",
                backgroundColor: "var(--app-surface-muted)",
                border: "1px solid var(--app-border)",
                boxShadow: "var(--app-shadow-lg)",
              }}
            >
              <Image
                src={homePageImg}
                alt="Orbither preview"
                w="100%"
                h="100%"
                fit="cover"
                style={{ position: "absolute", inset: 0, objectPosition: "top center" }}
              />
            </Box>
          </Box>
        </Box>
      </Grid.Col>
    </Grid>
  </Box>
);

/** Shared title block used at the top of every auth card. */
export const AuthHeading = ({
  title,
  description,
}: {
  title: string;
  description: ReactNode;
}) => (
  <Center mb={{ base: "md", sm: "lg" }} ta="center">
    <Stack gap={4}>
      <Text
        component="h1"
        fz={{ base: "1.4rem", sm: "1.65rem" }}
        fw={700}
        lh={1.2}
      >
        {title}
      </Text>
      <Text fz="sm" c="dimmed" lh={1.45}>
        {description}
      </Text>
    </Stack>
  </Center>
);

export default AuthShell;
