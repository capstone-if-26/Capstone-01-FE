import api from "@/lib/axios";

export interface GenerateVideoScriptPayload {
  storyboard_id: string;
}

export interface GenerateVideoResponse {
  url: string;
}

export const generateVideoService = {
  generate: async (
    payload: GenerateVideoScriptPayload
  ): Promise<GenerateVideoResponse> => {
    const response = await api.post(
      "/api/ai/video/generate",
      payload
    );

    return response.data;
  },

  getVideoResult: async (
    url: string
  ): Promise<GenerateVideoResponse> => {
    const response = await api.get(
      "/api/ai/video/getVideo",
      {
        params: {
          url,
        },
      }
    );

    return response.data;
  },
};

export default generateVideoService;