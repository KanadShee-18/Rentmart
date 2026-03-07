import apiClient from "@/lib/api-client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "RENTER" | "OWNER" | "ADMIN";
  isVerified: boolean;
  emailVerified: boolean;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: "RENTER" | "OWNER";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export const authApi = {
  signup: async (payload: SignupPayload) => {
    const { data } = await apiClient.post("/auth/signup", payload);
    return data as { data: AuthUser & { message: string } };
  },

  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post("/auth/login", payload);
    return data as { data: AuthUser };
  },

  logout: async () => {
    const { data } = await apiClient.post("/auth/logout");
    return data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const { data } = await apiClient.post("/auth/change-password", payload);
    return data;
  },

  getMe: async (): Promise<AuthUser> => {
    const { data } = await apiClient.get("/auth/me");
    return data.data as AuthUser;
  },

  verifyOtp: async (payload: VerifyOtpPayload) => {
    const { data } = await apiClient.post("/auth/verify-otp", payload);
    return data as { message: string };
  },

  resendOtp: async (payload: ResendOtpPayload) => {
    const { data } = await apiClient.post("/auth/resend-otp", payload);
    return data as { message: string };
  },
};
