"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./storyboard.module.css";

import { storyboardService } from "@/services/storyboard.service";
import { videoService, VideoVariantStatus } from "@/services/video.service";

interface Scene {
  id: string;
  time: string;
  title: string;
  duration: string;
  status: string;
  narration: string;
  visual: string;
  thumbnail: string | null;
  isEditing: boolean;
  durationNum: number;
}

// ─── Status label mapping ─────────────────────────────────────────────────────
const STATUS_LABELS: Record<string, string> = {
  queued: "Antrian…",
  generating_assets: "Mengirim ke AI Wavespeed…",
  processing: "Wavespeed sedang generate…",
  stitching_video: "Menggabungkan scene…",
  completed: "Selesai!",
  failed: "Gagal — coba lagi",
  pending: "Mempersiapkan…",
};

// ─── Progress percentage mapping ─────────────────────────────────────────────
const STATUS_PROGRESS: Record<string, number> = {
  pending: 5,
  queued: 10,
  generating_assets: 30,
  processing: 55,
  stitching_video: 80,
  completed: 100,
  failed: 100,
};

function StoryboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [scenes, setScenes] = useState<Scene[]>([]);
  const [projectMeta, setProjectMeta] = useState({
    title: "Memuat Project...",
    duration: "00:00",
  });
  const [view, setView] = useState<"list" | "storyboard" | "output" | null>(null);

  // Rendering / output state
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStatus, setRenderStatus] = useState("");
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* =========================
     FETCH STORYBOARD
  ========================= */

  useEffect(() => {
    const storyboardId = searchParams.get("storyboardId");
    if (!storyboardId) {
      setView("list");
      return;
    }

    const fetchStoryboard = async () => {
      try {
        const res = await storyboardService.getStoryboardDetail(storyboardId);
        const storyboard = res.data;

        setProjectMeta({
          title: storyboard.title,
          duration: `${storyboard.total_duration}s`,
        });

        const mappedScenes: Scene[] = storyboard.sections.map(
          (section: any, index: number) => {
            let narrationText = section.content;
            let visualText = section.content;

            try {
              // Extract from JSON string if formatted that way
              const parsed = JSON.parse(section.content);
              if (parsed.narration) narrationText = parsed.narration;
              if (parsed.visual) visualText = parsed.visual;
            } catch (e) {
              // Fallback to raw content if not JSON
            }

            return {
              id: String(index + 1).padStart(2, "0"),
              time: `00:00:${String(index * section.duration).padStart(2, "0")}`,
              title: section.section_type,
              duration: `00:${String(section.duration).padStart(2, "0")}`,
              status: "Ready",
              narration: narrationText,
              visual: visualText,
              thumbnail: null,
              isEditing: false,
              durationNum: section.duration,
            };
          }
        );

        setScenes(mappedScenes);
        setView("storyboard");
      } catch (err) {
        console.error(err);
        setView("list");
      }
    };

    fetchStoryboard();
  }, [searchParams]);

  /* =========================
     STOP POLLING ON UNMOUNT
  ========================= */
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  /* =========================
     EDIT SCENE
  ========================= */

  const toggleEditScene = (id: string) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEditing: !s.isEditing } : s))
    );
  };

  const handleSceneChange = (
    id: string,
    field: "narration" | "visual",
    value: string
  ) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  /* =========================
     POLL VARIANT STATUS
  ========================= */

  const startPolling = (vid: string) => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      try {
        const res = await videoService.getVideoStatus(vid);
        const data: VideoVariantStatus = res.data;

        const progress = STATUS_PROGRESS[data.status] ?? 50;
        const label = STATUS_LABELS[data.status] ?? `Status: ${data.status}`;

        setRenderProgress(progress);
        setRenderStatus(label);

        if (data.status === "completed" || data.video_url) {
          clearInterval(pollRef.current!);
          setIsRendering(false);
          setRenderProgress(100);
          setRenderStatus("Video siap diunduh!");
          setVideoURL(data.video_url || null);

          // Fetch preview and download URLs
          try {
            const previewRes = await videoService.getVideoPreviewUrl(vid);
            setPreviewURL(previewRes.data.preview_url);
          } catch (err) {
            console.warn("[Poll] Preview URL fetch failed:", err);
            setPreviewURL(data.video_url || null);
          }

          try {
            const downloadRes = await videoService.getVideoDownloadUrl(vid);
            setDownloadURL(downloadRes.data.download_url);
          } catch (err) {
            console.warn("[Poll] Download URL fetch failed:", err);
            setDownloadURL(data.video_url || null);
          }
        } else if (data.status === "failed") {
          clearInterval(pollRef.current!);
          setIsRendering(false);
          setRenderError("Gagal generate video. Silakan coba lagi.");
        }
      } catch (err) {
        console.warn("[Poll] Error:", err);
      }
    }, 5000);
  };

  /* =========================
     FINAL RENDER
  ========================= */

  const handleFinalRender = async () => {
    const storyboardId = searchParams.get("storyboardId");
    const projectId = searchParams.get("projectId");
    if (!storyboardId || !projectId) return;

    setView("output");
    setIsRendering(true);
    setRenderProgress(5);
    setRenderStatus("Mengirim ke backend…");
    setVideoURL(null);
    setPreviewURL(null);
    setDownloadURL(null);
    setRenderError(null);
    setVariantId(null);

    try {
      // 0. Save current scenes back to storyboard before generating
      setRenderStatus("Menyimpan teks storyboard...");
      const updatedSections = scenes.map(s => ({
        section_type: s.title,
        content: JSON.stringify({ narration: s.narration, visual: s.visual }),
        duration: s.durationNum
      }));
      await storyboardService.updateStoryboard(storyboardId, {
        sections: updatedSections
      });

      // 1. Trigger generation — backend creates GenerationJob + VideoVariant
      setRenderStatus("Mengirim ke backend…");
      const res = await videoService.generateVideo({
        project_id: projectId,
        storyboard_id: storyboardId,
      });

      console.log("[Render] Job created:", res);
      setRenderStatus("Job diterima. Mencari variant ID…");
      setRenderProgress(15);

      // 2. Find the variant ID for the storyboard (created by backend)
      let foundVariantId: string | null = null;
      for (let attempt = 0; attempt < 10; attempt++) {
        await new Promise((r) => setTimeout(r, 2000));
        try {
          const varRes = await videoService.getStoryboardVariants(storyboardId);
          if (varRes.data && varRes.data.length > 0) {
            foundVariantId = varRes.data[0].id;
            break;
          }
        } catch (_) {}
      }

      if (!foundVariantId) {
        throw new Error("Variant ID tidak ditemukan setelah 20 detik.");
      }

      setVariantId(foundVariantId);
      setRenderStatus("Wavespeed sedang generate video…");
      setRenderProgress(25);

      // 3. Start polling variant status
      startPolling(foundVariantId);
    } catch (err: any) {
      console.error("[Render] FAILED:", err);
      // Extraksi pesan spesifik dari backend (GORM/Handler error)
      const backendMessage = err?.response?.data?.message || err?.message || "Gagal memulai proses render video.";
      console.error("Backend Error Details:", err?.response?.data);
      setRenderError(`Backend Error: ${backendMessage}`);
      setIsRendering(false);
      setRenderProgress(0);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (view === null) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          flexDirection: "column",
          gap: "1rem",
          color: "#6c757d",
        }}
      >
        <div
          className={styles.spinnerSmall}
          style={{
            width: "32px",
            height: "32px",
            border: "3px solid #e9ecef",
            borderTopColor: "#0d6efd",
          }}
        />
        Memuat Project Storyboard...
      </div>
    );
  }

  return (
    <div className={styles.container}>

      {view === "storyboard" && (
        <>
          <header className={styles.headerInfo}>
            <button
              className={styles.btnGhost}
              onClick={() => setView("list")}
              style={{ marginBottom: "1rem", padding: 0 }}
            >
              ← Kembali ke Daftar
            </button>

            <h1>Storyboard &amp; Scene Timeline</h1>

            <p>
              Project: <b>{projectMeta.title}</b> &bull; {projectMeta.duration}
            </p>
          </header>

          <div className={styles.timelineVisualizer}>
            <div className={styles.timelineTrack}></div>
            {scenes.map((scene, idx) => (
              <div 
                key={`tl-${scene.id}`} 
                className={styles.timelineNode}
                style={{ left: `${(idx / (scenes.length - 1 || 1)) * 100}%` }}
                title={scene.title}
              >
                <div className={styles.timelinePoint}></div>
                <span className={styles.timelineLabel}>{scene.id}</span>
              </div>
            ))}
          </div>

          <div className={styles.timeline}>
            {scenes.map((scene) => (
              <div key={scene.id} className={styles.sceneItem}>
                <div className={styles.sceneNumber}>{scene.id}</div>
                <div className={styles.sceneTime}>{scene.time}</div>

                <div className={styles.sceneCard}>
                  <div
                    className={styles.contentSection}
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      className={styles.sceneTitle}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <h3>{scene.title}</h3>
                        {scene.status === "Ready" && (
                          <span style={{ color: "#0d6efd" }}>✓</span>
                        )}
                      </div>

                      <div className={styles.cardActions} style={{ margin: 0 }}>
                        {scene.isEditing ? (
                          <button
                            className={styles.btnActionSave}
                            onClick={() => toggleEditScene(scene.id)}
                          >
                            ✓ Simpan Teks
                          </button>
                        ) : (
                          <button
                            className={styles.btnAction}
                            onClick={() => toggleEditScene(scene.id)}
                          >
                            Edit Teks
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={styles.sectionLabel}>AI NARRATION</div>

                    {scene.isEditing ? (
                      <textarea
                        className={`${styles.editArea} ${styles.editAreaNarrative}`}
                        value={scene.narration}
                        onChange={(e) =>
                          handleSceneChange(scene.id, "narration", e.target.value)
                        }
                      />
                    ) : (
                      <p className={styles.narrationText}>{scene.narration}</p>
                    )}

                    <div className={styles.sectionLabel}>VISUAL PROMPT</div>

                    {scene.isEditing ? (
                      <textarea
                        className={`${styles.editArea} ${styles.editAreaVisual}`}
                        value={scene.visual}
                        onChange={(e) =>
                          handleSceneChange(scene.id, "visual", e.target.value)
                        }
                      />
                    ) : (
                      <p className={styles.visualDescription}>{scene.visual}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.bottomActionArea}>
            <button className={styles.btnPrimaryLarge} onClick={handleFinalRender}>
              Combine &amp; Render Final Video ✨
            </button>
          </div>
        </>
      )}

      {view === "output" && (
        <div className={styles.outputArea}>
          <div className={styles.progressCard}>
            <div className={styles.progressIcon}>
              {renderError ? "❌" : isRendering ? "🎬" : "✅"}
            </div>

            <div className={styles.progressInfo}>
              <h3>
                {renderError
                  ? "Generate Gagal"
                  : isRendering
                  ? "Sedang Generate Video via Wavespeed AI…"
                  : "Video Siap Diunduh!"}
              </h3>

              <p>
                {renderError
                  ? renderError
                  : isRendering
                  ? renderStatus || "AI sedang merakit scene storyboard Anda menjadi video sinematik."
                  : "Proses rendering selesai. Anda dapat meninjau hasilnya di bawah ini."}
              </p>

              {!renderError && (
                <div className={styles.progressBarWrapper}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${renderProgress}%` }}
                    />
                  </div>
                  <span>{renderProgress}%</span>
                </div>
              )}
            </div>
          </div>

          {renderError && (
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem" }}>
              <button className={styles.btnOutline} onClick={() => setView("storyboard")}>
                ← Kembali ke Storyboard
              </button>
              <button className={styles.btnPrimary} onClick={handleFinalRender}>
                Coba Lagi
              </button>
            </div>
          )}

          {!isRendering && !renderError && videoURL && (
            <div className={styles.resultContainer}>
              <div className={styles.videoPlayer}>
                <video
                  controls
                  autoPlay={false}
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    maxHeight: "480px",
                    background: "#000",
                  }}
                  src={previewURL ?? videoURL ?? undefined}
                >
                  Browser Anda tidak mendukung tag video.
                </video>
              </div>

              <div className={styles.videoActions}>
                <button
                  className={styles.btnOutline}
                  onClick={() => setView("storyboard")}
                >
                  Edit Storyboard
                </button>
                <a
                  href={downloadURL || videoURL}
                  download="generated-video.mp4"
                  className={styles.btnPrimary}
                  style={{ textDecoration: "none" }}
                >
                  Download MP4
                </a>
              </div>
            </div>
          )}

          {!isRendering && !renderError && !videoURL && (
            <div className={styles.resultContainer}>
              <div className={styles.videoPlayer}>
                <div className={styles.playBtnLarge}>▶</div>
                <div className={styles.videoControls}>
                  <span>00:00 / {projectMeta.duration}</span>
                </div>
              </div>
              <div className={styles.videoActions}>
                <button className={styles.btnOutline} onClick={() => setView("storyboard")}>
                  Edit Storyboard
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={() => alert("Video URL belum tersedia.")}
                >
                  Download MP4
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StoryboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoryboardContent />
    </Suspense>
  );
}