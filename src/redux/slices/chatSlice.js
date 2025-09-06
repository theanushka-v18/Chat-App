import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiService";
import { apiEndPoints } from "../../api/apiEndPoints";

const initialState = {
  allUsers: [],
  selectedUser: "",
  chatHistory: [],
  unreadCounts: {}, // {userId: count}
};

export const getAllUsers = createAsyncThunk("getAllUsers", async ({ name }) => {
  try {
    const response = await apiClient.post(apiEndPoints.ALL_USERS, { name });
    return response.data;
  } catch (error) {
    console.error(error.message);
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
      const { chats } = response.data;
      return { chats };
    } catch (error) {
      console.error(error.message);
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
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.chatHistory = action.payload.chats;
      });
  },
});

export const { setSelectedUser, clearUnread, incrementUnread } =
  chatSlice.actions;
export default chatSlice.reducer;
