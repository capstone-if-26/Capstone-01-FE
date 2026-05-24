import api from "@/lib/axios";

export interface GenerateVideoPayload {
  project_id: string;
  storyboard_id: string;
  custom_prompt?: string;
  scene_count?: number;
  video_duration?: number;
}

export interface VideoGenerationJob {
  generation_job_id: string;
  status: string;
  created_at: string;
}

export interface VideoVariantStatus {
  id: string;
  variant_number: number;
  status: string;
  video_url: string;
  thumbnail_url: string;
  prompt_used: string;
  duration: number;
  provider: string;
  model: string;
  scenes: SceneStatus[];
  created_at: string;
  updated_at: string;
}

export interface SceneStatus {
  id: string;
  scene_number: number;
  status: string;
  video_url: string;
  duration: number;
  error_message: string;
  updated_at: string;
}

export interface PreviewResponse {
  preview_url: string;
}

export interface DownloadResponse {
  download_url: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const videoService = {
  async listVideos(): Promise<ApiResponse<any[]>> {
    const response = await api.get("/api/videos");
    return response.data;
  },

  async generateVideo(
    payload: GenerateVideoPayload
  ): Promise<ApiResponse<VideoGenerationJob>> {
    const response = await api.post("/api/videos/generate", payload);
    return response.data;
  },

  async getVideoStatus(
    variantId: string
  ): Promise<ApiResponse<VideoVariantStatus>> {
    const response = await api.get(`/api/videos/${variantId}`);
    return response.data;
  },

  async getStoryboardVariants(
    storyboardId: string
  ): Promise<ApiResponse<VideoVariantStatus[]>> {
    const response = await api.get(
      `/api/videos/storyboard/${storyboardId}`
    );

    return response.data;
  },

  async getVideoDownloadUrl(
    variantId: string
  ): Promise<ApiResponse<DownloadResponse>> {
    const response = await api.get(
      `/api/videos/download/${variantId}`
    );

    return response.data;
  },

  async getVideoPreviewUrl(
    variantId: string
  ): Promise<ApiResponse<PreviewResponse>> {
    const response = await api.get(
      `/api/videos/preview/${variantId}`
    );

    return response.data;
  },

  async pollUntilComplete(
    variantId: string,
    onProgress: (status: VideoVariantStatus) => void,
    intervalMs = 4000,
    maxAttempts = 120
  ): Promise<VideoVariantStatus | null> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const res = await this.getVideoStatus(variantId);

        const data = res.data;

        onProgress(data);

        if (
          data.status === "completed" ||
          data.status === "failed" ||
          data.video_url
        ) {
          return data;
        }
      } catch (err) {
        console.warn("[videoService] Poll error:", err);
      }

      await new Promise((r) => setTimeout(r, intervalMs));
    }

    return null;
  },
};

export default videoService;