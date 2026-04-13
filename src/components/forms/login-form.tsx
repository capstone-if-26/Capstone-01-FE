"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter dari next/navigation
import { useLogin } from "@/hooks/use-login";
import Link from "next/link";
import styles from "./login-form.module.css";

export default function LoginForm() {
  const router = useRouter(); // 2. Inisialisasi router
  const { submitLogin, loading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await submitLogin({
        email: form.email,
        password: form.password,
      });

      console.log("Login success:", res);
      alert("Login berhasil");
      
      // 3. Pindah ke halaman dashboard setelah alert diklik "Oke"
      router.push("/dashboard");

    } catch (error) {
      console.error("Login gagal:", error);
      alert("Login gagal");
    }
  };

  const handleGoogleLogin = () => {
    // TODO: connect to Google OAuth
    console.log("Masuk dengan Google");
  };

  return (
    <div className={styles.page}>
      {/* ── LEFT PANEL ── */}
      <div className={styles.left}>
        <div className={styles.leftInner}>
          {/* Mock browser UI illustration */}
          <div className={styles.mockBrowser}>
            <div className={styles.mockBar}>
              <div className={styles.mockDot} />
              <div className={styles.mockDot} />
              <div className={styles.mockDot} />
            </div>
            <div className={styles.mockScreen}>
              <div className={styles.mockPlayBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Feature card */}
          <div className={styles.featureCard}>
            <div className={styles.featureBadge}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <div className={styles.featureText}>
              <span className={styles.featureTitle}>Creative AI</span>
              <span className={styles.featureDesc}>
                Generasi konten instan dengan sekali klik.
              </span>
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
                <rect width="20" height="20" rx="6" fill="white" fillOpacity="0.15" />
                <path d="M5 7h10v8H5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M8 9.5l4 2.5-4 2.5V9.5z" fill="white" />
              </svg>
            </div>
            <span className={styles.logoText}>Sevima AI</span>
          </div>

          {/* Heading */}
          <div className={styles.heading}>
            <h2>Selamat Datang Kembali!</h2>
            <p>Masuk ke akun Anda untuk mulai membuat konten video AI.</p>
          </div>

          {/* Form */}
          <div className={styles.form}>
            {/* Email */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">
                Email
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
              <div className={styles.fieldRow}>
                <label className={styles.label} htmlFor="password">
                  Password
                </label>
                <Link href="/lupa-password" className={styles.linkInline}>
                  Lupa password?
                </Link>
              </div>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password Anda"
                  className={`${styles.input} ${styles.inputPassword}`}
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M3 3l14 14M8.5 8.58A3 3 0 0110 8a3 3 0 013 3c0 .55-.15 1.07-.42 1.5M6.35 6.38C4.9 7.37 3.73 8.6 3 10c1.5 2.5 4 5 7 5a7.3 7.3 0 003.65-.97M10 5c3 0 5.5 2.5 7 5-.6 1-1.5 2.1-2.65 2.97"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 4C6 4 3 7 1.5 10 3 13 6 16 10 16s7-3 8.5-6C17 7 14 4 10 4z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <button
              className={styles.btnPrimary}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Masuk Sekarang"}
            </button>

            {/* Divider */}
            <div className={styles.divider}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerText}>ATAU</span>
              <span className={styles.dividerLine} />
            </div>

            {/* Google Button */}
            <button className={styles.btnGoogle} onClick={handleGoogleLogin}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.39a4.6 4.6 0 01-2 3.02v2.5h3.23c1.89-1.74 2.98-4.3 2.98-7.31z"
                  fill="#4285F4"
                />
                <path
                  d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H1.08v2.58A10 10 0 0010 20z"
                  fill="#34A853"
                />
                <path
                  d="M4.41 11.91A6.02 6.02 0 014.1 10c0-.66.12-1.3.31-1.91V5.51H1.08A10 10 0 000 10c0 1.61.38 3.13 1.08 4.49l3.33-2.58z"
                  fill="#FBBC04"
                />
                <path
                  d="M10 3.97c1.47 0 2.79.5 3.83 1.5l2.86-2.86C14.96.9 12.7 0 10 0A10 10 0 001.08 5.51l3.33 2.58C5.2 5.73 7.4 3.97 10 3.97z"
                  fill="#EA4335"
                />
              </svg>
              Masuk dengan Google
            </button>

            {/* Register link */}
            <p className={styles.loginPrompt}>
              Belum punya akun?{" "}
              <Link href="/register" className={styles.linkInline}>
                Daftar gratis di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}