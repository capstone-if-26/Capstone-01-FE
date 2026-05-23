"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProjectById, Project } from '@/services/project.service';
import styles from './preview.module.css';

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const result = await getProjectById(projectId);
        if (result.success && result.data) {
          setProject(result.data);
        } else {
          setError(result.message || "Gagal memuat detail project.");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat mengambil data project.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Gagal mendownload video", err);
      window.open(url, '_blank');
    }
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

  // Helper: extract institution_name from business_briefs
  const getInstitutionName = (p: Project): string => {
    if (p.institution_name) return p.institution_name;
    if (p.business_briefs && p.business_briefs.length > 0 && p.business_briefs[0].institution_name) {
      return p.business_briefs[0].institution_name;
    }
    return '-';
  };

  // Helper: extract theme from creative_briefs or project
  const getTheme = (p: Project): string => {
    if (p.selected_theme) return p.selected_theme;
    if (p.theme) return p.theme;
    if (p.business_briefs && p.business_briefs.length > 0) {
      const bb = p.business_briefs[0];
      if (bb.creative_briefs && bb.creative_briefs.length > 0 && bb.creative_briefs[0].theme) {
        return bb.creative_briefs[0].theme;
      }
    }
    return '-';
  };

  // Helper: extract event_content
  const getEventContent = (p: Project): string => {
    if (p.event_content) return p.event_content;
    if (p.business_briefs && p.business_briefs.length > 0) {
      const bb = p.business_briefs[0];
      if (bb.creative_briefs && bb.creative_briefs.length > 0 && bb.creative_briefs[0].event_content) {
        return bb.creative_briefs[0].event_content;
      }
    }
    return '-';
  };

  // Helper: extract tone_of_voice
  const getTone = (p: Project): string => {
    if (p.tone_of_voice) return p.tone_of_voice;
    if (p.business_briefs && p.business_briefs.length > 0) {
      const bb = p.business_briefs[0];
      if (bb.creative_briefs && bb.creative_briefs.length > 0 && bb.creative_briefs[0].tone_of_voice) {
        return bb.creative_briefs[0].tone_of_voice;
      }
    }
    return '-';
  };

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSpinner}></div>
        <p>Memuat Preview Video...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Kembali
        </button>
        <div className={styles.errorCard}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          <h3>{error || "Project tidak ditemukan"}</h3>
        </div>
      </div>
    );
  }

  const institutionName = getInstitutionName(project);
  const themeName = getTheme(project);
  const eventContent = getEventContent(project);
  const toneName = getTone(project);

  return (
    <div className={styles.container}>
      {/* Top Navigation */}
      <div className={styles.topNav} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className={styles.backBtn} onClick={() => router.push('/library')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Kembali ke Library
        </button>

        <button 
          className={styles.backBtn} 
          onClick={() => {
            router.push(`/projects?projectId=${projectId}`);
          }}
          style={{ 
            color: '#0d6efd', 
            backgroundColor: 'rgba(13, 110, 253, 0.1)', 
            border: '1px solid rgba(13, 110, 253, 0.2)' 
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          Edit Ulang Storyboard
        </button>
      </div>

      {/* Info Bar at Top */}
      <div className={styles.infoBar} style={{ marginBottom: '2rem' }}>
        <div className={styles.infoLeft}>
          <h1 className={styles.videoTitle}>{project.name || institutionName}</h1>
          <div className={styles.metaRow}>
            <span className={styles.metaText}>{formatDate(project.created_at)}</span>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.metaText}>{project.videos?.length || 0} Video Versions</span>
          </div>
        </div>
      </div>

      {/* Main Content - Videos Loop */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
        {project.videos && project.videos.length > 0 ? (
          // Sort videos by created_at descending if possible, or assume backend already did it
          [...project.videos].reverse().map((vid: any, idx: number) => {
            const isProcessing = ['pending', 'queued', 'generating_assets', 'processing', 'stitching_video'].includes(vid.status);
            const statusLabel = vid.video_url ? 'Ready' : (isProcessing ? 'Processing' : (vid.status ? vid.status.charAt(0).toUpperCase() + vid.status.slice(1) : 'Draft'));
            const isReady = !!vid.video_url || vid.status?.toLowerCase() === 'published' || vid.status?.toLowerCase() === 'ready';
            const versionNum = project.videos!.length - idx;

            return (
              <div key={vid.id || idx} style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e9ecef', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e9ecef', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#212529', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    Video Hasil Generasi {project.videos!.length > 1 ? `#${versionNum}` : ''}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={`${styles.statusBadge} ${isReady ? styles.statusReady : styles.statusDraft}`}>
                      <span className={styles.statusDot}></span>
                      {statusLabel}
                    </span>
                    {vid.video_url && (
                      <button
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
                        onClick={() => handleDownload(vid.video_url, `${institutionName.replace(/\s+/g, '_')}_Video_${versionNum}.mp4`)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Download
                      </button>
                    )}
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                  <div className={styles.videoSection}>
                    {vid.video_url ? (
                      <video
                        className={styles.videoPlayer}
                        src={vid.video_url}
                        controls
                        playsInline
                        poster={vid.thumbnail_url || undefined}
                      >
                        Maaf, browser Anda tidak mendukung tag video.
                      </video>
                    ) : (
                      <div className={styles.noVideo}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                        <p>Video sedang diproses atau belum tersedia.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.videoWrapper}>
            <div className={styles.videoSection}>
              <div className={styles.noVideo}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                <p>Belum ada video yang di-generate.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className={styles.detailsGrid}>
        <div className={styles.detailCard}>
          <div className={styles.detailIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <div>
            <span className={styles.detailLabel}>Institusi</span>
            <p className={styles.detailValue}>{institutionName}</p>
          </div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20v-4"></path></svg>
          </div>
          <div>
            <span className={styles.detailLabel}>Kebutuhan</span>
            <p className={styles.detailValue}>{eventContent}</p>
          </div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
          </div>
          <div>
            <span className={styles.detailLabel}>Gaya / Tone</span>
            <p className={styles.detailValue}>{toneName}</p>
          </div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          </div>
          <div>
            <span className={styles.detailLabel}>Tema Visual</span>
            <p className={styles.detailValue}>{themeName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
