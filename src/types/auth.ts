export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        access_token: string;
        refresh_token: string;
        user?: {
            id?: string;
            name?: string;
            email?: string;
        };
    };
}