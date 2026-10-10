import type { Middleware } from "@reduxjs/toolkit";
import { notify } from "@services/notify";

export const toastMiddleware: Middleware = () => (next) => (action: any) => {
  if (action.type.endsWith("/fulfilled")) {
    if (action.payload?.message) {
      notify.success(action.payload.message, { autoClose: 1500 });
    }
  }

  if (action.type.endsWith("/rejected")) {
    const errorMsg = action.error?.message || "Something went wrong";
    notify.error(errorMsg, { autoClose: 2500 });
  }

  return next(action);
};
