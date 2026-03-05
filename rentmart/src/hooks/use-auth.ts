"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  authApi,
  type LoginPayload,
  type SignupPayload,
  type ChangePasswordPayload,
} from "@/lib/api/auth";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

/** Fetch the currently authenticated user (via cookie) */
export function useMe() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authApi.getMe,
    retry: false,
  });
}

/**
 * Central auth hook — call this instead of useMe() everywhere.
 * Exposes the user, loading/error states, and convenient role booleans.
 */
export function useAuth() {
  const { data: user, isLoading, isError } = useMe();
  return {
    user: user ?? null,
    isLoading,
    isError,
    isAuthenticated: !!user,
    isOwner: user?.role === "OWNER",
    isRenter: user?.role === "RENTER",
    isAdmin: user?.role === "ADMIN",
  };
}

/** Sign up a new user, then redirect to login */
export function useSignup() {
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: SignupPayload) => authApi.signup(payload),
    onSuccess: () => {
      router.push("/login");
    },
  });
}

/** Log in with email + password */
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.data);
      router.push("/");
    },
  });
}

/** Log out and clear the cached user */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
      router.push("/login");
    },
  });
}

/** Change the current user's password */
export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      authApi.changePassword(payload),
  });
}
