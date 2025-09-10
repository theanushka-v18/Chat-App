import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiService";
import { apiEndPoints } from "../../api/apiEndPoints";

const initialState = {
  allUsers: [],
  selectedUser: null,
  chatHistory: [],
  isChatLoading: false,
  isUsersLoading: false,
  unreadCounts: {}, // {userId: count}
};

export const getAllUsers = createAsyncThunk("getAllUsers", async ({ name }) => {
  try {
    const response = await apiClient.post(apiEndPoints.ALL_USERS, { name });
    const { message, users } = response.data;
    return { message, users };
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const getChatHistory = createAsyncThunk(
  "getChatHistory",
  async ({ fromUserId, toUserId }) => {
    try {
      const response = await apiClient.post(apiEndPoints.GET_CHAT_HISTORY, {
        fromUserId,
        toUserId,
      });
      const { chats, message } = response.data;
      return { chats, message };
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementUnread: (state, action) => {
      const userId = action.payload;
      state.unreadCounts[userId] = (state.unreadCounts[userId] || 0) + 1;
    },
    clearUnread: (state, action) => {
      const userId = action.payload;
      state.unreadCounts[userId] = 0;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      // clear unread when switching to this chat
      state.unreadCounts[action.payload] = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        state.allUsers = action.payload.users;
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

export const { setSelectedUser, clearUnread, incrementUnread } =
  chatSlice.actions;
export default chatSlice.reducer;
