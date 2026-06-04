"use client";

import styles from "../projects.module.css";
import { VideoMode } from "@/services/video.service";

interface SummaryProps {
  briefRef: React.RefObject<HTMLDivElement | null>;
  institutionName: string;
  institutionHistory: string;
  schoolLevel: string;
  offeredDegrees: string;
  eventContent: string;
  videoDuration: string;
  videoMode: VideoMode;
  toneOfVoice: string;
  selectedKeyMessage: string;
  prompt: string;
  selectedTheme: string;
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

const MODE_CONFIG: Record<VideoMode, { label: string; credit: string; color: string }> = {
  'text-to-video':      { label: 'Text to Video',      credit: 'x1 kredit', color: '#0d6efd' },
  'image-to-video':     { label: 'Image to Video',     credit: 'x2 kredit', color: '#6f42c1' },
  'start-end-to-video': { label: 'Start-End to Video', credit: 'x3 kredit', color: '#d63384' },
};

// Satu baris label + value compact
function Row({ label, value, italic }: { label: string; value?: string | null; italic?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', marginBottom: '0.3rem' }}>
      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#868e96', whiteSpace: 'nowrap', minWidth: '90px' }}>{label}</span>
      <span style={{
        fontSize: '0.8rem', color: value ? '#212529' : '#adb5bd',
        fontStyle: italic && value ? 'italic' : 'normal',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
      }}>
        {value || '—'}
      </span>
    </div>
  );
}

// Chip kecil
function Chip({ label, color = '#0d6efd' }: { label: string; color?: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: '0.7rem', fontWeight: 600,
      color: color, background: color + '12', border: `1px solid ${color}28`,
      borderRadius: '20px', padding: '2px 9px', whiteSpace: 'nowrap',
    }}>{label}</span>
  );
}

// Section header mini
function Section({ label }: { label: string }) {
  return (
    <div style={{
      fontSize: '0.6rem', fontWeight: 800, color: '#0d6efd', textTransform: 'uppercase',
      letterSpacing: '0.07em', margin: '0.7rem 0 0.4rem 0',
      paddingBottom: '0.3rem', borderBottom: '1px solid #e9ecef',
    }}>{label}</div>
  );
}

// Teks panjang clamp 2 baris
function LongText({ value }: { value?: string | null }) {
  if (!value) return <span style={{ fontSize: '0.78rem', color: '#adb5bd', fontStyle: 'italic' }}>—</span>;
  return (
    <p style={{
      margin: 0, fontSize: '0.78rem', color: '#495057', lineHeight: 1.5,
      overflow: 'hidden', display: '-webkit-box',
      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
    }}>{value}</p>
  );
}

export default function ProjectSummary({
  briefRef,
  institutionName, institutionHistory, schoolLevel, offeredDegrees,
  eventContent, videoDuration, videoMode, toneOfVoice, selectedKeyMessage, prompt,
  selectedTheme,
  logoPreview, envPreview,
  editableCopywriting, setEditableCopywriting,
  editableHashtags, setEditableHashtags,
  isEditingCopywriting, setIsEditingCopywriting,
  isEditingHashtags, setIsEditingHashtags,
  prevStep, handleExportPDF, handleGenerate, isGenerating,
}: SummaryProps) {
  const mode = MODE_CONFIG[videoMode];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2>Ringkasan Proyek</h2>
        <p>Tinjau kembali semua pilihan sebelum diproses AI.</p>
      </div>

      <div ref={briefRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', alignItems: 'start' }}>

        {/* ══ KOLOM KIRI — Semua info brief ══ */}
        <div style={{ background: 'white', border: '1px solid #e9ecef', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Aset Visual — side by side compact */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.25rem' }}>
            {/* Logo */}
            <div>
              <p style={{ fontSize: '0.65rem', color: '#868e96', margin: '0 0 0.35rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Logo</p>
              <div style={{ height: '80px', background: '#f8f9fa', borderRadius: '8px', border: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {logoPreview
                  ? <img src={logoPreview} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: '4px' }} />
                  : <span style={{ fontSize: '0.62rem', color: '#ced4da', textAlign: 'center' }}>Belum ada</span>}
              </div>
            </div>
            {/* Env */}
            <div>
              <p style={{ fontSize: '0.65rem', color: '#868e96', margin: '0 0 0.35rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Foto Lingkungan</p>
              <div style={{ height: '80px', background: '#f8f9fa', borderRadius: '8px', border: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {envPreview
                  ? <img src={envPreview} alt="Lingkungan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '0.62rem', color: '#ced4da', textAlign: 'center' }}>Belum ada</span>}
              </div>
            </div>
          </div>

          {/* ── Step 1: Business Brief ── */}
          <Section label="Step 1 · Business Brief" />
          <Row label="Institusi"    value={institutionName} />
          <Row label="Jenjang"      value={schoolLevel} />
          <div style={{ marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#868e96', display: 'block', marginBottom: '0.2rem' }}>Program Studi</span>
            <LongText value={offeredDegrees} />
          </div>
          <div style={{ marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#868e96', display: 'block', marginBottom: '0.2rem' }}>Latar Belakang</span>
            <LongText value={institutionHistory} />
          </div>

          {/* ── Step 2: Creative Brief ── */}
          <Section label="Step 2 · Creative Brief" />
          <Row label="Event"        value={eventContent} />
          <Row label="Durasi / Scene" value={videoDuration} />

          {/* Mode Video */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#868e96', minWidth: '90px' }}>Mode Video</span>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              <Chip label={mode.label} color={mode.color} />
              <Chip label={mode.credit} color={mode.color} />
            </div>
          </div>

          {/* Tone + Tema dalam satu baris chip */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#868e96', minWidth: '90px' }}>Tone</span>
            <Chip label={toneOfVoice || '—'} color="#20c997" />
          </div>

          {/* Pesan Utama */}
          <div style={{ marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#868e96', display: 'block', marginBottom: '0.2rem' }}>Pesan Utama</span>
            <LongText value={selectedKeyMessage ? `"${selectedKeyMessage}"` : null} />
          </div>

          {prompt && (
            <div style={{ marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#868e96', display: 'block', marginBottom: '0.2rem' }}>Instruksi</span>
              <LongText value={prompt} />
            </div>
          )}

          {/* ── Step 3: Tema ── */}
          <Section label="Step 3 · Tema Video" />
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#868e96', minWidth: '90px' }}>Tema</span>
            <Chip label={selectedTheme || '—'} color="#fd7e14" />
          </div>

        </div>

        {/* ══ KOLOM KANAN — Copy, Hashtag, Aksi ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

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
                <textarea className={styles.editableTextarea} value={editableCopywriting} onChange={(e) => setEditableCopywriting(e.target.value)} />
                <button className={styles.btnSaveEdit} onClick={() => setIsEditingCopywriting(false)}>Selesai</button>
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
                <input type="text" className={styles.hashtagInput} value={editableHashtags} onChange={(e) => setEditableHashtags(e.target.value)} />
                <button className={styles.btnSaveEdit} onClick={() => setIsEditingHashtags(false)}>Selesai</button>
              </div>
            ) : (
              <div className={styles.hashtagDisplay}>{editableHashtags}</div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button className={styles.btnGhost} onClick={prevStep}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Edit Tema
            </button>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className={styles.btnOutline} onClick={handleExportPDF}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export PDF
              </button>
              <button className={styles.btnPrimary} onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? "Memproses..." : "Generate Storyboard"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
