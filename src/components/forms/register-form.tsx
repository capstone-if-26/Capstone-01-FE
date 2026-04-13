"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Tambahkan useRouter
import { useRegister } from "@/hooks/use-register";
import Link from "next/link";
import styles from "./register-form.module.css";

export default function RegisterForm() {
  const router = useRouter(); // Inisialisasi router
  const { submitRegister, loading } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
        const res = await submitRegister({
            name: form.fullName,
            email: form.email,
            password: form.password,
        });

        console.log("Register success:", res);
        
        // 1. Simpan data input asli ke Local Storage
        localStorage.setItem("registeredName", form.fullName);
        localStorage.setItem("registeredEmail", form.email);
        
        // 2. Beri notifikasi dan arahkan ke dashboard
        alert("Registrasi berhasil! Selamat datang di Sevima AI.");
        router.push("/dashboard");

    } catch (error) {
        console.error("Register gagal:", error);
        alert("Register gagal");
    }
  };

  const handleGoogleRegister = () => {
    // TODO: connect to Google OAuth
    console.log("Daftar dengan Google");
  };

  return (
    <div className={styles.page}>
      {/* ── LEFT PANEL ── */}
      <div className={styles.left}>
        <div className={styles.leftInner}>
          {/* Icon grid */}
          <div className={styles.iconGrid}>
            <div className={`${styles.iconCard} ${styles.iconCardDark}`}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 8h20v16H6z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M13 12l7 4-7 4V12z" fill="white"/>
              </svg>
            </div>
            <div className={`${styles.iconCard} ${styles.iconCardGlass}`}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 6l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
                <circle cx="22" cy="10" r="2" fill="white"/>
                <circle cx="10" cy="22" r="1.5" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <div className={`${styles.iconCard} ${styles.iconCardDark}`}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="12" r="4" stroke="white" strokeWidth="1.8"/>
                <path d="M8 26c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Headline */}
          <div className={styles.headline}>
            <h1>Wujudkan Ide Menjadi Konten Visual.</h1>
          </div>

          {/* Feature card */}
          <div className={styles.featureCard}>
            <div className={styles.featureBadge}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" fill="#1A2038"/>
              </svg>
            </div>
            <div className={styles.featureText}>
              <span className={styles.featureTitle}>10× Lebih Cepat</span>
              <span className={styles.featureDesc}>Produksi video marketing tanpa hambatan teknis.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className={styles.right}>
        <div className={styles.formContainer}>
          {/* Logo */}
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect width="20" height="20" rx="6" fill="white" fillOpacity="0.15"/>
                <path d="M5 7h10v8H5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M8 9.5l4 2.5-4 2.5V9.5z" fill="white"/>
              </svg>
            </div>
            <span className={styles.logoText}>Sevima AI</span>
          </div>

          {/* Heading */}
          <div className={styles.heading}>
            <h2>Mulai Perjalanan Kreatifmu</h2>
            <p>Daftar sekarang dan buat video marketing profesional dalam hitungan menit.</p>
          </div>

          {/* Form */}
          <div className={styles.form}>
            {/* Nama Lengkap */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="fullName">
                Nama Lengkap
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                className={styles.input}
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">
                Email Bisnis
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Masukkan email Anda"
                className={styles.input}
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="password">
                Buat Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Buat password"
                  className={`${styles.input} ${styles.inputPassword}`}
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M3 3l14 14M8.5 8.58A3 3 0 0110 8a3 3 0 013 3c0 .55-.15 1.07-.42 1.5M6.35 6.38C4.9 7.37 3.73 8.6 3 10c1.5 2.5 4 5 7 5a7.3 7.3 0 003.65-.97M10 5c3 0 5.5 2.5 7 5-.6 1-1.5 2.1-2.65 2.97" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4C6 4 3 7 1.5 10 3 13 6 16 10 16s7-3 8.5-6C17 7 14 4 10 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className={styles.checkboxCustom} aria-hidden="true" />
              <span className={styles.checkboxText}>
                Saya menyetujui{" "}
                <Link href="/syarat-ketentuan" className={styles.linkInline}>
                  Syarat &amp; Ketentuan
                </Link>{" "}
                serta Kebijakan Privasi yang berlaku.
              </span>
            </label>

            {/* CTA Button */}
            <button
              className={styles.btnPrimary}
              onClick={handleSubmit}
              disabled={!agreed || loading || !form.fullName || !form.email || !form.password}
            >
                {loading ? "Loading..." : "Daftar Sekarang"}
            </button>

            {/* Divider */}
            <div className={styles.divider}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerText}>ATAU</span>
              <span className={styles.dividerLine} />
            </div>

            {/* Google Button */}
            <button className={styles.btnGoogle} onClick={handleGoogleRegister}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.39a4.6 4.6 0 01-2 3.02v2.5h3.23c1.89-1.74 2.98-4.3 2.98-7.31z" fill="#4285F4"/>
                <path d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H1.08v2.58A10 10 0 0010 20z" fill="#34A853"/>
                <path d="M4.41 11.91A6.02 6.02 0 014.1 10c0-.66.12-1.3.31-1.91V5.51H1.08A10 10 0 000 10c0 1.61.38 3.13 1.08 4.49l3.33-2.58z" fill="#FBBC04"/>
                <path d="M10 3.97c1.47 0 2.79.5 3.83 1.5l2.86-2.86C14.96.9 12.7 0 10 0A10 10 0 001.08 5.51l3.33 2.58C5.2 5.73 7.4 3.97 10 3.97z" fill="#EA4335"/>
              </svg>
              Daftar dengan Google
            </button>

            {/* Login link */}
            <p className={styles.loginPrompt}>
              Sudah punya akun?{" "}
              <Link href="/login" className={styles.linkInline}>
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}