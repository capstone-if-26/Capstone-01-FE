import { useState } from "react";
import { loginUser } from "@/services/auth.service";

export function useLogin() {
  const [loading, setLoading] = useState(false);

  const submitLogin = async (form: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const res = await loginUser(form);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return { submitLogin, loading };
}