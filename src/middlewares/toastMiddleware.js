// toastMiddleware.js
import { toast } from "react-toastify";

export const toastMiddleware = () => (next) => (action) => {
  if (action.type.endsWith("/fulfilled")) {
    if (action.payload?.message) {
      toast.success(action.payload.message, {
        autoClose: 1000
      });
    }
  }

  if (action.type.endsWith("/rejected")) {
    const errorMsg = action.error?.message || "Something went wrong";
    toast.error(errorMsg, {
      autoClose: 1000
    });
  }

  return next(action);
};
