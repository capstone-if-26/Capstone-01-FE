"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// IMPORT service yang baru kita buat
import { getProjects, renameProject, Project } from '@/services/project.service';

import { getMyCredits } from '@/services/credit.service';

export default function DashboardPage() {
  const router = useRouter();
  const [recentContents, setRecentContents] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [renameModal, setRenameModal] = useState<{isOpen: boolean, id: string, name: string}>({isOpen: false, id: '', name: ''});

  const submitRename = async () => {
    if (renameModal.name.trim()) {
      try {
        await renameProject(renameModal.id, renameModal.name);
        setRecentContents(recentContents.map(p => p.id === renameModal.id ? { ...p, name: renameModal.name } : p));
        setRenameModal({isOpen: false, id: '', name: ''});
      } catch (err) {
        alert('Gagal mengganti nama project');
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(`.${styles.menuContainer}`)) return;
      setActiveDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleRename = (e: React.MouseEvent, id: string, currentName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(null);
    setRenameModal({isOpen: true, id, name: currentName});
  };

  const handleDownload = async (e: React.MouseEvent, url: string, projectName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(null);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = `${projectName || 'video'}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Gagal mendownload", err);
      window.open(url, '_blank');
    }
  };

  // MENGAMBIL DATA MENGGUNAKAN SERVICE
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectResult, creditResult] = await Promise.all([
          getProjects(),
          getMyCredits().catch(() => ({ data: { credits: 0 } }))
        ]);
        
        // Jika sukses, masukkan data project (termasuk ID-nya) ke dalam state
        if (projectResult.success && projectResult.data) {
          setRecentContents(projectResult.data);
        }
        
        if (creditResult && creditResult.data) {
          setCredits(creditResult.data.credits);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('id-ID', options) + ' ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } else if (days > 0) {
      return `${days} hari yang lalu`;
    } else if (hours > 0) {
      return `${hours} jam yang lalu`;
    } else if (minutes > 0) {
      return `${minutes} menit yang lalu`;
    } else {
      return 'Baru saja';
    }
  };

  const getThumbnail = (project: Project) => {
    if (project.videos && project.videos.length > 0 && project.videos[0].thumbnail_url) {
      return project.videos[0].thumbnail_url;
    }
    return '';
  };

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div>
          <h1>Halo, Kreator! 👋</h1>
          <p>Siap untuk membuat konten AI yang luar biasa hari ini?</p>
        </div>
        <Link href="/projects" className={styles.primaryButton}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          Buat Video Baru
        </Link>
      </section>

      {/* Stats Cards */}
      <section className={styles.statsSection} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className={styles.statCard}>
          <div className={styles.statIconBlue}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
          </div>
          <div>
            <p className={styles.statLabel}>TOTAL VIDEO</p>
            <h2 className={styles.statValue}>{isLoading ? '...' : recentContents.filter(p => p.videos && p.videos.length > 0 && p.videos[0].video_url).length}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconBlue} style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <div>
            <p className={styles.statLabel}>TOTAL PROJECT</p>
            <h2 className={styles.statValue}>{isLoading ? '...' : recentContents.length}</h2>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIconYellow}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <div>
            <p className={styles.statLabel}>CREDITS LEFT</p>
            <h2 className={styles.statValue}>{isLoading ? '...' : (credits !== null ? credits : '-')}</h2>
          </div>
        </div>
      </section>

      {/* Recent Content */}
      <section className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h3>Recent Content</h3>
          <Link href="/library" className={styles.viewAll}>View All</Link>
        </div>
        
        <div className={styles.gridContainer}>
          {isLoading ? (
            <p style={{ color: '#6c757d', padding: '2rem 0', gridColumn: 'span 4' }}>Memuat daftar project...</p>
          ) : recentContents.filter(p => p.videos && p.videos.length > 0 && p.videos[0].video_url).length === 0 ? (
            <p style={{ color: '#6c757d', padding: '2rem 0', gridColumn: 'span 4' }}>Belum ada video yang selesai dibuat.</p>
          ) : (
            recentContents.filter(p => p.videos && p.videos.length > 0 && p.videos[0].video_url).slice(0, 20).map((item) => {
              const video = item.videos![0];
              const isProcessing = ['pending', 'queued', 'generating_assets', 'processing', 'stitching_video'].includes(video.status);
              const videoUrl = video.video_url;
              const targetUrl = videoUrl ? `/preview/${item.id}` : `/projects?projectId=${item.id}`;
              
              return (
              <div 
                key={item.id} 
                className={styles.contentCard}
              >
                <div 
                  className={styles.thumbnailPlaceholder} 
                  onClick={() => router.push(targetUrl)}
                  style={{ cursor: 'pointer' }}
                >
                    {getThumbnail(item) ? (
                      <img 
                        src={getThumbnail(item)} 
                        alt={item.name || 'Project thumbnail'} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : videoUrl ? (
                      <video src={videoUrl} muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : isProcessing ? (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e9ecef', color: '#0d6efd' }}>
                        <div className={styles.spinnerSmall} style={{ width: '24px', height: '24px', borderWidth: '3px', marginBottom: '8px' }}></div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Generating...</span>
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                      </div>
                    )}
                    <span className={styles.duration}>
                      {videoUrl ? (() => {
                        const dur = item.videos?.[0]?.duration || 0;
                        if (dur > 0) {
                          const m = Math.floor(dur / 60);
                          const s = dur % 60;
                          return `${m}:${s.toString().padStart(2, '0')}`;
                        }
                        return '0:06';
                      })() : (isProcessing ? "Processing" : "--:--")}
                    </span>
                  </div>
                  <h4 
                    onClick={() => router.push(targetUrl)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.name || 'Untitled Project'}
                  </h4>
                  <div className={styles.cardFooter}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={videoUrl || item.status?.toLowerCase() === 'published' || item.status?.toLowerCase() === 'ready' ? styles.badgeGreen : (isProcessing ? styles.badgeYellow : styles.badgeYellow)}>
                        <span className={styles.dot}></span> {videoUrl ? 'Ready' : (isProcessing ? 'Processing' : (item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Draft'))}
                      </span>
                      <span className={styles.time}>{formatDate(item.created_at)}</span>
                    </div>
                    
                    <div className={styles.menuContainer}>
                      <button 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d', padding: '4px' }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === item.id ? null : item.id);
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                      </button>
                      {activeDropdown === item.id && (
                        <div className={styles.dropdownMenu}>
                          <button className={styles.dropdownItem} onClick={(e) => handleRename(e, item.id, item.name || 'Untitled Project')}>Ganti Nama</button>
                          {videoUrl && (
                            <button className={styles.dropdownItem} onClick={(e) => handleDownload(e, videoUrl, item.name || 'Untitled Project')}>Download Video</button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
              </div>
              );
            })
          )}
        </div>
      </section>

      {renameModal.isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Ganti Nama Project</h3>
            <input 
              type="text" 
              value={renameModal.name} 
              onChange={(e) => setRenameModal({...renameModal, name: e.target.value})}
              className={styles.modalInput}
              autoFocus
            />
            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={() => setRenameModal({isOpen: false, id: '', name: ''})}>Batal</button>
              <button className={styles.primaryButton} onClick={submitRename} style={{padding: '8px 16px', fontSize: '14px', width: 'auto'}}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}