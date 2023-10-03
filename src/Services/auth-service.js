import { create } from "apisauce";
import { Buffer } from "buffer";
import jwtDecode from "jwt-decode";
import { BehaviorSubject } from "rxjs";
import notificationSvc from "./notification";
import spinnerSvc from "./spinner";

export const authApi = create({
  baseURL: `https://collectpos1.azurewebsites.net/api/`,
  headers: { Accept: "application/json" },
});

authApi.axiosInstance.interceptors.request.use((config) => {
  spinnerSvc.start();
  if (config.url.includes("password")) {
    const token = localStorage.getItem("idToken") || "";

    if (token !== "") {
      config.headers.Authorization = token;
    }
  }
  return config;
});

authApi.axiosInstance.interceptors.response.use(
  (response) => {
    spinnerSvc.stop();
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      notificationSvc.error(error.response.data);
      spinnerSvc.stop();
      return null;
    } else {
      // notificationSvc.error(error.message);
      spinnerSvc.stop();
      return null;
    }
  }
);

class AuthService {
  isValidating$ = new BehaviorSubject(false);
  loginBehavior = new BehaviorSubject(true);
  lastRefreshTime = new Date();
  loginObservable$;
  role = "";
  constructor() {
    this.loginObservable$ = this.loginBehavior.asObservable();
  }

  // async receiveOTP(email) {
  //   try {
  //     const response = await authApi.post(
  //       "/forgot-password",
  //       { email: email },
  //       {
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response && response.ok) {
  //       notificationSvc.success("verification code send");
  //       return true;
  //     } else {
  //       notificationSvc.error("Invalid email");
  //       return false;
  //     }
  //   } catch (err) {
  //     notificationSvc.error("Invalid email");
  //     return false;
  //   }
  // }

  async login(email, password) {
    try {
      const response = await authApi.post("login", { email, password });

      if (response.ok) {
        const tokenBase64 = response.data.data.accessToken;
        const tokenData = jwtDecode(tokenBase64);
        // if (tokenData.role === "admin" || tokenData.role === "site-admin") {
        this.role = tokenData.role;
        localStorage.setItem("user", JSON.stringify(tokenData));
        this.role = tokenData.role;
        this.storeTokens(response.data.data);
        this.lastRefreshTime = new Date();
        return true; 
      } else {
        notificationSvc.error(
          "This user is not authorized to perform this action"
        );
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  // async verifyCode(email, code) {
  //   try {
  //     const response = await authApi.post(
  //       "/verify-code",
  //       { email, code },
  //       {
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response && response.ok) {
  //       notificationSvc.success("code verified successfully");
  //       return true;
  //     } else {
  //       notificationSvc.error("Invalid code");
  //       return false;
  //     }
  //   } catch (err) {
  //     notificationSvc.error("Invalid code");
  //     return false;
  //   }
  // }

  // async changePassword(email, password) {
  //   try {
  //     const response = await authApi.post(
  //       "/update-password",
  //       { email, password },
  //       {
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response && response.ok) {
  //       notificationSvc.success("Password reset successfully");
  //       return true;
  //     } else {
  //       notificationSvc.error("Invalid email");
  //       return false;
  //     }
  //   } catch (err) {
  //     notificationSvc.error("Invalid email");
  //     return false;
  //   }
  // }

  logout() {
    this.loginBehavior.next(false);
  }

  async refresh() {
    const token = localStorage.getItem("idToken");
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      const { data, ok } = await authApi.post("refresh-token", {
        token,
        refreshToken,
      });

      if (ok) {
        const tokenBase64 = data.data.accessToken;
        const tokenData = jwtDecode(tokenBase64);
        // if (tokenData.role === "admin" || tokenData.role === "site-admin") {
        this.role = tokenData.role;
        localStorage.setItem("user", JSON.stringify(tokenData));
        this.role = tokenData.role;
        this.storeTokens(data.data);
        this.lastRefreshTime = new Date();
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (err) {
      this.logout();
      return false;
    }
  }

  storeTokens(tokens) {
    const { refreshToken, accessToken } = tokens;

    localStorage.setItem("idToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("loggedIn", true);
  }

  async validate() {
    this.isValidating$.next(true);
    const response = await this.refresh();
    this.isValidating$.next(false);
    return { isLoggedIn: true, response };
  }
}

const authSvc = new AuthService();
export default authSvc;
