"use client";

import React, { useState, useEffect, Suspense } from 'react'; // 1. Import Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './storyboard.module.css';

// Interface Data Scene
interface Scene {
  id: string; time: string; title: string; duration: string; status: string;
  narration: string; visual: string; thumbnail: string | null;
  isEditing: boolean; isGeneratingVisual: boolean;
}

// Data Dummy untuk Halaman "Daftar Project" (List View)
// Data Dummy untuk Halaman "Daftar Project" (List View)
const mockSavedProjects = [
  { 
    id: '1', 
    institutionName: 'Universitas Gadjah Mada', 
    eventContent: 'Promosi Beasiswa', 
    toneOfVoice: 'Profesional & Formal', 
    selectedKeyMessage: 'Membangun kompetensi unggul.', 
    selectedTheme: 'Keunggulan Akademik', 
    date: 'Kemarin', 
    status: 'Ready',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '2', 
    institutionName: 'SMA Negeri 5 Surabaya', 
    eventContent: 'Dies Natalis Sekolah', 
    toneOfVoice: 'Kreatif & Inovatif', 
    selectedKeyMessage: 'Wujudkan ide gilamu menjadi karya nyata.', 
    selectedTheme: 'Tren & Gaya Hidup Cepat', 
    date: '3 hari yang lalu', 
    status: 'Draft',
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80'
  },
];

// 2. Ubah nama komponen utama menjadi StoryboardContent
function StoryboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [scenes, setScenes] = useState<Scene[]>([]);
  const [projectMeta, setProjectMeta] = useState({ title: 'Memuat Project...', duration: '00:00' });
  
  const [view, setView] = useState<'list' | 'storyboard' | 'output' | null>(null);
  
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  const loadStoryboardData = (data: any) => {
    setProjectMeta({
      title: `${data.eventContent || 'Project'} - ${data.institutionName || 'Kampus'}`,
      duration: '00:45'
    });

    const dynamicScenes: Scene[] = [
      {
        id: '01', time: '00:00:00', title: '1. Intro & Hook', duration: '00:15', status: 'Ready',
        narration: `"Halo generasi masa depan! Tahukah kamu bahwa ${data.selectedKeyMessage?.toLowerCase() || 'pendidikan itu penting'}"`,
        visual: `Visual bergaya ${data.toneOfVoice || 'Santai'}. Menampilkan gerbang utama atau landmark ikonik ${data.institutionName || 'kampus'}. Sesuai instruksi: ${data.prompt || 'Buat semenarik mungkin'}.`,
        thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80',
        isEditing: false, isGeneratingVisual: false
      },
      {
        id: '02', time: '00:00:15', title: '2. Suasana & Keunggulan Kampus', duration: '00:20', status: 'Ready',
        narration: `"Di ${data.institutionName || 'sini'}, kami siap membantumu mewujudkan impian itu melalui program unggulan kami."`,
        visual: `Gaya visual: ${data.selectedTheme || 'Sinematik'}. Memperlihatkan mahasiswa sedang beraktivitas, fasilitas modern, dan suasana belajar yang interaktif di dalam kampus.`,
        thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80',
        isEditing: false, isGeneratingVisual: false
      },
      {
        id: '03', time: '00:00:35', title: '3. Promosi & Call to Action', duration: '00:10', status: 'Asset Required',
        narration: `"Jangan lewatkan momen ${data.eventContent || 'pendaftaran'} tahun ini. Yuk, raih mimpimu bersama kami!"`,
        visual: `Logo ${data.institutionName || 'kampus'} muncul di tengah layar dengan teks ajakan (Call to Action). Animasi grafis dinamis menutup video.`,
        thumbnail: null,
        isEditing: false, isGeneratingVisual: false
      }
    ];
    setScenes(dynamicScenes);
  };

  useEffect(() => {
    const isNewProject = searchParams.get('new') === 'true';
    
    if (isNewProject) {
      const draft = localStorage.getItem('currentProjectDraft');
      if (draft) {
        loadStoryboardData(JSON.parse(draft));
        setView('storyboard');
      } else {
        setView('list');
      }
    } else {
      setView('list');
    }
  }, [searchParams]);

  const toggleEditScene = (id: string) => {
    setScenes((prev) => prev.map(s => s.id === id ? { ...s, isEditing: !s.isEditing } : s));
  };

  const handleSceneChange = (id: string, field: 'narration' | 'visual', value: string) => {
    setScenes((prev) => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleRegenerateVisual = (id: string) => {
    setScenes((prev) => prev.map(s => s.id === id ? { ...s, isGeneratingVisual: true } : s));
    setTimeout(() => {
      const randomImages = [
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1546410531-ea4cea4740db?auto=format&fit=crop&w=400&q=80',
      ];
      const newImage = randomImages[Math.floor(Math.random() * randomImages.length)];
      setScenes((prev) => prev.map(s => s.id === id ? { ...s, thumbnail: newImage, isGeneratingVisual: false, status: 'Ready' } : s));
    }, 3000);
  };

  const handleFinalRender = () => {
    setView('output');
    setIsRendering(true);
    setRenderProgress(0);
    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); setIsRendering(false); return 100; }
        return prev + 15;
      });
    }, 400);
  };

  if (view === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', flexDirection: 'column', gap: '1rem', color: '#6c757d' }}>
        <div className={styles.spinnerSmall} style={{width:'32px', height:'32px', border:'3px solid #e9ecef', borderTopColor:'#0d6efd'}}></div>
        Memuat Project Storyboard...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      
      {view === 'list' && (
        <div className={styles.listContainer}>
          <div className={styles.listHeader}>
            <div>
              <h1>Daftar Storyboard</h1>
              <p>Kelola dan lanjutkan pengeditan visual proyek Anda sebelum dirender.</p>
            </div>
            <button className={styles.btnPrimary} onClick={() => router.push('/dashboard/projects')}>
               + Project Baru
            </button>
          </div>

          <div className={styles.filterRow}>
            <div className={styles.searchContainer}>
              <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" className={styles.searchInput} placeholder="Cari nama project atau institusi..." />
            </div>
            <select className={styles.filterSelect}>
              <option>Semua Status</option>
              <option>Sedang Dikerjakan</option>
              <option>Ready</option>
              <option>Draft</option>
            </select>
            <select className={styles.filterSelect}>
              <option>Terbaru</option>
              <option>Terlama</option>
            </select>
          </div>

          <div className={styles.projectGrid}>
            {localStorage.getItem('currentProjectDraft') && (
              <div className={styles.projectCard} onClick={() => {
                loadStoryboardData(JSON.parse(localStorage.getItem('currentProjectDraft') || '{}'));
                setView('storyboard');
              }}>
                <div className={styles.cardImage}>
                  <div className={`${styles.badge} ${styles.badgeWorking}`}>Sedang Dikerjakan</div>
                  <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80" alt="Cover" />
                </div>
                <div className={styles.cardContent}>
                  <h3>{JSON.parse(localStorage.getItem('currentProjectDraft') || '{}').institutionName || 'Project Saya'}</h3>
                  <p>{JSON.parse(localStorage.getItem('currentProjectDraft') || '{}').eventContent || 'Event'}</p>
                  
                  <div className={styles.cardFooter}>
                    <span className={styles.dateText}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      Hari ini
                    </span>
                    <button className={styles.moreBtn} onClick={(e) => e.stopPropagation()}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {mockSavedProjects.map(proj => (
              <div key={proj.id} className={styles.projectCard}>
                <div className={styles.cardImage}>
                  <div className={`${styles.badge} ${proj.status === 'Ready' ? styles.badgeReady : styles.badgeDraft}`}>{proj.status}</div>
                  <img src={proj.thumbnail || ''} alt={proj.institutionName} />
                </div>
                <div className={styles.cardContent}>
                  <h3>{proj.institutionName}</h3>
                  <p>{proj.eventContent}</p>
                  
                  <div className={styles.cardFooter}>
                    <span className={styles.dateText}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      {proj.date}
                    </span>
                    <button className={styles.moreBtn}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className={styles.newProjectCard} onClick={() => router.push('/dashboard/projects')}>
              <div className={styles.iconPlus}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </div>
              <span>Buat Storyboard Baru</span>
            </div>
          </div>
        </div>
      )}

      {view === 'storyboard' && (
        <>
          <header className={styles.headerInfo}>
            <button className={styles.btnGhost} onClick={() => setView('list')} style={{marginBottom: '1rem', padding: 0}}>← Kembali ke Daftar</button>
            <h1>Storyboard & Scene Timeline</h1>
            <p>Project: <b>{projectMeta.title}</b> • {projectMeta.duration} Total Duration</p>
          </header>

          <div className={styles.timeline}>
            {scenes.map((scene) => (
              <div key={scene.id} className={styles.sceneItem}>
                <div className={styles.sceneNumber}>{scene.id}</div>
                <div className={styles.sceneTime}>{scene.time}</div>

                <div className={styles.sceneCard}>
                  <div className={styles.previewSection}>
                    {scene.thumbnail ? (
                      <div className={styles.thumbnailWrapper}>
                        {scene.isGeneratingVisual && (
                          <div className={styles.loadingOverlay}>
                            <div className={styles.spinnerSmall}></div>Membuat Aset...
                          </div>
                        )}
                        <img src={scene.thumbnail} alt={scene.title} />
                        <div className={styles.playOverlay}>▶</div>
                        <span className={styles.sceneDuration}>{scene.duration}</span>
                      </div>
                    ) : (
                      <div className={`${styles.thumbnailWrapper} ${styles.assetRequired}`}>
                        {scene.isGeneratingVisual ? (
                           <div className={styles.loadingOverlay}><div className={styles.spinnerSmall}></div>Membuat Aset...</div>
                        ) : (
                          <><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg> ASSET REQUIRED</>
                        )}
                      </div>
                    )}

                    <div className={styles.cardActions}>
                      {scene.isEditing ? (
                        <button className={styles.btnActionSave} onClick={() => toggleEditScene(scene.id)}>✓ Simpan Teks</button>
                      ) : (
                        <button className={styles.btnAction} onClick={() => toggleEditScene(scene.id)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            Edit Teks
                        </button>
                      )}
                      <button className={styles.btnActionGenerate} onClick={() => handleRegenerateVisual(scene.id)} disabled={scene.isGeneratingVisual || scene.isEditing}>
                        {scene.isGeneratingVisual ? '⏳ Memproses...' : '✨ Re-generate Visual'}
                      </button>
                    </div>
                  </div>

                  <div className={styles.contentSection}>
                    <div className={styles.sceneTitle}>
                      <h3>{scene.title}</h3>
                      {scene.status === 'Ready' && <span style={{color: '#0d6efd'}}>✓</span>}
                    </div>

                    <div className={styles.sectionLabel}>AI NARRATION (SULIH SUARA)</div>
                    {scene.isEditing ? (
                      <textarea className={`${styles.editArea} ${styles.editAreaNarrative}`} value={scene.narration} onChange={(e) => handleSceneChange(scene.id, 'narration', e.target.value)} />
                    ) : (
                      <p className={styles.narrationText}>{scene.narration}</p>
                    )}

                    <div className={styles.sectionLabel}>VISUAL PROMPT (ARAHAN VISUAL)</div>
                    {scene.isEditing ? (
                      <textarea className={`${styles.editArea} ${styles.editAreaVisual}`} value={scene.visual} onChange={(e) => handleSceneChange(scene.id, 'visual', e.target.value)} />
                    ) : (
                      <p className={styles.visualDescription}>{scene.visual}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.bottomActionArea}>
             <button className={styles.btnPrimaryLarge} onClick={handleFinalRender}>Combine & Render Final Video ✨</button>
          </div>
        </>
      )}

      {view === 'output' && (
        <>
          <div className={styles.progressCard}>
            <div className={styles.progressIcon}>
              {isRendering ? <div className={styles.spinnerSmall} style={{width:'24px', height:'24px', borderWidth:'3px', borderColor:'#0d6efd', borderTopColor:'transparent'}}></div> : '✨'}
            </div>
            <div className={styles.progressInfo}>
              <h3>{isRendering ? 'AI sedang meramu video Anda...' : 'Video Berhasil Dibuat!'}</h3>
              <p>{isRendering ? 'Menggabungkan aset visual dan voiceover...' : 'Video marketing Anda siap.'}</p>
              <div className={styles.progressBarWrapper}>
                <div className={styles.progressBar}><div className={styles.progressFill} style={{width: `${renderProgress}%`}}></div></div>
                <span style={{fontSize: '0.8rem', fontWeight: 600}}>{renderProgress}%</span>
              </div>
            </div>
          </div>

          {!isRendering && (
            <>
              <div className={styles.videoPlayer}>
                <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80" alt="Video Cover" />
                <div className={styles.playBtnLarge}>▶</div>
              </div>
              <div className={styles.videoActions}>
                <button className={styles.btnPrimary}>↓ Download Video</button>
                <button className={styles.btnOutline} onClick={() => router.push('/dashboard/library')}>🔖 Simpan ke Library</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// 3. Komponen Utama Membungkus StoryboardContent dengan Suspense
export default function StoryboardPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', flexDirection: 'column', gap: '1rem', color: '#6c757d' }}>
        <div className={styles.spinnerSmall} style={{width:'32px', height:'32px', border:'3px solid #e9ecef', borderTopColor:'#0d6efd'}}></div>
        Memuat Modul Storyboard...
      </div>
    }>
      <StoryboardContent />
    </Suspense>
  );
}