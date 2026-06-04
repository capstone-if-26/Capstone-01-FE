"use client";

import styles from "../projects.module.css";
import { VideoMode } from "@/services/video.service";

interface CreativeBriefProps {
    eventContent: string;
    setEventContent: React.Dispatch<React.SetStateAction<string>>;

    toneOfVoice: string;
    setToneOfVoice: React.Dispatch<React.SetStateAction<string>>;

    selectedKeyMessage: string;
    setSelectedKeyMessage: React.Dispatch<React.SetStateAction<string>>;

    videoDuration: string;
    setVideoDuration: React.Dispatch<React.SetStateAction<string>>;

    prompt: string;
    setPrompt: React.Dispatch<React.SetStateAction<string>>;

    videoMode: VideoMode;
    setVideoMode: React.Dispatch<React.SetStateAction<VideoMode>>;

    keyMessageOptions: Record<string, string[]>;

    handleNext: () => void;
    prevStep: () => void;
}

const VIDEO_MODES: { value: VideoMode; label: string; desc: string; credits: string }[] = [
  { value: 'text-to-video',      label: 'Text to Video',      desc: 'Teks → Video',                credits: 'x1 kredit' },
  { value: 'image-to-video',     label: 'Image to Video',     desc: 'Logo + Teks → Video',         credits: 'x2 kredit' },
  { value: 'start-end-to-video', label: 'Start-End to Video', desc: 'Logo & Foto + Teks → Video',  credits: 'x3 kredit' },
];

export default function CreativeBrief({
    eventContent, setEventContent,
    toneOfVoice, setToneOfVoice,
    selectedKeyMessage, setSelectedKeyMessage,
    videoDuration, setVideoDuration,
    prompt, setPrompt,
    videoMode, setVideoMode,
    keyMessageOptions,
    handleNext, prevStep,
}: CreativeBriefProps) {
  return (
    <div className={styles.card}>
      <h2>Creative Brief</h2>
      <p className={styles.subtitle}>Tentukan tujuan pemasaran dan gaya penyampaian konten.</p>

      {/* Kebutuhan + Durasi */}
      <div className={styles.grid2}>
        <div className={styles.formGroup}>
          <label>
            Kebutuhan Konten (Event){" "}
            <span style={{ color: "var(--color-error)" }}>*</span>
          </label>
          <select
            className={styles.select}
            value={eventContent}
            onChange={(e) => setEventContent(e.target.value)}
          >
            <option value="">-- Pilih Kebutuhan --</option>
            <option value="Penerimaan Mahasiswa Baru">Penerimaan Mahasiswa Baru</option>
            <option value="Dies Natalis / Ulang Tahun">Dies Natalis / Ulang Tahun</option>
            <option value="Promosi Beasiswa">Promosi Beasiswa</option>
            <option value="Pengenalan Kehidupan Kampus">Pengenalan Kehidupan Kampus (PKKMB)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>
            Durasi Per Scene{" "}
            <span style={{ color: "var(--color-error)" }}>*</span>
          </label>
          <select
            className={styles.select}
            value={videoDuration}
            onChange={(e) => setVideoDuration(e.target.value)}
          >
            <option value="">-- Pilih Durasi --</option>
            <option value="Short (4 detik)">Short (4 detik)</option>
            <option value="Medium (6 detik)">Medium (6 detik)</option>
            <option value="Long (8 detik)">Long (8 detik)</option>
          </select>
        </div>
      </div>

      {/* Mode Generasi Video */}
      <div className={styles.formGroup}>
        <label>Mode Generasi Video</label>
        <p className={styles.messageHint}>
          Image to Video menggunakan logo sebagai frame awal. Start-End menggunakan logo + foto lingkungan kampus.
        </p>
        <div className={styles.grid4} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {VIDEO_MODES.map((mode) => (
            <div
              key={mode.value}
              className={`${styles.selectCard} ${videoMode === mode.value ? styles.selected : ""}`}
              onClick={() => setVideoMode(mode.value)}
              style={{ cursor: 'pointer' }}
            >
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>{mode.label}</h4>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.78rem', color: '#6c757d' }}>{mode.desc}</p>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: videoMode === mode.value ? '#0d6efd' : '#adb5bd' }}>{mode.credits}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tone of Voice */}
      <div className={styles.formGroup}>
        <label>Tone of Voice (Gaya Bahasa Brand)</label>
        <div className={styles.grid4}>
          {Object.keys(keyMessageOptions).map((tone) => (
            <div
              key={tone}
              className={`${styles.selectCard} ${toneOfVoice === tone ? styles.selected : ""}`}
              onClick={() => {
                setToneOfVoice(tone);
                setSelectedKeyMessage("");
              }}
            >
              <h4>{tone}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Key Message */}
      <div className={styles.formGroup}>
        <label>
          Pilihan Pesan Utama (Key Message){" "}
          <span style={{ color: "var(--color-error)" }}>*</span>
        </label>
        <p className={styles.messageHint}>
          Pilih salah satu pesan yang paling sesuai dengan target audiens Anda:
        </p>
        {keyMessageOptions[toneOfVoice].map((msg, i) => (
          <div
            key={i}
            className={`${styles.messageOption} ${selectedKeyMessage === msg ? styles.messageSelected : ""}`}
            onClick={() => setSelectedKeyMessage(msg)}
          >
            <input type="radio" checked={selectedKeyMessage === msg} readOnly />
            <span>{msg}</span>
          </div>
        ))}
      </div>

      {/* Prompt Tambahan */}
      <div className={styles.formGroup}>
        <label>
          Specific Requirements / Prompt Tambahan{" "}
          <span className={styles.labelOptional}>(Opsional)</span>
        </label>
        <textarea
          className={styles.textarea}
          placeholder="Contoh: Gunakan backsound yang energik, fokuskan visual pada fasilitas gedung A..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className={styles.footerActions}>
        <button className={styles.btnGhost} onClick={prevStep}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Kembali
        </button>
        <button className={styles.btnPrimary} onClick={handleNext}>Lanjut ke Tema Video</button>
      </div>
    </div>
  );
}
