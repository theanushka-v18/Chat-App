import { authEndpoints } from "@/modules/auth/api/authEndpoints";
import { chatEndpoints } from "@/modules/chat/api/chatEndpoints";

export const EndPoints = {
  ...authEndpoints,
  ...chatEndpoints,
};
