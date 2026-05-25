import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@modules/auth/redux/authSlice";
import chatReducer from "@modules/chat/redux/chatSlice";
import { toastMiddleware } from "@middlewares/toastMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(toastMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
