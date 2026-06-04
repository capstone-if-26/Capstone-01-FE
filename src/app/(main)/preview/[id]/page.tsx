"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProjectById, renameProject, Project } from '@/services/project.service';
import videoService from '@/services/video.service';
import storyboardService from '@/services/storyboard.service';
import styles from './preview.module.css';

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<number>(0);
  // Storyboard sections fetched secara terpisah sebagai fallback
  const [rawSections, setRawSections] = useState<any[]>([]);
  const [storyboardId, setStoryboardId] = useState<string>('');

  // State inline edit judul project
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitleValue, setEditingTitleValue] = useState('');
  const [isSavingTitle, setIsSavingTitle] = useState(false);

  // State edit narasi/visual per section_type: { hook: { isEditing, narration, visual, isSaving } }
  const [sectionEdit, setSectionEdit] = useState<Record<string, { isEditing: boolean; narration: string; visual: string; isSaving: boolean }>>({});

  // State regenerate per scene: { [videoId]: { isOpen, prompt, isLoading } }
  const [regenState, setRegenState] = useState<Record<string, { isOpen: boolean; prompt: string; isLoading: boolean }>>({});
  const pollingRefs = useRef<Record<string, boolean>>({});

  // Grup video per versi: setiap generate = 3 video (hook+value+cta) = 1 versi
  const versions: any[][] = React.useMemo(() => {
    if (!project?.videos?.length) return [];
    const sorted = [...project.videos].sort(
      (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
    );
    const chunks: any[][] = [];
    for (let i = 0; i < sorted.length; i += 3) {
      const chunk = sorted.slice(i, i + 3);
      chunk.sort((a, b) => (a.scene_index || 0) - (b.scene_index || 0));
      chunks.push(chunk);
    }
    return chunks;
  }, [project]);

  // Helper: normalisasi section_type ke "hook"/"value"/"cta"
  const normalizeSecType = (sectionType: string, idx: number): string => {
    const t = (sectionType || '').toLowerCase();
    if (t === 'hook' || t.includes('hook') || t.includes('perkenalan') || t.includes('intro')) return 'hook';
    if (t === 'value' || t.includes('value') || t.includes('nilai') || t.includes('unggulan') || t.includes('suasana')) return 'value';
    if (t === 'cta' || t.includes('cta') || t.includes('call') || t.includes('action') || t.includes('promosi')) return 'cta';
    return (['hook', 'value', 'cta'][idx]) ?? t;
  };

  // Storyboard narasi + visual per section_type
  // Sumber: rawSections (dedicated fetch) sebagai prioritas, fallback ke project.storyboard.sections
  const storyboardMap = React.useMemo(() => {
    const map: Record<string, { narration: string; visual: string }> = {};

    // Pilih sumber data terbaik
    const sections: any[] =
      (rawSections.length > 0 ? rawSections : project?.storyboard?.sections) ?? [];

    const parseContent = (raw: string): { narration: string; visual: string } => {
      if (!raw) return { narration: '', visual: '' };
      try {
        const parsed = JSON.parse(raw);
        return {
          narration: parsed.narration || parsed.content || raw,
          visual:    parsed.visual   || '',
        };
      } catch {
        // bukan JSON — anggap seluruhnya sebagai narasi
        return { narration: raw, visual: '' };
      }
    };

    sections.forEach((sec: any, idx: number) => {
      const entry = parseContent(sec.content);
      const guessed = normalizeSecType(sec.section_type || '', idx);
      map[guessed] = entry;
      map[(sec.section_type || '').toLowerCase()] = entry;
      map[String(idx)] = entry;
    });

    return map;
  }, [project, rawSections]);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const result = await getProjectById(projectId);
        if (result.success && result.data) {
          // Deduplicate videos to fix issue with identical videos appearing multiple times
          if (result.data.videos && result.data.videos.length > 0) {
            const uniqueVideos = [];
            const seenUrls = new Set();
            
            for (const v of result.data.videos) {
              // If video has a URL and we've seen it before, skip it
              if (v.video_url && seenUrls.has(v.video_url)) {
                continue;
              }
              if (v.video_url) {
                seenUrls.add(v.video_url);
              }
              uniqueVideos.push(v);
            }
            
            result.data.videos = uniqueVideos;
            setProject(result.data);
            // activeTab = indeks versi terakhir (bukan indeks video terakhir)
            // 1 versi = 3 video, jadi versi terakhir = ceil(total/3) - 1
            setActiveTab(Math.max(0, Math.ceil(uniqueVideos.length / 3) - 1));
          } else {
            setProject(result.data);
          }
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

    const fetchStoryboard = async () => {
      try {
        const res = await storyboardService.getStoryboardbyProjectId(projectId);
        if (res.success && res.data) {
          const sb = Array.isArray(res.data) ? res.data[0] : res.data as any;
          if (sb?.id) {
            setStoryboardId(sb.id);
            const secRes = await storyboardService.getStoryboardSections(sb.id);
            if (secRes.success && secRes.data?.length) {
              setRawSections(secRes.data);
              return;
            }
            if (sb.sections?.length) setRawSections(sb.sections);
          }
        }
      } catch (e) {
        console.warn('Gagal fetch storyboard sections:', e);
      }
    };

    fetchProject();
    fetchStoryboard();
  }, [projectId]);

  const startEditTitle = () => {
    setEditingTitleValue(project?.name || institutionName || '');
    setIsEditingTitle(true);
  };

  const cancelEditTitle = () => {
    setIsEditingTitle(false);
    setEditingTitleValue('');
  };

  const saveTitle = async () => {
    const newName = editingTitleValue.trim();
    if (!newName || !project) return;
    setIsSavingTitle(true);
    try {
      await renameProject(projectId, newName);
      setProject(prev => prev ? { ...prev, name: newName } : prev);
      setIsEditingTitle(false);
    } catch {
      alert('Gagal menyimpan nama project.');
    } finally {
      setIsSavingTitle(false);
    }
  };

  const startEditSection = (sectionType: string, currentNarration: string, currentVisual: string) => {
    setSectionEdit(prev => ({
      ...prev,
      [sectionType]: { isEditing: true, narration: currentNarration, visual: currentVisual, isSaving: false },
    }));
  };

  const cancelEditSection = (sectionType: string) => {
    setSectionEdit(prev => ({ ...prev, [sectionType]: { ...prev[sectionType], isEditing: false } }));
  };

  const saveSectionEdit = async (sectionType: string) => {
    const edit = sectionEdit[sectionType];
    if (!edit || !storyboardId) return;
    setSectionEdit(prev => ({ ...prev, [sectionType]: { ...prev[sectionType], isSaving: true } }));

    const newContent = JSON.stringify({ narration: edit.narration, visual: edit.visual });

    // Bangun payload semua sections — match by normalized section type
    const updatedSections = rawSections.map((sec: any, i: number) => ({
      section_type: sec.section_type,
      content: normalizeSecType(sec.section_type, i) === sectionType ? newContent : sec.content,
      duration: sec.duration,
    }));

    try {
      await storyboardService.updateStoryboard(storyboardId, { sections: updatedSections });
      // Update rawSections lokal
      setRawSections(prev => prev.map((sec: any) =>
        sec.section_type === sectionType ? { ...sec, content: newContent } : sec
      ));
      setSectionEdit(prev => ({ ...prev, [sectionType]: { ...prev[sectionType], isEditing: false, isSaving: false } }));
    } catch {
      alert('Gagal menyimpan perubahan narasi.');
      setSectionEdit(prev => ({ ...prev, [sectionType]: { ...prev[sectionType], isSaving: false } }));
    }
  };

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

  const openRegen = (videoId: string) => {
    setRegenState(prev => ({ ...prev, [videoId]: { isOpen: true, prompt: prev[videoId]?.prompt || '', isLoading: false } }));
  };

  const closeRegen = (videoId: string) => {
    setRegenState(prev => ({ ...prev, [videoId]: { ...prev[videoId], isOpen: false } }));
  };

  const handleRegenScene = async (videoId: string) => {
    setRegenState(prev => ({ ...prev, [videoId]: { ...prev[videoId], isLoading: true } }));
    try {
      const res = await videoService.regenerateScene(videoId, regenState[videoId]?.prompt || '');
      if (!res.success) throw new Error(res.message);

      setRegenState(prev => ({ ...prev, [videoId]: { isOpen: false, prompt: '', isLoading: false } }));

      // Update video in project state to processing immediately
      setProject(prev => {
        if (!prev?.videos) return prev;
        return { ...prev, videos: prev.videos.map((v: any) =>
          v.id === videoId ? { ...v, status: 'processing', video_url: null, thumbnail_url: null } : v
        )};
      });

      // Guard against duplicate polling
      if (pollingRefs.current[videoId]) return;
      pollingRefs.current[videoId] = true;

      await videoService.pollUntilComplete(
        videoId,
        (status) => {
          setProject(prev => {
            if (!prev?.videos) return prev;
            return { ...prev, videos: prev.videos.map((v: any) =>
              v.id === videoId
                ? { ...v, status: status.status, video_url: status.video_url, thumbnail_url: status.thumbnail_url }
                : v
            )};
          });
        },
        5000,
        120
      );

      pollingRefs.current[videoId] = false;
    } catch (err: any) {
      setRegenState(prev => ({ ...prev, [videoId]: { ...prev[videoId], isLoading: false } }));
      alert(err?.response?.data?.message || 'Gagal memulai regenerasi scene.');
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

      {/* Project Header Card */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e9ecef', padding: '1.5rem 1.75rem', marginBottom: '1.5rem', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          {/* Accent bar */}
          <div style={{ width: '4px', minHeight: '44px', background: 'linear-gradient(to bottom, #0d6efd, #6366f1)', borderRadius: '4px', flexShrink: 0, marginTop: '2px' }} />

          <div style={{ flex: 1 }}>
            {isEditingTitle ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  value={editingTitleValue}
                  onChange={(e) => setEditingTitleValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') cancelEditTitle(); }}
                  autoFocus
                  style={{ flex: 1, fontSize: '1.45rem', fontWeight: 700, color: '#111827', border: 'none', borderBottom: '2px solid #0d6efd', outline: 'none', padding: '0.1rem 0', backgroundColor: 'transparent', fontFamily: 'inherit' }}
                />
                <button
                  onClick={saveTitle}
                  disabled={isSavingTitle}
                  style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}
                >
                  {isSavingTitle ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  onClick={cancelEditTitle}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', backgroundColor: 'white', color: '#6c757d', border: '1px solid #dee2e6', borderRadius: '50px', cursor: 'pointer', flexShrink: 0 }}
                >
                  Batal
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                  {project.name || institutionName}
                </h1>
                <button
                  onClick={startEditTitle}
                  title="Edit nama project"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  Edit
                </button>
              </div>
            )}
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>
              {formatDate(project.created_at)}
            </p>
          </div>
        </div>

        {/* Meta chips row */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingLeft: '1.25rem' }}>
          {/* Scene count */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 600, color: '#0d6efd', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '50px', padding: '0.25rem 0.75rem' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
            {project.videos?.length || 0} Scene
          </span>
          {/* Total duration */}
          {versions.length > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 600, color: '#6366f1', backgroundColor: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '50px', padding: '0.25rem 0.75rem' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {versions.reduce((t: number, v: any[]) => t + v.reduce((s: number, x: any) => s + (x.duration || 6), 0), 0)}s Total
            </span>
          )}
          {/* Institution */}
          {institutionName !== '-' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 500, color: '#374151', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '50px', padding: '0.25rem 0.75rem' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              {institutionName.length > 30 ? institutionName.slice(0, 30) + '…' : institutionName}
            </span>
          )}
          {/* Event */}
          {eventContent !== '-' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 500, color: '#374151', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '50px', padding: '0.25rem 0.75rem' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {eventContent}
            </span>
          )}
          {/* Theme */}
          {themeName !== '-' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 500, color: '#374151', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '50px', padding: '0.25rem 0.75rem' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r="2.5"/><path d="M17 21v-1a4 4 0 0 0-8 0v1"/><circle cx="6.5" cy="13.5" r="2.5"/><path d="M10 21v-1a4 4 0 0 0-8 0v1"/></svg>
              {themeName}
            </span>
          )}
          {/* Tone */}
          {toneName !== '-' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 500, color: '#374151', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '50px', padding: '0.25rem 0.75rem' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
              {toneName}
            </span>
          )}
        </div>
      </div>

      {/* Storyboard & Scene Timeline */}
      {versions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>

          {/* Section title */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>Storyboard &amp; Scene Timeline</h2>
            {versions[activeTab]?.length > 0 && (
              <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                {versions[activeTab].reduce((sum: number, v: any) => sum + (v.duration || 6), 0)}s &bull; {versions[activeTab].length} scene
              </span>
            )}
          </div>

          {/* Version Tabs — 1 tab = 1x generate = 3 video */}
          {versions.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {versions.map((_, vIdx) => (
                <button
                  key={vIdx}
                  onClick={() => setActiveTab(vIdx)}
                  style={{
                    padding: '0.6rem 1.5rem',
                    backgroundColor: activeTab === vIdx ? '#0d6efd' : '#f8f9fa',
                    color: activeTab === vIdx ? 'white' : '#495057',
                    border: activeTab === vIdx ? '1px solid #0d6efd' : '1px solid #dee2e6',
                    borderRadius: '50px',
                    fontWeight: activeTab === vIdx ? 600 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    boxShadow: activeTab === vIdx ? '0 4px 10px rgba(13,110,253,0.25)' : 'none',
                  }}
                >
                  Versi {vIdx + 1}
                </button>
              ))}
            </div>
          )}

          {/* Storyboard & Scene Timeline */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Vertical connecting line */}
            {(versions[activeTab] || []).length > 1 && (
              <div style={{ position: 'absolute', left: '27px', top: '36px', bottom: '36px', width: '2px', backgroundColor: '#e9ecef', zIndex: 0 }} />
            )}

            {(versions[activeTab] || []).map((vid: any, sIdx: number) => {
              const sceneNames: Record<string, string> = {
                hook: 'Hook / Perkenalan',
                value: 'Nilai Unggulan',
                cta: 'Call to Action',
              };
              const sceneName = vid.section_type
                ? sceneNames[vid.section_type] || vid.section_type
                : `Video ${sIdx + 1}`;

              const isProcessing = ['pending', 'queued', 'generating_assets', 'processing', 'stitching_video'].includes(vid.status);
              const isReady = !!vid.video_url;
              const statusLabel = isReady ? 'Ready' : isProcessing ? 'Refining...' : (vid.status || 'Draft');

              const regen = regenState[vid.id] || { isOpen: false, prompt: '', isLoading: false };
              const storyboard = storyboardMap[(vid.section_type || '').toLowerCase()]
                ?? storyboardMap[String(sIdx)]
                ?? { narration: '', visual: '' };
              const secType = (vid.section_type || '').toLowerCase() || ['hook', 'value', 'cta'][sIdx] || `sec-${sIdx}`;
              const secEdit = sectionEdit[secType] || { isEditing: false, narration: storyboard.narration, visual: storyboard.visual, isSaving: false };

              // Hitung timestamp akumulatif
              const prevSec = (versions[activeTab] || []).slice(0, sIdx).reduce((s: number, v: any) => s + (v.duration || 6), 0);
              const mm = String(Math.floor(prevSec / 60)).padStart(2, '0');
              const ss = String(prevSec % 60).padStart(2, '0');
              const timestamp = `00:${mm}:${ss}`;

              const dotColors = ['#0d6efd', '#8b5cf6', '#f59e0b'];
              const dotColor = dotColors[sIdx % 3];

              return (
                <div key={vid.id || sIdx} style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>

                  {/* Timeline marker */}
                  <div style={{ width: '56px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '0.9rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: dotColor, color: 'white', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 3px white, 0 0 0 5px ${dotColor}40` }}>
                      {String(sIdx + 1).padStart(2, '0')}
                    </div>
                    <span style={{ fontSize: '0.6rem', color: '#9ca3af', marginTop: '0.35rem', fontFamily: 'monospace', letterSpacing: '0.02em' }}>
                      {timestamp}
                    </span>
                  </div>

                  {/* Card */}
                  <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e9ecef', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>

                    {/* Scene header */}
                    <div style={{ padding: '0.8rem 1.25rem', borderBottom: '1px solid #e9ecef', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', color: '#212529', fontWeight: 700 }}>
                        {sceneName}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={`${styles.statusBadge} ${isReady ? styles.statusReady : styles.statusDraft}`} style={isProcessing ? { backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffc107' } : {}}>
                          <span className={styles.statusDot}></span>
                          {statusLabel}
                        </span>
                        {!isProcessing && (
                          <button
                            onClick={() => regen.isOpen ? closeRegen(vid.id) : openRegen(vid.id)}
                            style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', backgroundColor: regen.isOpen ? '#eef2ff' : 'white', color: regen.isOpen ? '#4f46e5' : '#495057', border: `1px solid ${regen.isOpen ? '#c7d2fe' : '#ced4da'}`, borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontWeight: 500 }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
                            Re-generate
                          </button>
                        )}
                        {vid.video_url && (
                          <button
                            onClick={() => handleDownload(vid.video_url, `${institutionName.replace(/\s+/g, '_')}_V${activeTab + 1}_Scene${sIdx + 1}.mp4`)}
                            title="Download video"
                            style={{ width: '32px', height: '32px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inline re-generate prompt */}
                    {regen.isOpen && (
                      <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid #e9ecef', backgroundColor: '#f5f7ff', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#4f46e5', fontWeight: 600 }}>
                          Instruksi tambahan untuk scene ini (opsional)
                        </p>
                        <textarea
                          value={regen.prompt}
                          onChange={(e) => setRegenState(prev => ({ ...prev, [vid.id]: { ...prev[vid.id], prompt: e.target.value } }))}
                          placeholder="Contoh: gunakan tone lebih formal, tambahkan nuansa modern, fokus pada fasilitas lab..."
                          rows={2}
                          style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #c7d2fe', borderRadius: '8px', fontSize: '0.83rem', fontFamily: 'inherit', resize: 'none', outline: 'none', boxSizing: 'border-box', backgroundColor: 'white' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => closeRegen(vid.id)} style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem', backgroundColor: 'white', color: '#6c757d', border: '1px solid #dee2e6', borderRadius: '50px', cursor: 'pointer' }}>
                            Batal
                          </button>
                          <button
                            onClick={() => handleRegenScene(vid.id)}
                            disabled={regen.isLoading}
                            style={{ padding: '0.35rem 1.1rem', fontSize: '0.8rem', backgroundColor: regen.isLoading ? '#ced4da' : '#4f46e5', color: 'white', border: 'none', borderRadius: '50px', cursor: regen.isLoading ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            {regen.isLoading ? 'Memproses...' : 'Proses Re-generate'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Body: video kecil (kiri) + storyboard content (kanan) */}
                    <div style={{ display: 'flex' }}>

                      {/* Video — kiri, lebar 42%, rasio 16:9 */}
                      <div style={{ width: '42%', flexShrink: 0, borderRight: '1px solid #e9ecef', position: 'relative' }}>
                        {/* Padding trick untuk 16:9 agar tinggi card konsisten */}
                        <div style={{ paddingTop: '56.25%', position: 'relative', backgroundColor: '#0f0f1a' }}>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {vid.video_url ? (
                              <video
                                key={vid.video_url}
                                src={vid.video_url}
                                controls
                                playsInline
                                poster={vid.thumbnail_url || undefined}
                                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                              >
                                Browser tidak mendukung tag video.
                              </video>
                            ) : isProcessing ? (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                                <div className={styles.loadingSpinner} style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: dotColor, width: '32px', height: '32px', borderWidth: '3px' }} />
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Sedang diproses...</span>
                              </div>
                            ) : (
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                            )}
                          </div>
                          {/* Duration badge */}
                          {vid.duration > 0 && (
                            <div style={{ position: 'absolute', bottom: '6px', right: '6px', backgroundColor: 'rgba(0,0,0,0.65)', color: 'white', fontSize: '0.65rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', zIndex: 2 }}>
                              {vid.duration}s
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Storyboard content — kanan */}
                      <div style={{ flex: 1, padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', overflow: 'hidden' }}>

                        {/* AI Narration */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#0d6efd', textTransform: 'uppercase' as const, letterSpacing: '0.07em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill={dotColor}><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke={dotColor} strokeWidth="2"/><line x1="12" y1="19" x2="12" y2="23" stroke={dotColor} strokeWidth="2"/><line x1="8" y1="23" x2="16" y2="23" stroke={dotColor} strokeWidth="2"/></svg>
                              AI Narration
                            </div>
                            {!secEdit.isEditing ? (
                              <button
                                onClick={() => startEditSection(secType, storyboard.narration, storyboard.visual)}
                                style={{ fontSize: '0.7rem', color: '#6c757d', background: 'none', border: '1px solid #dee2e6', borderRadius: '50px', padding: '0.15rem 0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                              >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                Edit
                              </button>
                            ) : (
                              <div style={{ display: 'flex', gap: '0.3rem' }}>
                                <button
                                  onClick={() => saveSectionEdit(secType)}
                                  disabled={secEdit.isSaving}
                                  style={{ fontSize: '0.7rem', color: 'white', backgroundColor: secEdit.isSaving ? '#ced4da' : '#0d6efd', border: 'none', borderRadius: '50px', padding: '0.2rem 0.7rem', cursor: secEdit.isSaving ? 'not-allowed' : 'pointer', fontWeight: 600 }}
                                >
                                  {secEdit.isSaving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                                <button
                                  onClick={() => cancelEditSection(secType)}
                                  style={{ fontSize: '0.7rem', color: '#6c757d', background: 'white', border: '1px solid #dee2e6', borderRadius: '50px', padding: '0.2rem 0.6rem', cursor: 'pointer' }}
                                >
                                  Batal
                                </button>
                              </div>
                            )}
                          </div>
                          {secEdit.isEditing ? (
                            <textarea
                              value={secEdit.narration}
                              onChange={(e) => setSectionEdit(prev => ({ ...prev, [secType]: { ...prev[secType], narration: e.target.value } }))}
                              rows={4}
                              style={{ width: '100%', padding: '0.55rem 0.7rem', border: '1.5px solid #0d6efd', borderRadius: '8px', fontSize: '0.82rem', fontFamily: 'inherit', lineHeight: 1.55, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontStyle: 'italic', color: '#1f2937' }}
                            />
                          ) : (
                            <p style={{ margin: 0, fontSize: '0.83rem', color: '#1f2937', fontStyle: 'italic', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                              {storyboard.narration ? `"${storyboard.narration}"` : '—'}
                            </p>
                          )}
                        </div>

                        {/* Visual Description */}
                        <div>
                          <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: '0.35rem' }}>
                            Visual Description
                          </div>
                          {secEdit.isEditing ? (
                            <textarea
                              value={secEdit.visual}
                              onChange={(e) => setSectionEdit(prev => ({ ...prev, [secType]: { ...prev[secType], visual: e.target.value } }))}
                              rows={3}
                              style={{ width: '100%', padding: '0.55rem 0.7rem', border: '1.5px solid #ced4da', borderRadius: '8px', fontSize: '0.78rem', fontFamily: 'inherit', lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontStyle: 'italic', color: '#6b7280' }}
                            />
                          ) : (
                            <p style={{ margin: 0, fontSize: '0.78rem', color: storyboard.visual ? '#6b7280' : '#9ca3af', fontStyle: 'italic', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                              {storyboard.visual || '—'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={styles.videoWrapper} style={{ marginBottom: '3rem' }}>
          <div className={styles.videoSection}>
            <div className={styles.noVideo}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
              <p>Belum ada video yang di-generate.</p>
            </div>
          </div>
        </div>
      )}

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
