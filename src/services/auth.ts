import api from "./api";

export interface LoginPayload {
  mobile_number: string;
  device_id: string;
  bypass_otp: boolean;
}

export interface VerifyOTPPayload {
  mobile_number: string;
  device_id: string; // Added device_id field
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

interface ProfileResponse {
  status: boolean;
  message: string;
  errors: any;
  data: {
    schoolid: number;
    name: string;
    address: string;
    city: string;
    logo: string;
    userid: number;
    firstname: string;
    middlename: string;
    lastname: string;
  };
  dashboard: {
    total_students: number;
    total_teachers: number;
    total_male_students: number;
    total_female_students: number;
  };
}

interface OTPVerifyResponse {
  status: boolean;
  message: string;
  errors: any;
  data: {
    access_token: string;
  };
}

const AuthService = {
  login: async (payload: LoginPayload) => {
    const response = await api.post<{ message: string }>(
      "/web/auth/send-otp",
      {}, // Empty body
      { params: payload } // Send as query params instead
    );
    return response.data;
  },

  verifyOTP: async (payload: VerifyOTPPayload) => {
    const response = await api.post<OTPVerifyResponse>(
      "/web/auth/verify-otp",
      {},
      { params: payload }
    );

    // Store token if authentication successful
    if (response.data.status && response.data.data.access_token) {
      localStorage.setItem("authToken", response.data.data.access_token);
    }

    return response.data;
  },

  getUserProfile: async () => {
    const response = await api.get<ProfileResponse>("/web/user/profile");

    if (response.data.status) {
      // Store user profile data in localStorage
      localStorage.setItem("userProfile", JSON.stringify(response.data.data));
      localStorage.setItem(
        "dashboardData",
        JSON.stringify(response.data.dashboard)
      );
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("dashboardData");
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

  getCachedUserProfile: () => {
    const profile = localStorage.getItem("userProfile");
    return profile ? JSON.parse(profile) : null;
  },

  getDashboardData: () => {
    const data = localStorage.getItem("dashboardData");
    return data ? JSON.parse(data) : null;
  },
};

export default AuthService;
