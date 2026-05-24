"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from '@/app/(main)/layout.module.css';
import { videoService } from '@/services/video.service';

interface AppNotification {
  id: string;
  videoId?: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export default function TopActions() {
  const [showNotif, setShowNotif] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  // Load notifications from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sevima_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Poll for worker status
  useEffect(() => {
    const pollVideos = async () => {
      try {
        const res = await videoService.listVideos();
        if (res.success && res.data) {
          const currentVideos = res.data;
          const cacheKey = 'sevima_video_status_cache';
          const cached = localStorage.getItem(cacheKey);
          let prevVideos: any[] = [];
          
          if (cached) {
            try {
              prevVideos = JSON.parse(cached);
            } catch (e) {}
          }

          let newNotifications: AppNotification[] = [];

          currentVideos.forEach(video => {
            const prev = prevVideos.find(v => v.id === video.id);
            if (prev) {
              // Check if status changed from processing to completed/failed
              if (prev.status === 'processing' && video.status === 'completed') {
                newNotifications.push({
                  id: Date.now().toString() + Math.random(),
                  videoId: video.id,
                  title: 'Video Selesai',
                  message: `Video AI "${video.title || 'Tanpa Judul'}" telah selesai dibuat!`,
                  date: new Date().toISOString(),
                  read: false
                });
              } else if (prev.status === 'processing' && video.status === 'failed') {
                newNotifications.push({
                  id: Date.now().toString() + Math.random(),
                  videoId: video.id,
                  title: 'Video Gagal',
                  message: `Pembuatan video "${video.title || 'Tanpa Judul'}" gagal. Silakan coba lagi.`,
                  date: new Date().toISOString(),
                  read: false
                });
              }
            }
          });

          if (newNotifications.length > 0) {
            setNotifications(prev => {
              const updated = [...newNotifications, ...prev];
              localStorage.setItem('sevima_notifications', JSON.stringify(updated));
              return updated;
            });
          }

          // Update cache
          localStorage.setItem(cacheKey, JSON.stringify(currentVideos));
        }
      } catch (err) {
        console.error("Failed to poll videos", err);
      }
    };

    // Poll immediately, then every 10 seconds
    pollVideos();
    const interval = setInterval(pollVideos, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHelp = () => {
    setShowHelp(true);
  };

  const handleNotifClick = () => {
    setShowNotif(!showNotif);
    if (!showNotif && notifications.some(n => !n.read)) {
      // Mark all as read when opening
      const updated = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updated);
      localStorage.setItem('sevima_notifications', JSON.stringify(updated));
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={styles.profileActions} style={{ position: 'relative', display: 'flex', gap: '8px' }}>
      <div ref={notifRef} style={{ position: 'relative' }}>
        <button 
          className={styles.iconButton} 
          onClick={handleNotifClick}
          title="Notifications"
          style={{ position: 'relative' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              backgroundColor: '#ef4444',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              minWidth: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {showNotif && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            backgroundColor: '#ffffff',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '1rem',
            width: '300px',
            zIndex: 100,
            marginTop: '8px',
            color: '#212529',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Notifikasi Terbaru</h4>
              {notifications.length > 0 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotifications([]);
                    localStorage.removeItem('sevima_notifications');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6c757d',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Bersihkan
                </button>
              )}
            </div>
            
            <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: '8px' }}>
              {notifications.length === 0 ? (
                <p style={{ margin: 0, fontSize: '12px', color: '#6c757d', textAlign: 'center', padding: '16px 0' }}>Belum ada notifikasi baru untuk Anda hari ini.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ 
                      padding: '10px', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '6px',
                      borderLeft: '3px solid #0d6efd'
                    }}>
                      <h5 style={{ margin: '0 0 4px 0', fontSize: '13px' }}>{n.title}</h5>
                      <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#495057' }}>{n.message}</p>
                      <span style={{ fontSize: '10px', color: '#adb5bd' }}>
                        {new Date(n.date).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <button 
        className={styles.iconButton} 
        onClick={handleHelp}
        title="Tentang Aplikasi"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </button>

      {/* Modern Help Modal */}
      {showHelp && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }} onClick={() => setShowHelp(false)}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            width: '90%',
            maxWidth: '420px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            position: 'relative',
            animation: 'fadeIn 0.2s ease-out'
          }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowHelp(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#adb5bd', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div style={{
              width: '48px', height: '48px', backgroundColor: '#eef2ff', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
            }}>
              <img src="/favicon.png" alt="Sevima AI Logo" width={32} height={32} style={{ borderRadius: '8px' }} />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#111827' }}>Sevima AI Video Gen</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', lineHeight: '1.6', color: '#4b5563' }}>
              Aplikasi ini adalah platform pembuatan video pembelajaran otomatis berbasis AI. Anda bisa mengunggah materi, dan sistem akan mengonversinya menjadi naskah, papan cerita (storyboard), hingga video utuh lengkap dengan sulih suara (voiceover).
            </p>
            <button 
              onClick={() => setShowHelp(false)}
              style={{
                width: '100%', padding: '10px 16px', backgroundColor: '#4f46e5', color: '#ffffff',
                border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px',
                cursor: 'pointer', transition: 'background-color 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#4338ca'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#4f46e5'}
            >
              Mengerti
            </button>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}} />
        </div>
      )}
    </div>
  );
}
