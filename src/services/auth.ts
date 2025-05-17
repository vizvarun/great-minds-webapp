import api from "./api";

export interface LoginPayload {
  mobile_number: string;
  device_id: string;
  bypass_otp: boolean;
}

export interface VerifyOTPPayload {
  mobile_number: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
}

const AuthService = {
  login: async (payload: LoginPayload) => {
    const response = await api.post<{ message: string }>(
      "/auth/send-otp",
      {}, // Empty body
      { params: payload } // Send as query params instead
    );
    return response.data;
  },

  verifyOTP: async (payload: VerifyOTPPayload) => {
    const response = await api.post<AuthResponse>("/auth/verify-otp", payload);

    // Store token if authentication successful
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("authToken");
  },

  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default AuthService;
