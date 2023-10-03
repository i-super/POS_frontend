import { toast } from "react-toastify";

class NotificationService {
  error = (message) => toast.error(message);
  info = (message) => toast.info(message);
  success = (message) => toast.success(message);
  toast = (message) => toast.toast(message);
  warning = (message) => toast.warn(message);
}

const notificationSvc = new NotificationService();
export default notificationSvc;