"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './sidebar.module.css';
import { getMe } from '@/services/auth.service';

export default function Sidebar() {
  const pathname = usePathname();
  
  const [userName, setUserName] = useState('Loading...');
  const [userInitial, setUserInitial] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        if (res.success && res.data) {
          const name = res.data.name || 'User';
          setUserName(name);
          setUserInitial(name.charAt(0).toUpperCase());
          setUserRole(res.data.role || 'user');
        }
      } catch {
        // Fallback to localStorage if API fails
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          setUserName(parsed.fullName || parsed.displayName || 'User');
          setUserInitial((parsed.displayName || parsed.fullName || 'U').charAt(0).toUpperCase());
        } else {
          const registeredName = localStorage.getItem('registeredName') || 'Guest User';
          setUserName(registeredName);
          setUserInitial(registeredName.charAt(0).toUpperCase());
        }
      }
    };
    fetchUser();
  }, []);

  // Fungsi untuk mengecek apakah menu sedang aktif (untuk warna biru)
  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      active: isActive('/dashboard') && pathname === '/dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
    },
    {
      href: '/projects',
      label: 'Projects',
      active: isActive('/projects'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      ),
    },
    {
      href: '/library',
      label: 'Library',
      active: isActive('/library'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      ),
    },
    {
      href: '/settings',
      label: 'Settings',
      active: isActive('/settings') || isActive('/profile'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
    },
  ];

  if (userRole === 'admin') {
    navItems.push({
      href: '/admin',
      label: 'Admin Panel',
      active: isActive('/admin'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
    });
  }

  return (
    <aside className={styles.sidebar}>
      {/* Logo -> hidden on mobile */}
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>
          <img src="/favicon.png" alt="Sevima Logo" width={28} height={28} style={{ borderRadius: '6px' }} />
        </div>
        <div>
          <h2>Sevima AI</h2>
          <p>Business Workspace</p>
        </div>
      </div>

      <nav className={styles.navigation}>
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className={item.active ? styles.active : ''}>
              <Link href={item.href}>
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User profile — hidden on mobile */}
      <Link href="/profile" style={{ textDecoration: 'none' }}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>{userInitial}</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{userName}</p>
            <p className={styles.userPlan}>{userRole === 'admin' ? 'Admin' : 'Member'}</p>
          </div>
        </div>
      </Link>
    </aside>
  );
}