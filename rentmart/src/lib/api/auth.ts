import apiClient from "@/lib/api-client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "RENTER" | "OWNER" | "ADMIN";
  isVerified: boolean;
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

export const authApi = {
  signup: async (payload: SignupPayload) => {
    const { data } = await apiClient.post("/auth/signup", payload);
    return data as { data: AuthUser };
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
};
