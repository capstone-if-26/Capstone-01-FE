"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './library.module.css';

// Mock Data berdasarkan desain Figma
const projects = [
  {
    id: 1,
    title: 'Introduction to AI Ethics',
    date: '12 Oct 2023',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=400&q=80' // Cyberpunk street
  },
  {
    id: 2,
    title: 'Campus Tour Highlight...',
    date: '10 Oct 2023',
    status: 'DRAFT',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80' // Computer setup
  },
  {
    id: 3,
    title: 'Calculus Part 1: Deriva...',
    date: '05 Oct 2023',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80' // Chalkboard math
  },
  {
    id: 4,
    title: 'Student Success Stories',
    date: '28 Sep 2023',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' // Professional man
  },
  {
    id: 5,
    title: 'Workshop: AI for Desig...',
    date: '20 Sep 2023',
    status: 'DRAFT',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80' // Abstract blue waves
  },
  {
    id: 6,
    title: 'New Student Orientati...',
    date: '15 Sep 2023',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80' // Abstract orange wave
  },
  {
    id: 7,
    title: 'Legacy: AI Chatbot De...',
    date: '10 Aug 2023',
    status: 'ARCHIVED',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80' // Coding screen
  }
];

export default function LibraryPage() {
  const router = useRouter();

  const handleNewProject = () => {
    // Arahkan kembali ke alur pembuatan project (Step 1)
    router.push('/dashboard/projects');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1>Project Library</h1>
          <p>Kelola dan lihat daftar video AI yang telah Anda buat.</p>
        </div>
        <button className={styles.btnPrimary} onClick={handleNewProject}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Project
        </button>
      </header>

      {/* Controls / Filter */}
      <div className={styles.controlsRow}>
        <div className={styles.searchBox}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Cari nama project atau tanggal..." />
        </div>
        
        <button className={styles.filterSelect}>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            Semua Status
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>

        <button className={styles.filterSelect}>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
            Terbaru
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>

      {/* Grid Content */}
      <div className={styles.grid}>
        {projects.map((project) => (
          <div key={project.id} className={styles.card}>
            <div className={styles.thumbnail}>
              <img src={project.thumbnail} alt={project.title} />
              <span className={`
                ${styles.statusBadge} 
                ${project.status === 'PUBLISHED' ? styles.badgePublished : ''}
                ${project.status === 'DRAFT' ? styles.badgeDraft : ''}
                ${project.status === 'ARCHIVED' ? styles.badgeArchived : ''}
              `}>
                {project.status}
              </span>
            </div>
            <div className={styles.cardInfo}>
              <h3>{project.title}</h3>
              <div className={styles.cardFooter}>
                <div className={styles.date}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  {project.date}
                </div>
                <button className={styles.menuBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Create New Card */}
        <div className={styles.createCard} onClick={handleNewProject}>
           <div className={styles.plusCircle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
           </div>
           <span>Create New Video</span>
        </div>
      </div>

      {/* Pagination */}
      <div className={styles.paginationArea}>
        <span className={styles.pageInfo}>Menampilkan 7 dari 24 project</span>
        <div className={styles.pageControls}>
          <button className={styles.pageBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
          <button className={styles.pageBtn}>2</button>
          <button className={styles.pageBtn}>3</button>
          <button className={styles.pageBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

    </div>
  );
}