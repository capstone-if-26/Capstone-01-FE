import api from "@/lib/axios";
import { 
    RegisterPayload,
    LoginPayload,
    AuthResponse,
} from "@/types/auth";

export const registerUser = async (
  data: RegisterPayload
) : Promise<AuthResponse> => {
  /*const response = await api.post(
    "/api/auth/register",
    data
  );

  return response.data;
  */

  // sementara mock API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          access_token: "mock-access-token",
          refresh_token: "mock-refresh-token",
          user: {
            id: "1",
            name: data.name,
            email: data.email,
          },
        },
      });
    }, 1000);
  });
};

export const loginUser = async (
  data: LoginPayload
): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          access_token: "mock-access-token",
          refresh_token: "mock-refresh-token",
          user: {
            id: "1",
            email: data.email,
          },
        },
      });
    }, 1000);
  });
};