import { Bounce, toast } from "react-toastify";

export const useToast = () => {
  const showToast = ({ message, type }) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;

      case "error":
        toast.error(message);
        break;

      case "warning":
        toast.warning(message);
        break;

      default:
        toast(message);
    }
  };
  return { showToast };
};
