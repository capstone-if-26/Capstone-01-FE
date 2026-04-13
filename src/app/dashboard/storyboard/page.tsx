"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- Import Router
import styles from './storyboard.module.css';

// Data Awal Scene
const initialScenes = [
  {
    id: '01',
    time: '00:00:00',
    title: 'Establishing the Urban Canopy',
    duration: '00:15',
    status: 'Ready',
    narration: '"Imagine a world where the concrete jungle breathes. Welcome to the dawn of the sustainable era..."',
    visual: 'Slow zoom into a lush skyscraper covered in cascading vines. Drones can be seen in the distance.',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '02',
    time: '00:00:15',
    title: 'The Pulse of Transport',
    duration: '00:22',
    status: 'Ready',
    narration: '"Silent, efficient, and powered by the sun. Our transit systems no longer divide communities..."',
    visual: 'Fast motion tracking of a MagLev train passing through a glass tunnel. Light reflections play on the commuters\' faces.',
    thumbnail: 'https://images.unsplash.com/photo-1474487585632-70d065808a41?auto=format&fit=crop&w=400&q=80'
  }
];

export default function StoryboardPage() {
  const router = useRouter();
  
  // States
  const [scenes, setScenes] = useState(initialScenes);
  const [view, setView] = useState<'storyboard' | 'output'>('storyboard');
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  // Fungsi untuk mensimulasikan Re-generate per scene
  const handleRegenerateScene = (id: string) => {
    // 1. Ubah status menjadi Refining
    setScenes((prev) => prev.map(s => s.id === id ? { ...s, status: 'Refining' } : s));
    
    // 2. Simulasi selesai setelah 2.5 detik
    setTimeout(() => {
      setScenes((prev) => prev.map(s => s.id === id ? { ...s, status: 'Ready' } : s));
    }, 2500);
  };

  // Fungsi untuk mensimulasikan Render Video Utama
  const handleFinalRender = () => {
    setView('output');
    setIsRendering(true);
    setRenderProgress(0);

    // Animasi Progress Bar
    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          return 100;
        }
        return prev + 15; // Kecepatan progress
      });
    }, 400);
  };

  // Fungsi navigasi ke Library
  const handleSaveToLibrary = () => {
    router.push('/dashboard/library');
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerInfo}>
        <h1>{view === 'storyboard' ? 'Storyboard & Scene Timeline' : 'Final Video Output'}</h1>
        <p>Project: <b>The Future of Sustainable Cities</b> • 02:45 Total Duration</p>
      </header>

      {/* ================= TAMPILAN STORYBOARD ================= */}
      {view === 'storyboard' && (
        <>
          <div className={styles.timeline}>
            {scenes.map((scene) => (
              <div key={scene.id} className={styles.sceneItem}>
                <div className={styles.sceneNumber}>{scene.id}</div>
                <div className={styles.sceneTime}>{scene.time}</div>

                <div className={styles.sceneCard}>
                  {/* Bagian Visual (Kiri) */}
                  <div className={styles.previewSection}>
                    <div className={styles.thumbnailWrapper}>
                      <img src={scene.thumbnail} alt={scene.title} />
                      <div className={styles.playOverlay}>▶</div>
                      <span className={styles.sceneDuration}>{scene.duration}</span>
                    </div>

                    <div className={styles.cardActions}>
                      <button 
                        className={styles.btnAction} 
                        onClick={() => handleRegenerateScene(scene.id)}
                        disabled={scene.status === 'Refining'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                        {scene.status === 'Refining' ? 'Memproses...' : 'Re-generate'}
                      </button>
                      <button className={styles.btnDownload}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{margin:'0 auto'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                      </button>
                    </div>
                  </div>

                  {/* Bagian Konten/Teks (Kanan) */}
                  <div className={styles.contentSection}>
                    <div className={styles.sceneTitle}>
                      <h3>{scene.title}</h3>
                      {scene.status === 'Ready' && <span style={{color: '#0d6efd'}}>✓</span>}
                      {scene.status === 'Refining' && (
                        <span className={styles.badgeRefining}>
                          <div className={styles.spinnerSmall}></div> Refining...
                        </span>
                      )}
                    </div>

                    <div className={styles.sectionLabel}>AI NARRATION</div>
                    <p className={styles.narrationText}>{scene.narration}</p>

                    <div className={styles.sectionLabel}>VISUAL DESCRIPTION</div>
                    <p className={styles.visualDescription}>{scene.visual}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.bottomActionArea}>
             <button className={styles.btnPrimaryLarge} onClick={handleFinalRender}>
                Combine & Render Final Video ✨
             </button>
          </div>
        </>
      )}

      {/* ================= TAMPILAN VIDEO OUTPUT ================= */}
      {view === 'output' && (
        <>
          <div className={styles.progressCard}>
            <div className={styles.progressIcon}>
              {isRendering ? <div className={styles.spinnerSmall} style={{width:'24px', height:'24px', borderWidth:'3px', borderColor:'#0d6efd', borderTopColor:'transparent'}}></div> : '✨'}
            </div>
            <div className={styles.progressInfo}>
              <h3>{isRendering ? 'AI sedang meramu video Anda...' : 'Video Berhasil Dibuat!'}</h3>
              <p>{isRendering ? 'Menggabungkan aset visual, voiceover, dan transisi cinematik.' : 'Video marketing Anda sudah siap diunduh atau disimpan.'}</p>
              
              <div className={styles.progressBarWrapper}>
                <span style={{fontSize: '0.8rem', color: '#0d6efd', fontWeight: 600}}>
                  {isRendering ? 'Rendering Audio & Visual' : 'Selesai'}
                </span>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{width: `${renderProgress}%`}}></div>
                </div>
                <span style={{fontSize: '0.8rem', fontWeight: 600}}>{renderProgress}%</span>
              </div>
            </div>
          </div>

          {/* Menampilkan video player dan tombol hanya jika rendering sudah selesai */}
          {!isRendering && (
            <>
              <div className={styles.videoPlayer}>
                <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80" alt="Video Cover" />
                <div className={styles.playBtnLarge}>▶</div>
                <div className={styles.videoControls}>
                  <span>⏸</span>
                  <div className={styles.progressBar} style={{height: '4px'}}><div className={styles.progressFill} style={{width: '30%'}}></div></div>
                  <span style={{fontSize: '0.8rem'}}>01:24 / 02:45</span>
                  <span>🔊</span>
                  <span>🔲</span>
                </div>
              </div>

              <div className={styles.videoActions}>
                <button className={styles.btnPrimary}>↓ Download Video</button>
                {/* TOMBOL PENTING: MENGARAH KE LIBRARY */}
                <button className={styles.btnOutline} onClick={handleSaveToLibrary}>🔖 Simpan ke Library</button>
                
                <div style={{marginLeft: 'auto', display: 'flex', gap: '0.5rem'}}>
                  <button className={styles.btnIcon}>🔗</button>
                  <button className={styles.btnIcon}>⋮</button>
                </div>
              </div>
            </>
          )}
        </>
      )}

    </div>
  );
}