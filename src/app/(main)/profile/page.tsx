"use client";

import React, { useState, useEffect } from 'react';
import styles from './profile.module.css';
import { getMe, changePassword } from '@/services/auth.service';

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    email: '',
    phone: '',
    bio: '',
    role: '',
    credits: 0,
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordMsg, setPasswordMsg] = useState('');

  useEffect(() => {
    setMounted(true);

    const fetchProfile = async () => {
      try {
        const res = await getMe();
        if (res.success && res.data) {
          const user = res.data;
          // Try to merge with any locally saved extra fields (phone, bio)
          const savedExtra = localStorage.getItem('userProfileExtra');
          const extra = savedExtra ? JSON.parse(savedExtra) : {};

          setFormData({
            fullName: user.name || '',
            displayName: (user.name || '').split(' ')[0],
            email: user.email || '',
            phone: extra.phone || '',
            bio: extra.bio || '',
            role: user.role || 'user',
            credits: user.credits || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
        // Fallback to localStorage
        const registeredName = localStorage.getItem('registeredName') || 'Guest User';
        const registeredEmail = localStorage.getItem('registeredEmail') || 'guest@sevima.com';
        setFormData(prev => ({
          ...prev,
          fullName: registeredName,
          displayName: registeredName.split(' ')[0],
          email: registeredEmail,
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Save extra fields locally (phone, bio are not in the backend User model)
    localStorage.setItem('userProfileExtra', JSON.stringify({
      phone: formData.phone,
      bio: formData.bio,
    }));
    alert("Profil berhasil diperbarui!");
  };

  const handlePasswordChange = async () => {
    setPasswordMsg('');
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordMsg('Password baru tidak cocok.');
      return;
    }
    if (passwordData.new_password.length < 6) {
      setPasswordMsg('Password baru minimal 6 karakter.');
      return;
    }
    try {
      await changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      setPasswordMsg('Password berhasil diubah!');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      setPasswordMsg(err?.response?.data?.message || 'Gagal mengubah password.');
    }
  };

  if (!mounted || isLoading) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>My Profile</h1>
        <p>Kelola informasi pribadi dan identitas Anda.</p>
      </header>

      {/* Profile Summary Card */}
      <div className={styles.summaryCard}>
        <div className={styles.avatarWrapper}>
          <div style={{width: '100%', height: '100%', backgroundColor: '#ffe8cc', color: '#fd7e14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold'}}>
            {formData.displayName.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className={styles.userInfo}>
          <h2>
            {formData.fullName}{' '}
            <span className={styles.badgePro}>
              {formData.role === 'admin' ? 'ADMIN' : 'MEMBER'}
            </span>
          </h2>
          <p>{formData.email}</p>
          <p style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: '0.25rem' }}>Credits: <strong>{formData.credits}</strong></p>
        </div>
      </div>

      {/* Personal Information Form */}
      <div className={styles.formCard}>
        <h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Personal Information
        </h3>
        
        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input type="text" name="fullName" className={styles.input} value={formData.fullName} onChange={handleChange} disabled style={{opacity: 0.7, cursor: 'not-allowed'}} />
            <small style={{color: '#868e96', fontSize: '0.75rem'}}>Nama diambil dari akun Anda.</small>
          </div>
          <div className={styles.formGroup}>
            <label>Display Name</label>
            <input type="text" name="displayName" className={styles.input} value={formData.displayName} onChange={handleChange} disabled style={{opacity: 0.7, cursor: 'not-allowed'}} />
          </div>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input type="email" name="email" className={styles.input} value={formData.email} onChange={handleChange} disabled style={{opacity: 0.7, cursor: 'not-allowed'}} />
            <small style={{color: '#868e96', fontSize: '0.75rem'}}>Email tidak dapat diubah.</small>
          </div>
          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input type="text" name="phone" className={styles.input} value={formData.phone} onChange={handleChange} placeholder="Masukkan nomor telepon" />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Bio</label>
          <textarea name="bio" className={styles.textarea} value={formData.bio} onChange={handleChange} placeholder="Ceritakan sedikit tentang pekerjaan atau diri Anda..."></textarea>
        </div>

        <div className={styles.footerActions}>
          <button className={styles.btnPrimary} onClick={handleSave} style={{padding: '0.75rem 2rem', fontSize: '1rem'}}>Save Changes</button>
        </div>
      </div>

      {/* Change Password */}
      <div className={styles.formCard}>
        <h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Change Password
        </h3>
        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label>Password Lama</label>
            <input type="password" className={styles.input} value={passwordData.old_password} onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})} placeholder="Masukkan password lama" />
          </div>
          <div className={styles.formGroup}>
            <label>Password Baru</label>
            <input type="password" className={styles.input} value={passwordData.new_password} onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})} placeholder="Minimal 6 karakter" />
          </div>
          <div className={styles.formGroup}>
            <label>Konfirmasi Password Baru</label>
            <input type="password" className={styles.input} value={passwordData.confirm_password} onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})} placeholder="Ulangi password baru" />
          </div>
        </div>
        {passwordMsg && <p style={{ color: passwordMsg.includes('berhasil') ? '#137333' : '#dc3545', fontSize: '0.9rem', marginTop: '0.5rem' }}>{passwordMsg}</p>}
        <div className={styles.footerActions}>
          <button className={styles.btnSecondary} onClick={handlePasswordChange} style={{padding: '0.75rem 2rem', fontSize: '1rem'}}>Update Password</button>
        </div>
      </div>
    </div>
  );
}