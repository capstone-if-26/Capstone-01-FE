# Capstone-01-FE
CAPSTONE 01 - AI Content Generator Platform

Ini adalah frontend untuk project Capstone, menggunakan **Next.js 14** dan **TypeScript**.  
Backend masih dalam tahap mock API, jadi semua request API masih menggunakan mock service.

---

## 🛠️ Prasyarat

Pastikan sudah terinstall:

- Node.js ≥ 22
- npm ≥ 10
- Git

---

## ⚡ Instalasi dan Menjalankan Project

1. **Clone repository:**

```bash
git clone <URL_REPO_KAMU>
cd <FOLDER_PROJECT>
```

2. **Clone dependencies:**

```bash
npm install
```

3. **Jalankan development server**

```bash
npm run dev
```

4. **Buka di browser**

```
http://localhost:3000
```

---

## 🧩 Struktur Folder

```
src
 ├── app                     # Halaman Next.js
 │   ├── login               # Page login
 │   │   └── page.tsx
 │   ├── register            # Page register
 │   │   └── page.tsx
 │   ├── globals.css         # Global CSS, import design-system.css
 │   ├── layout.tsx          # Layout utama
 │   └── page.tsx            # Home page
 │
 ├── components              # UI Components
 │   ├── forms               # Form login & register
 │   │   ├── login-form.tsx
 │   │   ├── login-form.module.css
 │   │   ├── register-form.tsx
 │   │   └── register-form.module.css
 │   ├── layout              # Components layout reusable
 │   └── ui                  # UI kecil seperti button, card, dll
 │
 ├── hooks                   # Custom hooks
 │   ├── use-login.ts
 │   └── use-register.ts
 │
 ├── lib                     # Library/helper
 │   └── axios.ts             # Instance axios untuk API
 │
 ├── services                # Service untuk API
 │   └── auth.service.ts
 │
 ├── store                   # State management (redux/zustand)
 │
 ├── styles                  # CSS global / design-system
 │   └── design-system.css
 │
 ├── types                   # TypeScript type
 │   └── auth.ts
 ├── .next                    # Build cache Next.js (tidak di git)
 ├── node_modules             # Dependencies (tidak di git)
 ├── package-lock.json
 ├── package.json
 └── tsconfig.json
```

---
## ⚙️ Mock API
Saat ini API masih mock:
- ```hooks/use-register.ts``` → menggunakan fungsi mock ```registerUser```.
- ```services/auth.service.ts``` → menyediakan interface API (mock).

---
