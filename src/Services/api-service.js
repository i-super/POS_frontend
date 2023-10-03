import { create } from "apisauce";
import authSvc from "./auth-service";
import notificationSvc from "./notification";
import spinnerSvc from "./spinner";

export const api = create({
  baseURL: `https://collectpos1.azurewebsites.net/api/`,
  headers: { Accept: "application/json" },
});

api.axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.url.includes("attachment")) {
    } else {
      spinnerSvc.start();
    }

    const token = localStorage.getItem("idToken") || "";

    if (token !== "") {
      config.headers.Authorization = token;
    }

    return config;
  },
  (err) => console.error(err)
);

api.axiosInstance.interceptors.response.use(
  (response) => {
    spinnerSvc.stop();
    return response;
  },
  async (err) => {
    spinnerSvc.stop();

    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const accessToken = await authSvc.refresh();

      if (accessToken) {
        api.axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken;
        return api.axiosInstance(originalRequest);
      } else {
        authSvc.logout();
        return;
      }
    }

    switch (err.response?.status) {
      case 400:
        spinnerSvc.stop();
        notificationSvc.error(err.response.data.message);
        return;

      case 401:
        notificationSvc.error("You are unauthorized to perform this action");
        spinnerSvc.stop();
        return;

      case 404:
        notificationSvc.error("Item not found");
        spinnerSvc.stop();
        return;

      case 500:
        notificationSvc.error(
          "Unexpected error Please contact your administrator"
        );
        spinnerSvc.stop();
        return;

      default:
        notificationSvc.error(
          "Unexpected error Please contact your administrator"
        );
        spinnerSvc.stop();
        return;
    }
  }
);
