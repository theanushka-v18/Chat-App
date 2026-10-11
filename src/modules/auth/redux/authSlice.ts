import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient, refreshAccessToken } from "@services/apiService";
import { authEndpoints } from "@modules/auth/api/authEndpoints";

const STORAGE_KEYS = {
  accessToken: "accessToken",
  userData: "userData",
} as const;

const persistUser = (user: TUserData | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.userData);
  }
};

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
  /** True once we've attempted to restore the session on startup. */
  isInitialized: boolean;
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
  isInitialized: false,
};

/**
 * Restore the session on app startup.
 * - Reuses the access token from localStorage when present.
 * - Otherwise (or when it has expired) exchanges the httpOnly refresh cookie
 *   for a new access token via the existing /refresh endpoint.
 * - Rehydrates the cached user profile so UI does not flash empty state.
 */
export const bootstrapAuth = createAsyncThunk("bootstrapAuth", async () => {
  let user: TUserData | null = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.userData);
    user = raw ? (JSON.parse(raw) as TUserData) : null;
  } catch {
    user = null;
  }

  let accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);

  // Try the refresh cookie first so a page reload gets a valid, fresh token.
  try {
    const refreshed = await refreshAccessToken();
    if (refreshed) accessToken = refreshed;
  } catch {
    // No valid refresh session; fall back to any stored access token.
  }

  // If we have a token but no cached profile (e.g. first load after an
  // upgrade), fetch it so the UI is not stuck on an empty user.
  if (!user && accessToken) {
    try {
      const res = await apiClient.get(authEndpoints.ME);
      user = (res.data?.user ?? res.data) as TUserData;
      persistUser(user);
    } catch {
      // Ignore: token may still be usable; profile can load later.
    }
  }

  return { accessToken: accessToken || null, user };
});

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

      // save access token + profile locally so a refresh can restore the session
      localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
      persistUser(user);
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

      // save access token + profile locally so a refresh can restore the session
      localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
      persistUser(user);
      return { accessToken, user, message };
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },
);

export const logout = createAsyncThunk("logout", async () => {
  const response = await apiClient.post(authEndpoints.SIGNOUT);
  const { message } = response.data;
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  persistUser(null);
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
      persistUser(user);
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
      state.isInitialized = true;
      localStorage.removeItem(STORAGE_KEYS.accessToken);
      persistUser(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = Boolean(action.payload.accessToken);
        if (action.payload.user) {
          state.userData = action.payload.user;
        }
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.isInitialized = true;
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
        state.isAuthenticated = true;
        state.isInitialized = true;
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
