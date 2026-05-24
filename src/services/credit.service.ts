import api from "@/lib/axios";

// Function to get the current user's credits
export const getMyCredits = async () => {
  const response = await api.get("/api/credits");
  return response.data;
};

// Admin function to add credits to a user
export const addCredits = async (userId: string, amount: number) => {
  const response = await api.post("/api/admin/credits", { user_id: userId, amount });
  return response.data;
};
