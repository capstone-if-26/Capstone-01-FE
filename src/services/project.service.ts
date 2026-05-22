import api from "@/lib/axios";

// 1. Tambahkan Interface agar TypeScript tahu bentuk data Project dari backend
export interface Project {
  id: string;
  user_id: string;
  name?: string;
  institution_name?: string;
  description?: string;
  institution_history?: string;
  theme?: string;
  selected_theme?: string;
  status: string;
  created_at: string;
  

  event_content?: string;
  tone_of_voice?: string;
  selected_key_message?: string;
  prompt?: string;
  video_duration?: string;
  school_level?: string;
  offered_degrees?: string;
  logo_url?: string;  
  env_url?: string;   
}

export const initializeProject = async (data: {
  institution_name: string;
  institution_history?: string;
  school_level?: string;
  offered_degrees?: string;

  event_content: string;
  tone_of_voice: string;
  selected_key_message: string;
  video_duration?: string;
  prompt?: string;

  selected_theme: string;

  editable_copywriting?: string;
  editable_hashtags?: string;

  logo_base64?: string;
  env_base64?: string;
  document_base64?: string;
}) => {
  const res = await api.post("/api/projects/initialize", data);
  return res.data;
};

// 2. TAMBAHKAN FUNGSI INI UNTUK MENGAMBIL SEMUA PROJECT
export const getProjects = async (): Promise<{ success: boolean; message: string; data: Project[] }> => {
  // api.get akan otomatis memakai NEXT_PUBLIC_API_URL dan menempelkan Token dari @/lib/axios
  const res = await api.get("/api/projects"); 
  return res.data;
};

// Tambahkan di bagian paling bawah project.service.ts
export const getProjectById = async (id: string) => {
  const res = await api.get(`/api/projects/${id}`);
    console.log(res.data);
  return res.data;

};
