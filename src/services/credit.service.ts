import api from "@/lib/axios";

export const getMyCredits = async () => {
  const response = await api.get("/api/credits");
  return response.data;
};

export const addCredits = async (userId: string, amount: number) => {
  const response = await api.post("/api/admin/credits", { user_id: userId, amount });
  return response.data;
};
