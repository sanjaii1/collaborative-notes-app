import { useMutation, useQuery } from "@tanstack/react-query";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { login, register, getMe } from "../services/authApi";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export const useLogin = (): UseMutationResult<any, unknown, any, unknown> =>
  useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      useAuthStore.getState().login(data.user, data.token);
    },
  });

export const useRegister = (): UseMutationResult<any, unknown, any, unknown> =>
  useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      useAuthStore.getState().login(data.user, data.token);
    },
  });

export const useMe = (): UseQueryResult<any, Error> =>
  useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!useAuthStore.getState().token,
  });

export const useInitializeAuth = (): void => {
  useEffect(() => {
    useAuthStore.getState().initializeFromStorage();
  }, []);
};

  