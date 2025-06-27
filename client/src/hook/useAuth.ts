import { useMutation, useQuery } from "@tanstack/react-query";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { login, register, getMe } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

// LOGIN
export const useLogin = (): UseMutationResult<any, unknown, any, unknown> =>
  useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      useAuthStore.getState().setUser(data);
    },
  });

// REGISTER
export const useRegister = (): UseMutationResult<any, unknown, any, unknown> =>
  useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      useAuthStore.getState().setUser(data);
    },
  });

// GET CURRENT USER
export const useMe = (): UseQueryResult<any, Error> =>
  useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!localStorage.getItem("token"),
    
  });

  