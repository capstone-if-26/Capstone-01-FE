"use client"; // Wajib ditambahkan agar bisa menggunakan usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  // Fungsi untuk mengecek apakah menu sedang aktif
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#0d6efd" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill="#0d6efd"/>
            <path d="M12 6L13.5 10.5L18 12L13.5 13.5L12 18L10.5 13.5L6 12L10.5 10.5L12 6Z" fill="white"/>
          </svg>
        </div>
        <div>
          <h2>Sevima AI</h2>
          <p>Business Workspace</p>
        </div>
      </div>

      <nav className={styles.navigation}>
        <ul>
          {/* Dashboard */}
          <li className={isActive('/dashboard') ? styles.active : ''}>
            <Link href="/dashboard">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Dashboard
            </Link>
          </li>
          {/* Projects */}
          <li className={isActive('/dashboard/projects') ? styles.active : ''}>
            <Link href="/dashboard/projects">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Projects
            </Link>
          </li>
          {/* Storyboard (Dipindah ke atas Library) */}
          <li className={isActive('/dashboard/storyboard') ? styles.active : ''}>
            <Link href="/dashboard/storyboard">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              Storyboard
            </Link>
          </li>
          {/* Library */}
          <li className={isActive('/dashboard/library') ? styles.active : ''}>
            <Link href="/dashboard/library">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              Library
            </Link>
          </li>
          {/* Settings */}
          <li className={isActive('/dashboard/settings') ? styles.active : ''}>
            <Link href="/dashboard/settings">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.userProfile}>
        <div className={styles.avatar}>A</div>
        <div className={styles.userInfo}>
          <p className={styles.userName}>Alex Johnson</p>
          <p className={styles.userPlan}>Premium Plan</p>
        </div>
      </div>
    </aside>
  );
}