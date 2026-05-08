import api from "@/lib/axios";

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
