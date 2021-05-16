import { toast } from "react-toastify";

class Toast {
  success(message?: string) {
    toast.success(message ?? "Procedure done successfully!");
  }

  error(message?: string) {
    toast.error(
      message ??
        "Oops! An error occurred while saving your progress, please contact support."
    );
  }
}

export default new Toast();
