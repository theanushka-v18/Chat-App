import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "@services/apiService";
import { authEndpoints } from "@modules/auth/api/authEndpoints";

export interface TProfileImage {
  url?: string;
  publicId?: string;
}

export interface TUserData {
  email: string;
  name: string;
  id: string;
  profileImage?: TProfileImage;
}

export interface TAuthState {
  userData: TUserData | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  isLoading: boolean;
}

export const initialState: TAuthState = {
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
  async ({
    fullName,
    email,
    password,
  }: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await apiClient.post(authEndpoints.SIGNUP, {
        name: fullName,
        email,
        password,
      });
      const { user, accessToken, message } = response.data;

      // save access token locally
      localStorage.setItem("accessToken", accessToken);
      return { user, accessToken, message };
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },
);

export const login = createAsyncThunk(
  "login",
  async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await apiClient.post(authEndpoints.SIGNIN, {
        email,
        password,
      });
      const { accessToken, user, message } = response.data;

      // save access token locally
      localStorage.setItem("accessToken", accessToken);
      return { accessToken, user, message };
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },
);

export const logout = createAsyncThunk("logout", async () => {
  const response = await apiClient.post(authEndpoints.SIGNOUT);
  const { message } = response.data;
  localStorage.removeItem("accessToken");
  return { message };
});

export const changePassword = createAsyncThunk(
  "changePassword",
  async ({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      const response = await apiClient.post(authEndpoints.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "forgotPassword",
  async ({ email }: { email: string }) => {
    try {
      const response = await apiClient.post(authEndpoints.FORGOT_PASSWORD, {
        email,
      });
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "resetPassword",
  async ({
    token,
    newPassword,
  }: {
    token: string | undefined;
    newPassword: string;
  }) => {
    try {
      const response = await apiClient.post(authEndpoints.RESET_PASSWORD, {
        token,
        newPassword,
      });
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },
);

export const uploadProfileImage = createAsyncThunk(
  "uploadProfileImage",
  async (file: File) => {
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await apiClient.post(
        authEndpoints.UPLOAD_PROFILE_IMAGE,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      const { user, message } = response.data;
      return { user, message };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Upload failed");
    }
  },
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
      localStorage.removeItem("accessToken");
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
      })
      .addCase(uploadProfileImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.userData = {
          ...state.userData,
          ...action.payload.user,
          id: action.payload.user.id,
        } as TUserData;
        state.isLoading = false;
      })
      .addCase(uploadProfileImage.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setIsAuthenticated, logoutReducer } = authSlice.actions;
export default authSlice.reducer;
