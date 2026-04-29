import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth.service";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitLogin = async (form: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const res = await loginUser(form);

      const { access_token, refresh_token } = res.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      router.push("/dashboard");

      return res;
    } finally {
      setLoading(false);
    }
  };

  return { submitLogin, loading };
}