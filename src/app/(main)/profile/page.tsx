"use client";

import React, { useState, useEffect } from 'react';
import styles from './profile.module.css';

export default function ProfilePage() {
  // State untuk memastikan komponen di-render di client (menghindari error SSR Next.js)
  const [mounted, setMounted] = useState(false);

  // State form dibiarkan kosong sebagai nilai awal
  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    email: '',
    phone: '',
    bio: ''
  });

  // Mengambil data dari localStorage saat halaman pertama kali dimuat
  useEffect(() => {
    setMounted(true);
    
    // Coba ambil profil yang sudah tersimpan
    const savedProfile = localStorage.getItem('userProfile');
    
    if (savedProfile) {
      // Jika user sudah pernah update profil, pakai data tersebut
      setFormData(JSON.parse(savedProfile));
    } else {
      // Jika belum, ambil data dasar dari proses Login/Register
      const registeredName = localStorage.getItem('registeredName') || 'Guest User';
      const registeredEmail = localStorage.getItem('registeredEmail') || 'guest@sevima.com';
      
      setFormData({
        fullName: registeredName,
        // Buat display name otomatis dari kata pertama nama lengkap
        displayName: registeredName.split(' ')[0], 
        email: registeredEmail,
        phone: '', // Dibiarkan kosong sesuai permintaan (diisi manual oleh user)
        bio: ''
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Simpan data terbaru ke localStorage agar tidak hilang saat di-refresh
    localStorage.setItem('userProfile', JSON.stringify(formData));
    
    // Update juga nama dasar jika sewaktu-waktu dipakai di sidebar
    localStorage.setItem('registeredName', formData.fullName);
    
    alert("Profile berhasil diperbarui!");
  };

  // Jangan render UI sampai proses pembacaan localStorage selesai
  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>My Profile</h1>
        <p>Manage your personal information and identity.</p>
      </header>

      {/* Profile Summary Card */}
      <div className={styles.summaryCard}>
        <div className={styles.avatarWrapper}>
          {/* Inisial nama sebagai avatar sementara */}
          <div style={{width: '100%', height: '100%', backgroundColor: '#ffe8cc', color: '#fd7e14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold'}}>
            {formData.displayName.charAt(0).toUpperCase()}
          </div>
          <div className={styles.editAvatarBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </div>
        </div>
        <div className={styles.userInfo}>
          <h2>{formData.fullName} <span className={styles.badgePro}>PRO ACCOUNT</span></h2>
          <p>{formData.email}</p>
          <div className={styles.actionButtons}>
            <button className={styles.btnPrimary}>Edit Profile</button>
            <button className={styles.btnSecondary}>Change Password</button>
          </div>
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
            <input type="text" name="fullName" className={styles.input} value={formData.fullName} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Display Name</label>
            <input type="text" name="displayName" className={styles.input} value={formData.displayName} onChange={handleChange} />
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
    </div>
  );
}