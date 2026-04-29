import api from "@/lib/axios";

export const createProject = async (data: {
  name: string;
  description: string;
}) => {
  const res = await api.post("/api/projects", data);
  return res.data;
};

export const createBusinessBrief = async (data: any) => {
  const res = await api.post("/api/briefs/business", data);
  return res.data;
};

export const createCreativeBrief = async (data: any) => {
  const res = await api.post("/api/briefs/creative", data);
  return res.data;
};

export const generateContentPillars = async (projectId: string) => {
  const res = await api.post(`/api/projects/${projectId}/content-pillars/generate`);
  return res.data;
};

export const generateStoryboards = async (projectId: string) => {
  const res = await api.post(`/api/projects/${projectId}/storyboards/generate`);
  return res.data;
};