import { toast } from "react-toastify";

const DEFAULT_OPTIONS = {
  position: "top-center",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  theme: "light",
};

export const notifySuccess = (message, options = {}) =>
  toast.success(message, { ...DEFAULT_OPTIONS, ...options });

export const notifyError = (message, options = {}) =>
  toast.error(message, { ...DEFAULT_OPTIONS, ...options });
