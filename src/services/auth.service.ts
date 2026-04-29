import api from "@/lib/axios";
import {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
} from "@/types/auth";

export const registerUser = async (
  data: RegisterPayload
): Promise<AuthResponse> => {
  const response = await api.post("/api/auth/register", data);
  return response.data;
};

export const loginUser = async (
  data: LoginPayload
): Promise<AuthResponse> => {
  const response = await api.post("/api/auth/login", data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};

export const refreshToken = async (refresh_token: string) => {
  const response = await api.post("/api/auth/refresh", {
    refresh_token,
  });
  return response.data;
};

export const changePassword = async (data: {
  old_password: string;
  new_password: string;
}) => {
  const response = await api.post(
    "/api/auth/change-password",
    data
  );
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete("/api/auth/account");
  return response.data;
};