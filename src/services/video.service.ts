import api from "@/lib/axios";

export type VideoMode = 'text-to-video' | 'image-to-video' | 'start-end-to-video';

export interface GenerateVideoPayload {
  project_id: string;
  storyboard_id: string;
  custom_prompt?: string;
  scene_count?: number;
  video_duration?: number;

  // Video mode — controls WaveSpeed model & credit cost
  video_mode?: VideoMode;        // default: 'text-to-video'

  // Image inputs (CDN URLs, required per mode)
  start_image?: string;          // image-to-video & start-end-to-video
  end_image?: string;            // start-end-to-video only

  // Generation controls
  negative_prompt?: string;
  generate_audio?: boolean;      // text-to-video only
  seed?: number;                 // -1 = random
  resolution?: '720p' | '1080p';
}

export interface SceneVideoJob {
  generation_job_id: string;
  video_id: string;
  status: string;
}

export interface VideoGenerationJob {
  videos: SceneVideoJob[];
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

  async regenerateScene(
    videoId: string,
    customPrompt?: string
  ): Promise<ApiResponse<{ video_id: string; job_id: string; status: string }>> {
    const response = await api.post(`/api/videos/scene/${videoId}/regenerate`, {
      custom_prompt: customPrompt || '',
    });
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
        if (data.status === "completed" || data.status === "failed" || data.video_url) {
          return data;
        }
      } catch (err) {
        console.warn("[videoService] Poll error:", err);
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    return null;
  },

  async pollAllUntilComplete(
    videoIds: string[],
    onProgress: (completedCount: number, total: number, lastStatus: VideoVariantStatus) => void,
    intervalMs = 5000,
    maxAttempts = 120
  ): Promise<VideoVariantStatus[]> {
    const results: (VideoVariantStatus | null)[] = Array(videoIds.length).fill(null);
    const done: boolean[] = Array(videoIds.length).fill(false);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const pending = videoIds.filter((_, i) => !done[i]);
      if (pending.length === 0) break;

      await Promise.all(
        videoIds.map(async (id, i) => {
          if (done[i]) return;
          try {
            const res = await this.getVideoStatus(id);
            const data = res.data;
            results[i] = data;
            if (data.status === "completed" || data.status === "failed" || data.video_url) {
              done[i] = true;
            }
            const completedCount = done.filter(Boolean).length;
            onProgress(completedCount, videoIds.length, data);
          } catch (err) {
            console.warn(`[videoService] Poll error for ${id}:`, err);
          }
        })
      );

      if (done.every(Boolean)) break;
      await new Promise((r) => setTimeout(r, intervalMs));
    }

    return results.filter(Boolean) as VideoVariantStatus[];
  },
};

export default videoService;