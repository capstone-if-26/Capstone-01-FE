# Sevima AI Video Gen - Frontend

Aplikasi frontend untuk platform pembuatan video pembelajaran otomatis berbasis AI. Proyek ini dibangun menggunakan **Next.js 14** dan **TypeScript**. Saat ini backend telah terintegrasi penuh (sudah tidak menggunakan mock API lagi).

---

## 🚀 Prasyarat

Pastikan sudah terinstall:
- Node.js >= 18 (direkomendasikan v20+)
- npm >= 9
- Git

---

## 📦 Instalasi dan Menjalankan Project

1. **Clone repository:**
   ```bash
   git clone <URL_REPO_FE>
   cd Capstone-01-FE
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Salin file `.env.example` menjadi `.env.local` (atau sesuaikan dengan file .env yang ada)
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```

---

## 🏗️ Struktur Proyek & Fitur Terkini

- **Autentikasi**: Terintegrasi penuh dengan backend PostgreSQL. Token tersimpan via interceptor Axios.
- **Admin Panel**: Akses khusus role admin untuk melihat daftar user dan menambahkan kredit AI (`/admin`).
- **Dashboard & Library**: Manajemen proyek dan storyboard.
- **Top Actions**: Fitur polling notifikasi otomatis (mengecek status video background worker) dan modal bantuan modern.
- **Styling**: Menggunakan sistem desain CSS Modules (`design-system.css`) tanpa framework eksternal untuk kontrol performa yang maksimal.
