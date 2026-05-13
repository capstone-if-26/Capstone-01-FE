"use client";

import React from "react";
import styles from "../projects.module.css";

interface SummaryProps {
  briefRef: React.RefObject<HTMLDivElement | null>;

  institutionName: string;
  schoolLevel: string;
  offeredDegrees: string;

  eventContent: string;
  videoDuration: string;

  selectedTheme: string;
  toneOfVoice: string;

  selectedKeyMessage: string;
  prompt: string;

  logoPreview: string | null;
  envPreview: string | null;

  editableCopywriting: string;
  setEditableCopywriting: React.Dispatch<React.SetStateAction<string>>;

  editableHashtags: string;
  setEditableHashtags: React.Dispatch<React.SetStateAction<string>>;

  isEditingCopywriting: boolean;
  setIsEditingCopywriting: React.Dispatch<React.SetStateAction<boolean>>;

  isEditingHashtags: boolean;
  setIsEditingHashtags: React.Dispatch<React.SetStateAction<boolean>>;

  prevStep: () => void;
  handleExportPDF: () => void;
  handleGenerate: () => void;
  isGenerating: boolean;
}

export default function ProjectSummary({
  briefRef,
  institutionName,
  schoolLevel,
  offeredDegrees,
  eventContent,
  videoDuration,
  selectedTheme,
  toneOfVoice,
  selectedKeyMessage,
  prompt,
  logoPreview,
  envPreview,
  editableCopywriting,
  setEditableCopywriting,
  editableHashtags,
  setEditableHashtags,
  isEditingCopywriting,
  setIsEditingCopywriting,
  isEditingHashtags,
  setIsEditingHashtags,
  prevStep,
  handleExportPDF,
  handleGenerate,
  isGenerating,
}: SummaryProps) {
  return (
    <div className={styles.card}>
      <div
        ref={briefRef}
        style={{ backgroundColor: "white", padding: "10px" }}
      >
        <h2 style={{ margin: "0 0 0.5rem 0" }}>
          Ringkasan Proyek
        </h2>

        <p className={styles.subtitle}>
          Tinjau kembali konten Anda sebelum diproses oleh AI.
        </p>

        {/* INFO BOX */}
        <div className={styles.infoBox}>
          <p>
            <b>Institusi:</b> {institutionName} - {schoolLevel}{" "}
            {offeredDegrees ? `(${offeredDegrees})` : ""}
          </p>

          <p>
            <b>Kebutuhan:</b> {eventContent} ({videoDuration})
          </p>

          <p>
            <b>Tema & Gaya:</b> {selectedTheme} / {toneOfVoice}
          </p>

          <p>
            <b>Pesan Utama:</b> "{selectedKeyMessage}"
          </p>

          <p>
            <b>Instruksi Tambahan:</b> {prompt}
          </p>
        </div>

        {/* IMAGES */}
        <div className={styles.editHeader} style={{ marginTop: "2rem" }}>
          <h4>GAMBAR INSTITUSI</h4>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo preview"
              style={{
                width: 150,
                height: 150,
                borderRadius: 8,
                border: "1px solid #ddd",
                objectFit: "contain",
              }}
            />
          )}

          {envPreview && (
            <img
              src={envPreview}
              alt="Environment preview"
              style={{
                width: 150,
                height: 150,
                borderRadius: 8,
                border: "1px solid #ddd",
                objectFit: "contain",
              }}
            />
          )}
        </div>

        {/* COPYWRITING */}
        <div className={styles.editHeader}>
          <h4>COPYWRITING CAPTION</h4>

          {!isEditingCopywriting && (
            <button
              className={styles.btnEdit}
              onClick={() => setIsEditingCopywriting(true)}
            >
              Edit
            </button>
          )}
        </div>

        {isEditingCopywriting ? (
          <>
            <textarea
              className={styles.editableTextarea}
              value={editableCopywriting}
              onChange={(e) =>
                setEditableCopywriting(e.target.value)
              }
            />
            <button
              className={styles.btnSaveEdit}
              onClick={() =>
                setIsEditingCopywriting(false)
              }
            >
              ✓ Selesai
            </button>
          </>
        ) : (
          <div className={styles.textDisplay}>
            {editableCopywriting}
          </div>
        )}

        {/* HASHTAGS */}
        <div
          className={styles.editHeader}
          style={{ marginTop: "2rem" }}
        >
          <h4>HASHTAGS</h4>

          {!isEditingHashtags && (
            <button
              className={styles.btnEdit}
              onClick={() =>
                setIsEditingHashtags(true)
              }
            >
              Edit
            </button>
          )}
        </div>

        {isEditingHashtags ? (
          <>
            <input
              type="text"
              className={styles.hashtagInput}
              value={editableHashtags}
              onChange={(e) =>
                setEditableHashtags(e.target.value)
              }
            />
            <button
              className={styles.btnSaveEdit}
              onClick={() =>
                setIsEditingHashtags(false)
              }
            >
              ✓ Selesai
            </button>
          </>
        ) : (
          <div
            className={styles.textDisplay}
            style={{
              color: "#0d6efd",
              fontWeight: 500,
            }}
          >
            {editableHashtags}
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div
        className={styles.footerActions}
        style={{ marginTop: "3rem" }}
      >
        <button
          className={styles.btnGhost}
          onClick={prevStep}
        >
          ← Edit Tema
        </button>

        <button
          className={styles.btnOutline}
          onClick={handleExportPDF}
        >
          Export ke PDF
        </button>

        <button
          className={styles.btnPrimary}
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating
            ? "Memproses..."
            : "Generate Storyboard"}
        </button>
      </div>
    </div>
  );
}