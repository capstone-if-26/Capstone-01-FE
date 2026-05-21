"use client";

import styles from "../projects.module.css";

interface VideoThemeProps {
  selectedTheme: string;
  setSelectedTheme: React.Dispatch<React.SetStateAction<string>>;

  videoThemes: {
    id: string;
    desc: string;
  }[];

  handleNext: () => void;
  prevStep: () => void;
}

export default function VideoTheme({
  selectedTheme,
  setSelectedTheme,

  videoThemes,

  handleNext,
  prevStep,
}: VideoThemeProps) {
  return (
    <div className={styles.card}>
      <h2>Pilih Tema Video</h2>
      <p className={styles.subtitle}>Tentukan kerangka visual utama untuk video Anda.</p>
 
      <div className={styles.grid2}>
        {videoThemes.map((theme) => (
          <div
            key={theme.id}
            className={`${styles.selectCard} ${selectedTheme === theme.id ? styles.selected : ""}`}
            onClick={() => setSelectedTheme(theme.id)}
          >
            <h4>{theme.id}</h4>
            <p>{theme.desc}</p>
          </div>
        ))}
      </div>
 
      <div className={styles.footerActions}>
        <button className={styles.btnGhost} onClick={prevStep}>← Kembali</button>
        <button className={styles.btnPrimary} onClick={handleNext}>Lihat Ringkasan ✨</button>
      </div>
    </div>
  );
}