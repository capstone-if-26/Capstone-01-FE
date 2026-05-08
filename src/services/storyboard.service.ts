import api from "@/lib/axios";

/* =========================
   TYPES
========================= */

export interface StoryboardSection {
  id: string;
  storyboard_id: string;
  user_id: string;
  section_type: "hook" | "value" | "cta";
  content: string;
  duration: number;
  created_at: string;
  updated_at: string;
}

export interface Storyboard {
  [x: string]: any;
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  description: string;
  total_duration: number;
  style: string;
  is_selected: boolean;
  created_at: string;
  updated_at: string;
  sections: StoryboardSection[];
}

/* =========================
   API RESPONSES
========================= */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* =========================
   PAYLOADS
========================= */

export interface GenerateStoryboardTemplatesPayload {
  project_id: string;
  video_duration: number;
}

export interface CreateManualStoryboardPayload {
  project_id: string;
  title: string;
  description?: string;
  style?: string;
  sections: {
    section_type: "hook" | "value" | "cta";
    content: string;
    duration: number;
  }[];
}

export interface SelectStoryboardPayload {
  storyboard_id: string;
}

export interface UpdateStoryboardPayload {
  title?: string;
  description?: string;
  style?: string;
  sections?: {
    id?: string;
    section_type: "hook" | "value" | "cta";
    content: string;
    duration: number;
  }[];
}

/* =========================
   SERVICE
========================= */

export const storyboardService = {
  /**
   * Generate storyboard templates
   * POST /api/storyboard/templates/generate
   */
  async generateStoryboardTemplates(
    payload: GenerateStoryboardTemplatesPayload
  ): Promise<
    ApiResponse<{
      project_id: string;
      video_duration: number;
      templates: Storyboard[];
      count: number;
    }>
  > {
    const response = await api.post(
      "/api/storyboard/templates/generate",
      payload
    );

    return response.data;
  },

  /**
   * Create manual storyboard
   * POST /api/storyboard/create
   */
  async createManualStoryboard(
    payload: CreateManualStoryboardPayload
  ): Promise<ApiResponse<Storyboard>> {
    const response = await api.post(
      "/api/storyboard/create",
      payload
    );

    return response.data;
  },

  /**
   * Get all storyboards by project
   * GET /api/storyboard/:project_id
   */
  async getStoryboardbyProjectId(
    projectId: string
  ): Promise<ApiResponse<Storyboard[]>> {
    const response = await api.get(
      `/api/storyboard/${projectId}`
    );

    return response.data;
  },

  /**
   * Get single storyboard detail
   * GET /api/storyboard/detail/:storyboard_id
   */
  async getStoryboardDetail(
    storyboardId: string
  ): Promise<ApiResponse<Storyboard>> {
    const response = await api.get(
      `/api/storyboard/detail/${storyboardId}`
    );

    return response.data;
  },

  /**
   * Select storyboard
   * POST /api/storyboard/select
   */
  async selectStoryboard(
    payload: SelectStoryboardPayload
  ): Promise<ApiResponse<Storyboard>> {
    const response = await api.post(
      "/api/storyboard/select",
      payload
    );

    return response.data;
  },

  /**
   * Update storyboard
   * PUT /api/storyboard/:storyboard_id
   */
  async updateStoryboard(
    storyboardId: string,
    payload: UpdateStoryboardPayload
  ): Promise<ApiResponse<Storyboard>> {
    const response = await api.put(
      `/api/storyboard/${storyboardId}`,
      payload
    );

    return response.data;
  },

  /**
   * Get storyboard sections
   * GET /api/storyboard/:storyboard_id/sections
   */
  async getStoryboardSections(
    storyboardId: string
  ): Promise<ApiResponse<StoryboardSection[]>> {
    const response = await api.get(
      `/api/storyboard/${storyboardId}/sections`
    );

    return response.data;
  },

  /**
   * Delete storyboard
   * DELETE /api/storyboard/:storyboard_id
   */
  async deleteStoryboard(
    storyboardId: string
  ): Promise<ApiResponse<null>> {
    const response = await api.delete(
      `/api/storyboard/${storyboardId}`
    );

    return response.data;
  },

  /**
   * Restore storyboard
   * POST /api/storyboard/:storyboard_id/restore
   */
  async restoreStoryboard(
    storyboardId: string
  ): Promise<ApiResponse<null>> {
    const response = await api.post(
      `/api/storyboard/${storyboardId}/restore`
    );

    return response.data;
  },
};

export default storyboardService;