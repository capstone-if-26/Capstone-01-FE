"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./storyboard.module.css";

import { storyboardService } from "@/services/storyboard.service";

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

  const handleFinalRender = () => {
    setView("output");

    setIsRendering(true);

    setRenderProgress(0);

    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          setIsRendering(false);

          return 100;
        }

        return prev + 15;
      });
    }, 400);
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