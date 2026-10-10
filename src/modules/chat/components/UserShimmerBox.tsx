import { Group, Skeleton, Stack } from "@mantine/core";

/** Loading placeholder for one row of the conversations list. */
const UserShimmerBox = () => (
  <Group gap="sm" wrap="nowrap" align="center">
    <Skeleton height={42} width={42} radius="xl" />
    <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
      <Skeleton height={11} width="55%" radius="xl" />
      <Skeleton height={9} width="80%" radius="xl" />
    </Stack>
  </Group>
);

export default UserShimmerBox;
