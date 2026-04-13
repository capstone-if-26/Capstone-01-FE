"use client";

import React, { useState } from 'react';
import styles from './settings.module.css';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    newsletter: false,
    publicProfile: true,
    dataTraining: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Account Settings</h1>
          <p>Manage your professional AI workspace and preferences.</p>
        </div>
        <button className={styles.btnOutline}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Activity Log
        </button>
      </header>

      <div className={styles.gridLayout}>
        
        {/* Kolom Kiri: Kosong (bisa diisi menu lain) atau menyesuaikan desain jika digabung */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
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

        {/* Kolom Kanan: Plan & Danger Zone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Card: Pro Plan */}
          <div className={styles.planCard}>
            <div style={{position: 'relative', zIndex: 2}}>
              <h3>Pro Plan ✨</h3>
              <p>Billed annually • Renews Dec 2024</p>

              <div className={styles.storageInfo}>
                <div className={styles.storageHeader}>
                  <span>Workspace Storage</span>
                  <span>62%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '62%' }}></div>
                </div>
                <p className={styles.storageText}>6.2 GB of 10 GB used</p>
              </div>

              <button className={styles.btnWhite}>Manage Subscription</button>
            </div>
          </div>

          {/* Card: Delete Account */}
          <div className={styles.dangerCard}>
            <button className={styles.btnDanger}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              Delete Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}