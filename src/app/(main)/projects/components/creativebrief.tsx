"use client";

import styles from "../projects.module.css";

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

    keyMessageOptions: Record<string, string[]>;

    handleNext: () => void;
    prevStep: () => void;
}

export default function CreativeBrief({
    eventContent,
    setEventContent,

    toneOfVoice,
    setToneOfVoice,

    selectedKeyMessage,
    setSelectedKeyMessage,

    videoDuration,
    setVideoDuration,

    prompt,
    setPrompt,

    keyMessageOptions,

    handleNext,
    prevStep,
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
            Durasi Video{" "}
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
        <button className={styles.btnGhost} onClick={prevStep}>← Kembali</button>
        <button className={styles.btnPrimary} onClick={handleNext}>Lanjut ke Tema Video →</button>
      </div>
    </div>
  );
}