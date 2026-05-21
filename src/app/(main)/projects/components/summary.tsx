"use client";

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
    <div>
      <div className={styles.pageHeader}>
        <h2>Ringkasan Proyek</h2>
        <p>Tinjau kembali konten Anda sebelum diproses oleh AI.</p>
      </div>
 
      <div ref={briefRef}>
        <div className={styles.summaryLayout}>
          {/* ── LEFT: Preview Panel ── */}
          <div className={styles.summaryPreviewPanel}>
            {/* Logo card */}
            <div className={styles.summaryPreviewCard}>
              <div className={styles.summaryPreviewCardHeader}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Logo Institut</span>
              </div>
              <div className={styles.summaryLogoWrap}>
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo Institut" />
                ) : (
                  <div className={styles.summaryEmptyState}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    Belum ada logo
                  </div>
                )}
              </div>
            </div>
 
            {/* Environment photo card */}
            <div className={styles.summaryPreviewCard}>
              <div className={styles.summaryPreviewCardHeader}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                <span>Foto Lingkungan</span>
              </div>
              <div className={styles.summaryEnvWrap}>
                {envPreview ? (
                  <img src={envPreview} alt="Foto Lingkungan" />
                ) : (
                  <div className={styles.summaryEmptyState} style={{ minHeight: "160px" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    Belum ada foto
                  </div>
                )}
              </div>
            </div>
 
            {/* Info card — full width on mobile (via grid-column in CSS) */}
            <div className={styles.summaryInfoCard}>
              <div className={styles.summaryInfoRow}>
                <span className={styles.summaryInfoLabel}>Institusi</span>
                <span className={styles.summaryInfoValue}>
                  {institutionName}
                  {schoolLevel ? ` · ${schoolLevel}` : ""}
                  {offeredDegrees ? ` (${offeredDegrees})` : ""}
                </span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryInfoRow}>
                <span className={styles.summaryInfoLabel}>Kebutuhan</span>
                <span className={styles.summaryInfoValue}>
                  {eventContent} {videoDuration ? `(${videoDuration})` : ""}
                </span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryInfoRow}>
                <span className={styles.summaryInfoLabel}>Tema & Gaya</span>
                <span className={styles.summaryInfoValue}>{selectedTheme} / {toneOfVoice}</span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryInfoRow}>
                <span className={styles.summaryInfoLabel}>Pesan Utama</span>
                <span className={styles.summaryInfoValue} style={{ fontStyle: "italic" }}>
                  &ldquo;{selectedKeyMessage}&rdquo;
                </span>
              </div>
              {prompt && (
                <>
                  <div className={styles.summaryDivider} />
                  <div className={styles.summaryInfoRow}>
                    <span className={styles.summaryInfoLabel}>Instruksi Tambahan</span>
                    <span className={styles.summaryInfoValue}>{prompt}</span>
                  </div>
                </>
              )}
            </div>
          </div>
 
          {/* ── RIGHT: Edit Panel ── */}
          <div className={styles.summaryEditPanel}>
            {/* Copywriting */}
            <div className={styles.editSectionCard}>
              <div className={styles.editHeader}>
                <h4>Copywriting Caption</h4>
                {!isEditingCopywriting && (
                  <button className={styles.btnEdit} onClick={() => setIsEditingCopywriting(true)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Edit
                  </button>
                )}
              </div>
              {isEditingCopywriting ? (
                <div>
                  <textarea
                    className={styles.editableTextarea}
                    value={editableCopywriting}
                    onChange={(e) => setEditableCopywriting(e.target.value)}
                  />
                  <button className={styles.btnSaveEdit} onClick={() => setIsEditingCopywriting(false)}>
                    ✓ Selesai
                  </button>
                </div>
              ) : (
                <div className={styles.textDisplay}>{editableCopywriting}</div>
              )}
            </div>
 
            {/* Hashtags */}
            <div className={styles.editSectionCard}>
              <div className={styles.editHeader}>
                <h4>Hashtags</h4>
                {!isEditingHashtags && (
                  <button className={styles.btnEdit} onClick={() => setIsEditingHashtags(true)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Edit
                  </button>
                )}
              </div>
              {isEditingHashtags ? (
                <div>
                  <input
                    type="text"
                    className={styles.hashtagInput}
                    value={editableHashtags}
                    onChange={(e) => setEditableHashtags(e.target.value)}
                  />
                  <button className={styles.btnSaveEdit} onClick={() => setIsEditingHashtags(false)}>
                    ✓ Selesai
                  </button>
                </div>
              ) : (
                <div className={styles.hashtagDisplay}>{editableHashtags}</div>
              )}
            </div>
 
            {/* Action Buttons */}
            <div className={styles.summaryActionRow}>
              <button className={styles.btnGhost} onClick={prevStep}>
                ← Edit Tema
              </button>
              <div className={styles.summaryActions}>
                <button className={styles.btnOutline} onClick={handleExportPDF}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export ke PDF
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Memproses..." : "Generate Storyboard 🚀"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}