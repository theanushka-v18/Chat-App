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
      const { user, accessToken } = response.data;

      // save access token locally
      localStorage.setItem("accessToken", accessToken);
      return { user, accessToken };
    } catch (error) {
      console.error(error.message);
    }
  }
);

export const login = createAsyncThunk("login", async ({ email, password }) => {
  try {
    const response = await apiClient.post(apiEndPoints.SIGNIN, {
      email,
      password,
    });
    const { accessToken, user } = response.data;

    // save access token locally
    localStorage.setItem("accessToken", accessToken);

    return { accessToken, user };
  } catch (error) {
    console.error(error.message);
  }
});

export const logout = createAsyncThunk("logout", async () => {
  await apiClient.post(apiEndPoints.SIGNOUT);
  localStorage.removeItem("accessToken");
});

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
      .addCase(login.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.accessToken = action.payload.accessToken;
      });
  },
});

export const { setIsAuthenticated, logoutReducer } = authSlice.actions;
export default authSlice.reducer;
