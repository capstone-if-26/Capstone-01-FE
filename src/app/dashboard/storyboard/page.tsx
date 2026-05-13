"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./storyboard.module.css";

import { storyboardService } from "@/services/storyboard.service";
import { generateVideoService } from "@/services/ai.service";

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
}

function StoryboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [scenes, setScenes] = useState<Scene[]>([]);

  const [projectMeta, setProjectMeta] = useState({
    title: "Memuat Project...",
    duration: "00:00",
  });

  const [view, setView] = useState<
    "list" | "storyboard" | "output" | null
  >(null);

  const [isRendering, setIsRendering] = useState(false);

  const [renderProgress, setRenderProgress] = useState(0);

  /* =========================
     FETCH STORYBOARD
  ========================= */

useEffect(() => {
  const storyboardId =
    searchParams.get("storyboardId");

  if (!storyboardId) {
    setView("list");
    return;
  }

  const fetchStoryboard = async () => {
    try {
      const res =
        await storyboardService.getStoryboardDetail(
          storyboardId
        );

      console.log("STORYBOARD DETAIL:", res);

      const storyboard = res.data;

      setProjectMeta({
        title: storyboard.title,
        duration: `${storyboard.total_duration}s`,
      });

      const mappedScenes: Scene[] =
        storyboard.sections.map(
          (section: any, index: number) => ({
            id: String(index + 1).padStart(2, "0"),

            time: `00:00:${String(
              index * section.duration
            ).padStart(2, "0")}`,

            title: section.section_type,

            duration: `00:${String(
              section.duration
            ).padStart(2, "0")}`,

            status: "Ready",

            narration: section.content,

            visual: section.content,

            thumbnail: null,

            isEditing: false,
          })
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
     EDIT SCENE
  ========================= */

  const toggleEditScene = (id: string) => {
    setScenes((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, isEditing: !s.isEditing }
          : s
      )
    );
  };

  const handleSceneChange = (
    id: string,
    field: "narration" | "visual",
    value: string
  ) => {
    setScenes((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, [field]: value }
          : s
      )
    );
  };

  /* =========================
     FINAL RENDER
  ========================= */

const handleFinalRender = async () => {
  try {
    setView("output");

    setIsRendering(true);

    setRenderProgress(10);

    const storyboardId =
      searchParams.get("storyboardId");

    if (!storyboardId) return;

    setRenderProgress(30);

    // generate video
    const generateRes =
      await generateVideoService.generate({
        storyboard_id: storyboardId,
      });

    setRenderProgress(70);

    // ambil hasil final video
    const result =
      await generateVideoService.getVideoResult(
        generateRes.url
      );

    setVideoUrl(result.url);

    setRenderProgress(100);

    setIsRendering(false);
  } catch (err) {
    console.error(err);

    setIsRendering(false);
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
              style={{
                marginBottom: "1rem",
                padding: 0,
              }}
            >
              ← Kembali ke Daftar
            </button>

            <h1>Storyboard & Scene Timeline</h1>

            <p>
              Project: <b>{projectMeta.title}</b> •{" "}
              {projectMeta.duration}
            </p>
          </header>

          <div className={styles.timeline}>
            {scenes.map((scene) => (
              <div
                key={scene.id}
                className={styles.sceneItem}
              >
                <div className={styles.sceneNumber}>
                  {scene.id}
                </div>

                <div className={styles.sceneTime}>
                  {scene.time}
                </div>

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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <h3>{scene.title}</h3>

                        {scene.status === "Ready" && (
                          <span
                            style={{ color: "#0d6efd" }}
                          >
                            ✓
                          </span>
                        )}
                      </div>

                      <div
                        className={styles.cardActions}
                        style={{ margin: 0 }}
                      >
                        {scene.isEditing ? (
                          <button
                            className={
                              styles.btnActionSave
                            }
                            onClick={() =>
                              toggleEditScene(scene.id)
                            }
                          >
                            ✓ Simpan Teks
                          </button>
                        ) : (
                          <button
                            className={styles.btnAction}
                            onClick={() =>
                              toggleEditScene(scene.id)
                            }
                          >
                            Edit Teks
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={styles.sectionLabel}>
                      AI NARRATION
                    </div>

                    {scene.isEditing ? (
                      <textarea
                        className={`${styles.editArea} ${styles.editAreaNarrative}`}
                        value={scene.narration}
                        onChange={(e) =>
                          handleSceneChange(
                            scene.id,
                            "narration",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <p className={styles.narrationText}>
                        {scene.narration}
                      </p>
                    )}

                    <div className={styles.sectionLabel}>
                      VISUAL PROMPT
                    </div>

                    {scene.isEditing ? (
                      <textarea
                        className={`${styles.editArea} ${styles.editAreaVisual}`}
                        value={scene.visual}
                        onChange={(e) =>
                          handleSceneChange(
                            scene.id,
                            "visual",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <p
                        className={
                          styles.visualDescription
                        }
                      >
                        {scene.visual}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.bottomActionArea}>
            <button
              className={styles.btnPrimaryLarge}
              onClick={handleFinalRender}
            >
              Combine & Render Final Video ✨
            </button>
          </div>
        </>
      )}

      {view === "output" && (
  <div className={styles.outputContainer}>
    <header className={styles.headerInfo}>
      <button
        className={styles.btnGhost}
        onClick={() => setView("storyboard")}
        style={{
          marginBottom: "1rem",
          padding: 0,
        }}
      >
        ← Kembali ke Storyboard
      </button>

      <h1>Final Video Output</h1>

      <p>
        Project: <b>{projectMeta.title}</b>
      </p>
    </header>

    {isRendering ? (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
          marginTop: "3rem",
        }}
      >
        <div className={styles.spinnerSmall} />

        <div>
          Rendering Video... {renderProgress}%
        </div>

        <div
          style={{
            width: "300px",
            height: "10px",
            background: "#eee",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${renderProgress}%`,
              height: "100%",
              background: "#0d6efd",
              transition: "0.3s",
            }}
          />
        </div>
      </div>
    ) : videoUrl ? (
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <video
          controls
          autoPlay
          className={styles.finalVideo}
          style={{
            width: "100%",
            maxWidth: "900px",
            borderRadius: "20px",
            background: "#000",
          }}
        >
          <source
            src={videoUrl}
            type="video/mp4"
          />
        </video>

        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btnPrimaryLarge}
        >
          Download Video
        </a>
      </div>
    ) : (
      <p>Video gagal dimuat.</p>
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