import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiEndPoints } from "../../api/apiEndPoints";
import { apiClient } from "../../api/apiService";

export const initialState = {
  userData: {
    email: "",
    name: "",
    id: "",
  },
  isAuthenticated: false,
  accessToken: "",
  isLoading: false,
};

export const signup = createAsyncThunk(
  "signup",
  async ({ fullName, email, password }) => {
    try {
      const response = await apiClient.post(apiEndPoints.SIGNUP, {
        name: fullName,
        email,
        password,
      });
      const { user, accessToken, message } = response.data;

      // save access token locally
      localStorage.setItem("accessToken", accessToken);
      return { user, accessToken, message };
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const login = createAsyncThunk("login", async ({ email, password }) => {
  try {
    const response = await apiClient.post(apiEndPoints.SIGNIN, {
      email,
      password,
    });
    const { accessToken, user, message } = response.data;

    // save access token locally
    localStorage.setItem("accessToken", accessToken);
    return { accessToken, user, message };
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const logout = createAsyncThunk("logout", async () => {
  const response = await apiClient.post(apiEndPoints.SIGNOUT);
  const { message } = response.data;
  localStorage.removeItem("accessToken");
});

export const changePassword = createAsyncThunk(
  "changePassword",
  async ({ currentPassword, newPassword }) => {
    try {
      const response = await apiClient.post(apiEndPoints.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      const { message } = response.data;
      return { message };
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "forgotPassword",
  async ({ email }) => {
    try {
      const response = await apiClient.post(apiEndPoints.FORGOT_PASSWORD, {
        email,
      });
      const { message } = response.data;
      return { message };
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "resetPassword",
  async ({ token, newPassword }) => {
    try {
      const response = await apiClient.post(apiEndPoints.RESET_PASSWORD, {
        token,
        newPassword,
      });
      const { message } = response.data;
      return { message };
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    logoutReducer: (state) => {
      state.userData = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isLoading = false;
      })
      .addCase(signup.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setIsAuthenticated, logoutReducer } = authSlice.actions;
export default authSlice.reducer;
