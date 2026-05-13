"use client";

import React from "react";
import styles from "../projects.module.css";

interface BusinessBriefProps {
  institutionName: string;
  setInstitutionName: (value: string) => void;

  institutionHistory: string;
  setInstitutionHistory: (value: string) => void;

  schoolLevel: string;
  setSchoolLevel: (value: string) => void;

  offeredDegrees: string;
  setOfferedDegrees: (value: string) => void;

  logoPreview: string | null;
  envPreview: string | null;

  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEnvChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  handleNext: () => void;

  file?: File | null;
}

export default function BusinessBrief({
  institutionName,
  setInstitutionName,
  institutionHistory,
  setInstitutionHistory,
  schoolLevel,
  setSchoolLevel,
  offeredDegrees,
  setOfferedDegrees,
  logoPreview,
  envPreview,
  handleLogoChange,
  handleEnvChange,
  handleFileChange,
  handleNext,
  file,
}: BusinessBriefProps) {
    return (
        <div>
            <div className={styles.pageHeader}>
            <h2>Business Brief</h2>
            <p>Informasi fundamental mengenai profil institusi Anda.</p>
            </div>

            <div className={styles.twoColLayout}>
            {/* ── LEFT: Upload Panel ── */}
            <div className={styles.uploadPanel}>
                <p className={styles.uploadSectionLabel}>Aset Visual</p>

                <div className={styles.visualUploadStack}>
                {/* Logo Upload */}
                <div className={styles.uploadCard}>
                    <div className={styles.uploadCardHeader}>
                    <div>
                        <h4>
                        Logo Institut{" "}
                        <span style={{ color: "var(--color-error)" }}>*</span>
                        </h4>
                        <p>Format PNG/JPG. Tampil di ringkasan proyek.</p>
                    </div>
                    </div>

                    {logoPreview ? (
                    <div className={styles.uploadPreviewWrap}>
                        <img
                        src={logoPreview}
                        alt="Logo preview"
                        className={styles.uploadPreviewImg}
                        />

                        <label className={styles.uploadPreviewChange}>
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>

                        Ganti Foto

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                        />
                        </label>
                    </div>
                    ) : (
                    <label className={styles.dropZone}>
                        <div className={styles.dropZoneIcon}>
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        </div>

                        <span className={styles.dropZoneText}>
                        Klik untuk upload logo
                        </span>

                        <span className={styles.dropZoneHint}>
                        PNG, JPG hingga 5MB
                        </span>

                        <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        />
                    </label>
                    )}
                </div>

                {/* Environment Upload */}
                <div
                    className={`${styles.uploadCard} ${styles.environmentUploadCard}`}
                >
                    <div className={styles.uploadCardHeader}>
                    <div>
                        <h4>
                        Foto Lingkungan{" "}
                        <span style={{ color: "var(--color-error)" }}>*</span>
                        </h4>

                        <p>Foto kampus, gedung, atau fasilitas.</p>
                    </div>
                    </div>

                    {envPreview ? (
                    <div className={styles.uploadPreviewWrap}>
                        <img
                        src={envPreview}
                        alt="Environment preview"
                        className={styles.uploadPreviewImgEnv}
                        />

                        <label className={styles.uploadPreviewChange}>
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>

                        Ganti Foto

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleEnvChange}
                        />
                        </label>
                    </div>
                    ) : (
                    <label
                        className={`${styles.dropZone} ${styles.environmentDropZone}`}
                    >
                        <div className={styles.dropZoneIcon}>
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        </div>

                        <span className={styles.dropZoneText}>
                        Klik untuk upload foto lingkungan
                        </span>

                        <span className={styles.dropZoneHint}>
                        PNG, JPG hingga 10MB
                        </span>

                        <input
                        type="file"
                        accept="image/*"
                        onChange={handleEnvChange}
                        />
                    </label>
                    )}
                </div>
                </div>
            </div>

            {/* ── RIGHT: Form Panel ── */}
            <div className={styles.formPanel}>
                <p className={styles.uploadSectionLabel}>Detail Institusi</p>

                <div className={styles.formSectionCard}>
                <div className={styles.formGroup}>
                    <label>
                    Nama Institusi{" "}
                    <span style={{ color: "var(--color-error)" }}>*</span>
                    </label>

                    <input
                    type="text"
                    className={styles.input}
                    placeholder="Contoh: Universitas Brawijaya"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>
                    Sejarah / Latar Belakang Institusi{" "}
                    <span style={{ color: "var(--color-error)" }}>*</span>
                    </label>

                    <textarea
                    className={styles.textarea}
                    placeholder="Ceritakan sejarah singkat, visi, atau misi institusi Anda..."
                    value={institutionHistory}
                    onChange={(e) => setInstitutionHistory(e.target.value)}
                    />
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                    <label>
                        Tingkat Sekolah{" "}
                        <span style={{ color: "var(--color-error)" }}>*</span>
                    </label>

                    <select
                        className={styles.select}
                        value={schoolLevel}
                        onChange={(e) => setSchoolLevel(e.target.value)}
                    >
                        <option value="">-- Pilih Tingkat Sekolah --</option>
                        <option value="PreSchool">PreSchool</option>
                        <option value="TK">TK</option>
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                        <option value="SMA">SMA</option>
                        <option value="SMK">SMK</option>
                        <option value="Perguruan Tinggi">
                        Perguruan Tinggi
                        </option>
                    </select>
                    </div>

                    <div className={styles.formGroup}>
                    <label>
                        Program Studi / Gelar yang Ditawarkan{" "}
                        <span className={styles.labelOptional}>
                        (Opsional)
                        </span>
                    </label>

                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Contoh: S1 Informatika, S2 Manajemen..."
                        value={offeredDegrees}
                        onChange={(e) => setOfferedDegrees(e.target.value)}
                    />
                    </div>
                </div>
                </div>

                {/* Optional Reference Upload */}
                <div className={styles.optionalUploadCard}>
                <div className={styles.optionalUploadHeader}>
                    <div>
                    <h4>
                        Referensi Kampus{" "}
                        <span className={styles.optionalBadge}>Opsional</span>
                    </h4>

                    <p>
                        PDF, DOC, atau TXT tentang profil kampus.
                    </p>
                    </div>
                </div>

                {file ? (
                    <div className={styles.fileChip}>
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                    </svg>

                    <span className={styles.fileChipName}>
                        {file.name}
                    </span>
                    </div>
                ) : (
                    <label className={styles.dropZoneCompact}>
                    <div className={styles.dropZoneCompactLeft}>
                        <div className={styles.dropZoneIcon}>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        </div>

                        <div className={styles.dropZoneTextGroup}>
                            <span className={styles.dropZoneText}>
                                Upload file referensi
                            </span>

                            <span className={styles.dropZoneHint}>
                                PDF · DOC · DOCX · TXT
                            </span>
                        </div>
                    </div>

                    <input
                        type="file"
                        accept="image/*,.pdf,.txt,.doc,.docx"
                        onChange={handleFileChange}
                    />
                    </label>
                )}
                </div>

                <div className={styles.footerActions}>
                <button
                    className={styles.btnPrimary}
                    onClick={handleNext}
                >
                    Lanjut ke Creative Brief →
                </button>
                </div>
            </div>
            </div>
        </div>
    );
}