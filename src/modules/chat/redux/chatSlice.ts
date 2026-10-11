import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "@services/apiService";
import { chatEndpoints } from "@modules/chat/api/chatEndpoints";
import type { TUserData } from "@modules/auth/redux/authSlice";

export interface TChatMessage {
  sender?: string;
  receiver?: string;
  message?: string;
  timestamp?: string;
  [key: string]: any;
}

export interface TChatState {
  allUsers: (TUserData & { isOnline?: boolean })[];
  selectedUser: (TUserData & { isOnline?: boolean }) | null;
  chatHistory: TChatMessage[];
  isChatLoading: boolean;
  isUsersLoading: boolean;
  unreadCounts: Record<string, number>; // {userId: count}
  onlineUserIds: string[];
}

const initialState: TChatState = {
  allUsers: [],
  selectedUser: null,
  chatHistory: [],
  isChatLoading: false,
  isUsersLoading: false,
  unreadCounts: {}, // {userId: count}
  onlineUserIds: [],
};

const withPresence = <T extends TUserData & { isOnline?: boolean }>(
  user: T,
  onlineIds: Set<string>,
): T => ({ ...user, isOnline: onlineIds.has(user.id) });

export const getAllUsers = createAsyncThunk<
  { users: TUserData[] },
  { name: string | undefined }
>(
  "getAllUsers",
  async ({ name }) => {
    try {
      const response = await apiClient.post(chatEndpoints.ALL_USERS, { name });
      const { users } = response.data;
      return { users };
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },
);

export const getChatHistory = createAsyncThunk<
  { chats: TChatMessage[] },
  { fromUserId: string; toUserId: string }
>(
  "getChatHistory",
  async ({
    fromUserId,
    toUserId,
  }) => {
    try {
      const response = await apiClient.post(chatEndpoints.GET_CHAT_HISTORY, {
        fromUserId,
        toUserId,
      });
      const { chats } = response.data;
      return { chats };
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementUnread: (state, action) => {
      const userId = action.payload;
      if (!userId) return;
      state.unreadCounts[userId] = (state.unreadCounts[userId] || 0) + 1;
    },
    clearUnread: (state, action) => {
      const userId = action.payload;
      if (!userId) return;
      state.unreadCounts[userId] = 0;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      // clear unread when switching to this chat
      if (action.payload?.id) {
        state.unreadCounts[action.payload.id] = 0;
      }
    },
    setPresence: (
      state,
      action: { payload: { onlineUserIds: string[] } }
    ) => {
      state.onlineUserIds = action.payload.onlineUserIds || [];
      const onlineSet = new Set(state.onlineUserIds);
      state.allUsers = state.allUsers.map((u) => withPresence(u, onlineSet));
      // If selected user exists, ensure presence is reflected
      if (state.selectedUser) {
        state.selectedUser = withPresence(state.selectedUser, onlineSet);
      }
    },
    updateUserPresence: (
      state,
      action: {
        payload: { userId: string; isOnline: boolean; lastSeen?: string };
      }
    ) => {
      const { userId, isOnline, lastSeen } = action.payload;
      const current = new Set(state.onlineUserIds);
      if (isOnline) current.add(userId);
      else current.delete(userId);
      state.onlineUserIds = Array.from(current);

      const patch = {
        isOnline,
        ...(lastSeen ? { lastSeen } : {}),
      };

      state.allUsers = state.allUsers.map((u) =>
        u.id === userId ? { ...u, ...patch } : u
      );
      if (state.selectedUser?.id === userId) {
        state.selectedUser = { ...state.selectedUser, ...patch };
      }
    },
    resetChatState: (state) => {
      state.allUsers = [];
      state.selectedUser = null;
      state.chatHistory = [];
      state.unreadCounts = {};
      state.onlineUserIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        const onlineSet = new Set(state.onlineUserIds);
        state.allUsers = action.payload.users.map((u) =>
          withPresence(u, onlineSet),
        );
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isUsersLoading = false;
      })
      .addCase(getChatHistory.pending, (state) => {
        state.isChatLoading = true;
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.chatHistory = action.payload.chats;
        state.isChatLoading = false;
      })
      .addCase(getChatHistory.rejected, (state) => {
        state.isChatLoading = false;
      });
  },
});

export const {
  setSelectedUser,
  clearUnread,
  incrementUnread,
  setPresence,
  updateUserPresence,
  resetChatState,
} = chatSlice.actions;
export default chatSlice.reducer;
