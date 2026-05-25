import { authRoutePaths } from "@modules/auth/api/routePaths";
import { chatRoutePaths } from "@modules/chat/api/routePaths";

export const RoutePaths = {
  ...authRoutePaths,
  ...chatRoutePaths,
};
