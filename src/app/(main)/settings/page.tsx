"use client";

import React, { useState, useEffect } from 'react';
import styles from './settings.module.css';
import { getMe, deleteAccount } from '@/services/auth.service';
import { getMyCredits } from '@/services/credit.service';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    emailAlerts: true,
    newsletter: false,
    publicProfile: true,
    dataTraining: false,
  });

  const [userInfo, setUserInfo] = useState<{ name: string; email: string; role: string; credits: number; created_at: string } | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, creditRes] = await Promise.all([
          getMe(),
          getMyCredits().catch(() => ({ data: { credits: 0 } })),
        ]);
        if (meRes.success && meRes.data) {
          setUserInfo(meRes.data);
        }
        if (creditRes?.data) {
          setCredits(creditRes.data.credits);
        }
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };
    fetchData();
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) return;
    try {
      await deleteAccount();
      localStorage.clear();
      router.push('/login');
    } catch (err) {
      alert('Gagal menghapus akun.');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Account Settings</h1>
          <p>Kelola preferensi akun AI workspace Anda.</p>
        </div>
      </header>

      <div className={styles.gridLayout}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Card: Account Info */}
          <div className={styles.card}>
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Account Info
            </h3>
            {userInfo ? (
              <>
                <div className={styles.settingItem}>
                  <div className={styles.settingText}>
                    <h4>Nama</h4>
                    <p>{userInfo.name}</p>
                  </div>
                </div>
                <div className={styles.settingItem}>
                  <div className={styles.settingText}>
                    <h4>Email</h4>
                    <p>{userInfo.email}</p>
                  </div>
                </div>
                <div className={styles.settingItem}>
                  <div className={styles.settingText}>
                    <h4>Role</h4>
                    <p style={{ textTransform: 'capitalize' }}>{userInfo.role}</p>
                  </div>
                </div>
              </>
            ) : (
              <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Memuat data akun...</p>
            )}
          </div>

          {/* Card: Notifications */}
          <div className={styles.card}>
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              Notifications
            </h3>
            <div className={styles.settingItem}>
              <div className={styles.settingText}>
                <h4>Email Alerts</h4>
                <p>Updates on project exports</p>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" checked={settings.emailAlerts} onChange={() => handleToggle('emailAlerts')} />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.settingItem}>
              <div className={styles.settingText}>
                <h4>Newsletter</h4>
                <p>Weekly AI trends & tips</p>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" checked={settings.newsletter} onChange={() => handleToggle('newsletter')} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          {/* Card: Privacy */}
          <div className={styles.card}>
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Privacy
            </h3>
            <div className={styles.settingItem}>
              <div className={styles.settingText}>
                <h4>Public Profile</h4>
                <p>Allow others to see assets</p>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" checked={settings.publicProfile} onChange={() => handleToggle('publicProfile')} />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.settingItem}>
              <div className={styles.settingText}>
                <h4>Data Training</h4>
                <p>Use my inputs to improve AI</p>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" checked={settings.dataTraining} onChange={() => handleToggle('dataTraining')} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
          
        </div>

        {/* Kolom Kanan: Credits & Danger Zone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Card: Credits */}
          <div className={styles.planCard}>
            <div style={{position: 'relative', zIndex: 2}}>
              <h3>Credits ✨</h3>
              <p>Sisa kredit untuk generate video AI.</p>

              <div className={styles.storageInfo}>
                <div className={styles.storageHeader}>
                  <span>Credits Tersisa</span>
                  <span>{credits !== null ? credits : '...'}</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${credits !== null ? Math.min((credits / 1000) * 100, 100) : 0}%` }}></div>
                </div>
                <p className={styles.storageText}>{credits !== null ? credits : '...'} credits tersisa</p>
              </div>
            </div>
          </div>

          {/* Card: Delete Account */}
          <div className={styles.dangerCard}>
            <button className={styles.btnDanger} onClick={handleDeleteAccount}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              Delete Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}