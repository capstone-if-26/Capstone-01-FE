"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './library.module.css';
import { getProjects, renameProject, deleteProject, Project } from '@/services/project.service';

export default function LibraryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  const [renameModal, setRenameModal] = useState<{isOpen: boolean, id: string, name: string}>({isOpen: false, id: '', name: ''});

  const submitRename = async () => {
    if (renameModal.name.trim()) {
      try {
        await renameProject(renameModal.id, renameModal.name);
        setProjects(projects.map(p => p.id === renameModal.id ? { ...p, name: renameModal.name } : p));
        setRenameModal({isOpen: false, id: '', name: ''});
      } catch (err) {
        alert('Gagal mengganti nama project');
      }
    }
  };
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('Newest');

  // Close dropdown on click outside
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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(null);
    if (confirm("Apakah Anda yakin ingin menghapus project ini?")) {
      try {
        await deleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        alert("Gagal menghapus project");
      }
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await getProjects();
        if (result.success && result.data) {
          setProjects(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortFilter]);

  const handleNewProject = () => {
    router.push('/projects');
  };

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
    if (project.videos && project.videos.length > 0) {
      const latestVideo = project.videos[project.videos.length - 1];
      if (latestVideo.thumbnail_url) return latestVideo.thumbnail_url;
    }
    return '';
  };

  const filteredProjects = projects.filter(p => {
    if (searchQuery && !(p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    
    const latestVideo = p.videos && p.videos.length > 0 ? p.videos[p.videos.length - 1] : null;
    const isProcessing = latestVideo && ['pending', 'queued', 'generating_assets', 'processing', 'stitching_video'].includes(latestVideo.status);
    const videoUrl = latestVideo?.video_url;
    const isReady = !!videoUrl || (p.status && (p.status.toLowerCase() === 'published' || p.status.toLowerCase() === 'ready'));
    
    if (statusFilter === 'Ready' && !isReady) return false;
    if (statusFilter === 'Processing' && !isProcessing) return false;
    if (statusFilter === 'Draft' && (isReady || isProcessing)) return false;
    
    return true;
  }).sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    if (sortFilter === 'Oldest') return timeA - timeB;
    return timeB - timeA;
  });

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
          <input 
            id="library-search"
            name="library-search"
            aria-label="Cari nama project"
            type="text" 
            placeholder="Cari nama project..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select 
          id="status-filter"
          name="status-filter"
          aria-label="Filter berdasarkan status"
          className={styles.filterSelect} 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">Semua Status</option>
          <option value="Ready">Ready (Selesai)</option>
          <option value="Processing">Processing</option>
          <option value="Draft">Draft</option>
        </select>

        <select 
          id="sort-filter"
          name="sort-filter"
          aria-label="Urutkan project"
          className={styles.filterSelect} 
          value={sortFilter}
          onChange={(e) => setSortFilter(e.target.value)}
        >
          <option value="Newest">Terbaru</option>
          <option value="Oldest">Terlama</option>
        </select>
      </div>

      {/* Grid Content */}
      <div className={styles.grid}>
        {isLoading ? (
          <div style={{ gridColumn: '1 / -1', padding: '2rem 0', color: '#6c757d' }}>Memuat daftar project...</div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '2rem 0', color: '#6c757d' }}>Belum ada project yang dibuat.</div>
        ) : (
          filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((project) => {
            const video = project.videos && project.videos.length > 0 ? project.videos[project.videos.length - 1] : null;
            const videoUrl = video?.video_url;
            const targetUrl = videoUrl ? `/preview/${project.id}` : `/projects?projectId=${project.id}`;
            const isProcessing = video ? ['pending', 'queued', 'generating_assets', 'processing', 'stitching_video'].includes(video.status) : false;

            return (
            <div
              key={project.id}
              className={styles.card}
            >
              <div 
                className={styles.thumbnail}
                onClick={() => router.push(targetUrl)}
                style={{ cursor: 'pointer' }}
              >
                  {getThumbnail(project) ? (
                    <img src={getThumbnail(project)} alt={project.name || 'Project'} />
                  ) : videoUrl ? (
                    <video src={videoUrl} muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : isProcessing ? (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#212529', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#0d6efd' }}>
                      <div className={styles.spinnerSmall} style={{ width: '24px', height: '24px', borderWidth: '3px', marginBottom: '8px' }}></div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Generating...</span>
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#212529', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    </div>
                  )}
                  {videoUrl && (
                    <span className={styles.duration}>
                      {(() => {
                        const dur = video?.duration || 0;
                        if (dur > 0) { const m = Math.floor(dur / 60); const s = dur % 60; return `${m}:${s.toString().padStart(2, '0')}`; }
                        return '0:06';
                      })()}
                    </span>
                  )}
                  <span className={`
                    ${styles.statusBadge} 
                    ${videoUrl || project.status?.toLowerCase() === 'published' || project.status?.toLowerCase() === 'ready' ? styles.badgePublished : ''}
                    ${!videoUrl && !isProcessing && (project.status?.toLowerCase() === 'draft' || project.status?.toLowerCase() === 'pending') ? styles.badgeDraft : ''}
                    ${isProcessing ? styles.badgeProcessing : ''}
                  `}>
                    {videoUrl ? 'READY' : (isProcessing ? 'PROCESSING' : (project.status?.toUpperCase() || 'DRAFT'))}
                  </span>
                </div>
                <div className={styles.cardInfo}>
                  <h3 
                    onClick={() => router.push(targetUrl)}
                    style={{ cursor: 'pointer', margin: '0 0 1rem 0' }}
                  >
                    {project.name || 'Untitled Project'}
                  </h3>
                  <div className={styles.cardFooter}>
                    <div className={styles.date}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      {formatDate(project.created_at)}
                    </div>
                    <div className={styles.menuContainer}>
                      <button 
                        className={styles.menuBtn} 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === project.id ? null : project.id);
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                      </button>
                      {activeDropdown === project.id && (
                        <div className={styles.dropdownMenu}>
                          <button className={styles.dropdownItem} onClick={(e) => handleRename(e, project.id, project.name || 'Untitled Project')}>Ganti Nama</button>
                          {videoUrl && (
                            <button className={styles.dropdownItem} onClick={(e) => handleDownload(e, videoUrl, project.name || 'Untitled Project')}>Download Video</button>
                          )}
                          <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={(e) => handleDelete(e, project.id)}>Hapus Project</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination (Discrete) */}
      {Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) > 1 && (
        <div className={styles.paginationArea}>
          <span className={styles.pageInfo}>
            Halaman {currentPage} dari {Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)}
          </span>
          <div className={styles.pageControls} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button 
              className={styles.btnSecondary} 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              Previous
            </button>
            
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {Array.from({ length: Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(page => (
                <button 
                  key={page} 
                  className={currentPage === page ? styles.pageBtnActive : styles.pageBtn}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              className={styles.btnSecondary} 
              disabled={currentPage === Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)}
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredProjects.length / ITEMS_PER_PAGE), p + 1))}
              style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', opacity: currentPage === Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </div>
      )}
      
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
              <button className={styles.btnPrimary} onClick={submitRename} style={{padding: '8px 16px', fontSize: '14px', width: 'auto'}}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}