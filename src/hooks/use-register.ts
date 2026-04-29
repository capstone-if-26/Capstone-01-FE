import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth.service";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitRegister = async (form: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const res = await registerUser(form);

      if (res.success) {
        router.push("/login");
      }

      return res;
    } finally {
      setLoading(false);
    }
  };

  return { submitRegister, loading };
}