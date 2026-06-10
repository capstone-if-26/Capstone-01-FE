"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

// ── Reusable mini components ──────────────────────────────────────────
function Badge({ children, color = '#0d6efd' }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 700, color: 'white', background: color, borderRadius: '4px', padding: '2px 7px', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
      {children}
    </span>
  );
}

function ScreenSection({ id, step, title, subtitle, color, children }: {
  id: string; step: string; title: string; subtitle: string; color: string; children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ marginBottom: '3.5rem', scrollMarginTop: '80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'white' }}>{step}</span>
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#111827' }}>{title}</h2>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280' }}>{subtitle}</p>
        </div>
      </div>
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        {children}
      </div>
    </section>
  );
}

// Mini screen mockup wrapper
function MockBrowser({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div style={{ background: '#f3f4f6', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
        <div style={{ flex: 1, height: '24px', background: '#e5e7eb', borderRadius: '6px', marginLeft: '8px' }} />
      </div>
      <div style={{ padding: '1.5rem', background: '#f9fafb', minHeight: '260px' }}>
        {children}
      </div>
    </div>
  );
}

function MockSidebar() {
  const items = ['Dashboard', 'Projects', 'Library', 'Settings'];
  return (
    <div style={{ width: '140px', background: 'white', borderRight: '1px solid #e5e7eb', padding: '1rem 0.75rem', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem' }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#4f46e5' }} />
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#111827' }}>Sevima AI</span>
      </div>
      {items.map((item, i) => (
        <div key={item} style={{ padding: '6px 8px', borderRadius: '6px', background: i === 0 ? '#eef2ff' : 'transparent', fontSize: '0.72rem', color: i === 0 ? '#4f46e5' : '#6b7280', fontWeight: i === 0 ? 600 : 400, marginBottom: '2px' }}>
          {item}
        </div>
      ))}
    </div>
  );
}

function MockLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '260px' }}>
      <MockSidebar />
      <div style={{ flex: 1, padding: '1.25rem', overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

function DescBox({ items }: { items: { text: string }[] }) {
  return (
    <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #e5e7eb', background: 'white' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.5 }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PAGE ─────────────────────────────────────────────────────────────
export default function GuidePage() {
  const router = useRouter();

  const sections = [
    { id: 'dashboard',    label: 'Dashboard' },
    { id: 'step1',        label: 'Business Brief' },
    { id: 'step2',        label: 'Creative Brief' },
    { id: 'step3',        label: 'Tema Video' },
    { id: 'step4',        label: 'Ringkasan' },
    { id: 'step5',        label: 'Storyboard' },
    { id: 'preview',      label: 'Preview & Download' },
    { id: 'library',      label: 'Library' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

      {/* Sticky top nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 14px', fontSize: '0.8rem', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Kembali
        </button>
        <div style={{ height: '20px', width: '1px', background: '#e5e7eb' }} />
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', flex: 1 }}>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{ fontSize: '0.72rem', fontWeight: 500, color: '#6b7280', whiteSpace: 'nowrap', padding: '4px 10px', borderRadius: '20px', textDecoration: 'none', background: '#f3f4f6' }}>
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
          </div>
          <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem', fontWeight: 800, color: '#111827' }}>Sevima AI Video Gen</h1>
          <p style={{ margin: '0 auto', fontSize: '0.95rem', color: '#6b7280', maxWidth: '520px', lineHeight: 1.7 }}>
            Platform pembuatan video promosi institusi pendidikan berbasis AI. Unggah profil kampus → sistem menghasilkan storyboard → video 3 scene otomatis.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {['5 Langkah Mudah', '3 Scene per Video', 'AI-Generated Prompt', 'WaveSpeed Veo 3.1'].map(tag => (
              <span key={tag} style={{ fontSize: '0.72rem', fontWeight: 600, color: '#4f46e5', background: '#eef2ff', borderRadius: '20px', padding: '3px 10px' }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* ── DASHBOARD ── */}
        <ScreenSection id="dashboard" step="DB" title="Dashboard" subtitle="Halaman utama — buat project baru atau lihat project yang ada" color="#0ea5e9">
          <MockBrowser>
            <MockLayout>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#9ca3af', marginBottom: '2px' }}>Selamat datang kembali</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Dashboard</div>
                  </div>
                  <div style={{ padding: '6px 14px', background: '#4f46e5', color: 'white', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600 }}>+ Buat Project</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                  {[{ l: 'Total Project', v: '12' }, { l: 'Video Selesai', v: '8' }, { l: 'Kredit Tersisa', v: '240' }].map(s => (
                    <div key={s.l} style={{ background: '#f3f4f6', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>{s.v}</div>
                      <div style={{ fontSize: '0.62rem', color: '#9ca3af' }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: '10px', padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Project Terbaru</div>
                  {['Video PMB ITS 2025', 'Promosi Beasiswa UNAIR', 'Kampus Sinematik Undip'].map((p, i) => (
                    <div key={p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: i < 2 ? '1px solid #e5e7eb' : 'none' }}>
                      <span style={{ fontSize: '0.7rem', color: '#374151' }}>{p}</span>
                      <Badge color={i === 0 ? '#10b981' : i === 1 ? '#f59e0b' : '#6b7280'}>{i === 0 ? 'Selesai' : i === 1 ? 'Proses' : 'Draft'}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </MockLayout>
          </MockBrowser>
          <DescBox items={[
            { text: 'Tampilkan statistik project, video selesai, dan sisa kredit' },
            { text: 'Daftar project terbaru dengan status (Draft, Proses, Selesai)' },
            { text: 'Tombol "Buat Project" untuk memulai alur pembuatan video baru' },
          ]} />
        </ScreenSection>

        {/* ── STEP 1 ── */}
        <ScreenSection id="step1" step="1" title="Business Brief" subtitle="Isi profil institusi & upload aset visual (logo + foto lingkungan)" color="#6366f1">
          <MockBrowser>
            <MockLayout>
              <div>
                {/* Stepper */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem', alignItems: 'center' }}>
                  {['Business', 'Creative', 'Tema', 'Ringkasan', 'Storyboard'].map((s, i) => (
                    <React.Fragment key={s}>
                      <div style={{ fontSize: '0.6rem', fontWeight: i === 0 ? 700 : 400, color: i === 0 ? '#4f46e5' : '#9ca3af', background: i === 0 ? '#eef2ff' : '#f3f4f6', borderRadius: '20px', padding: '2px 8px', whiteSpace: 'nowrap' }}>{s}</div>
                      {i < 4 && <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />}
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.62rem', color: '#9ca3af', marginBottom: '4px' }}>Nama Institusi *</div>
                    <div style={{ background: '#f3f4f6', borderRadius: '6px', padding: '6px 8px', fontSize: '0.72rem', color: '#374151' }}>Institut Teknologi Sepuluh Nopember</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.62rem', color: '#9ca3af', marginBottom: '4px' }}>Tingkat Sekolah *</div>
                    <div style={{ background: '#f3f4f6', borderRadius: '6px', padding: '6px 8px', fontSize: '0.72rem', color: '#374151' }}>Perguruan Tinggi</div>
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.62rem', color: '#9ca3af', marginBottom: '4px' }}>Referensi Kampus (PDF/DOC/TXT)</div>
                  <div style={{ background: '#f3f4f6', border: '1px dashed #d1d5db', borderRadius: '6px', padding: '10px', fontSize: '0.7rem', color: '#9ca3af', textAlign: 'center' }}>
                    Upload file → auto-isi semua field
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <div style={{ background: '#f3f4f6', border: '1px dashed #d1d5db', borderRadius: '6px', padding: '12px', textAlign: 'center', fontSize: '0.65rem', color: '#9ca3af' }}>Logo Institut</div>
                  <div style={{ background: '#f3f4f6', border: '1px dashed #d1d5db', borderRadius: '6px', padding: '12px', textAlign: 'center', fontSize: '0.65rem', color: '#9ca3af' }}>Foto Lingkungan</div>
                </div>
              </div>
            </MockLayout>
          </MockBrowser>
          <DescBox items={[
            { text: 'Upload PDF/DOC/TXT → otomatis isi semua field termasuk program studi & latar belakang' },
            { text: 'Upload logo (PNG/JPG) dan foto lingkungan kampus untuk digunakan di mode Image/Start-End video' },
            { text: 'Semua field bisa diedit manual setelah auto-fill dari dokumen' },
          ]} />
        </ScreenSection>

        {/* ── STEP 2 ── */}
        <ScreenSection id="step2" step="2" title="Creative Brief" subtitle="Pilih event, durasi per scene, mode video AI, tone & pesan utama" color="#8b5cf6">
          <MockBrowser>
            <MockLayout>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.62rem', color: '#9ca3af', marginBottom: '4px' }}>Event / Kebutuhan *</div>
                    <div style={{ background: '#f3f4f6', borderRadius: '6px', padding: '6px 8px', fontSize: '0.72rem', color: '#374151' }}>Penerimaan Mahasiswa Baru</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.62rem', color: '#9ca3af', marginBottom: '4px' }}>Durasi Per Scene *</div>
                    <div style={{ background: '#f3f4f6', borderRadius: '6px', padding: '6px 8px', fontSize: '0.72rem', color: '#374151' }}>Medium (6 detik)</div>
                  </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.62rem', color: '#9ca3af', marginBottom: '6px' }}>Mode Generasi Video</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                    {[
                      { l: 'Text to Video', c: 'x1', sel: true },
                      { l: 'Image to Video', c: 'x2', sel: false },
                      { l: 'Start-End', c: 'x3', sel: false },
                    ].map(m => (
                      <div key={m.l} style={{ border: m.sel ? '2px solid #4f46e5' : '1px solid #e5e7eb', borderRadius: '8px', padding: '6px', textAlign: 'center', background: m.sel ? '#eef2ff' : 'white' }}>
                        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: m.sel ? '#4f46e5' : '#374151' }}>{m.l}</div>
                        <div style={{ fontSize: '0.55rem', color: m.sel ? '#6366f1' : '#9ca3af' }}>{m.c} kredit</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: '0.62rem', color: '#9ca3af', marginBottom: '4px' }}>Tone of Voice</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                  {['Santai', 'Formal', 'Kreatif', 'Berwibawa'].map((t, i) => (
                    <div key={t} style={{ border: i === 1 ? '2px solid #4f46e5' : '1px solid #e5e7eb', borderRadius: '6px', padding: '4px', textAlign: 'center', fontSize: '0.58rem', fontWeight: i === 1 ? 700 : 400, color: i === 1 ? '#4f46e5' : '#9ca3af' }}>{t}</div>
                  ))}
                </div>
              </div>
            </MockLayout>
          </MockBrowser>
          <DescBox items={[
            { text: '3 mode video: Text-to-Video (x1), Image-to-Video (x2), Start-End (x3 kredit)' },
            { text: 'Durasi per scene: Short 4s / Medium 6s / Long 8s — total = durasi × 3 scene' },
            { text: '4 tone: Santai & Ramah / Profesional & Formal / Kreatif & Inovatif / Berwibawa' },
            { text: 'Pilih Key Message dari opsi yang sesuai dengan tone yang dipilih' },
          ]} />
        </ScreenSection>

        {/* ── STEP 3 ── */}
        <ScreenSection id="step3" step="3" title="Tema Video" subtitle="Pilih kerangka visual untuk seluruh video" color="#ec4899">
          <MockBrowser>
            <MockLayout>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Pilih Tema Video</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { t: 'Tur Kampus Sinematik', d: 'Aerial drone, golden hour, arsitektur megah', sel: false },
                    { t: 'Cerita Kehidupan Mahasiswa', d: 'Keseharian, UKM, suasana autentik', sel: false },
                    { t: 'Keunggulan Akademik', d: 'Lab canggih, riset, prestasi internasional', sel: true },
                    { t: 'Tren & Gaya Hidup Cepat', d: 'Fast-cut, Gen Z aesthetic, energetik', sel: false },
                  ].map(theme => (
                    <div key={theme.t} style={{ border: theme.sel ? '2px solid #ec4899' : '1px solid #e5e7eb', borderRadius: '10px', padding: '0.75rem', background: theme.sel ? '#fdf4ff' : 'white' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: theme.sel ? '#ec4899' : '#374151', marginBottom: '2px' }}>{theme.t}</div>
                      <div style={{ fontSize: '0.6rem', color: '#9ca3af' }}>{theme.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </MockLayout>
          </MockBrowser>
          <DescBox items={[
            { text: 'Sinematik: drone shot, golden hour, gerakan slow-motion' },
            { text: 'Mahasiswa: montage autentik kehidupan kampus sehari-hari' },
            { text: 'Akademik: lab, riset, pencapaian, infografis prestasi' },
            { text: 'Tren: fast-cut energetik, warna vibrant, estetika Gen Z' },
          ]} />
        </ScreenSection>

        {/* ── STEP 4 ── */}
        <ScreenSection id="step4" step="4" title="Ringkasan Proyek" subtitle="Review semua pilihan, edit copywriting & hashtag, lalu generate storyboard" color="#f59e0b">
          <MockBrowser>
            <MockLayout>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.58rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase' as const, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Step 1 · Business Brief</div>
                  {[['Institusi', 'ITS'], ['Jenjang', 'Perguruan Tinggi'], ['Program Studi', 'Teknik Informatika…']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: '0.5rem', marginBottom: '3px' }}>
                      <span style={{ fontSize: '0.6rem', color: '#9ca3af', minWidth: '70px' }}>{k}</span>
                      <span style={{ fontSize: '0.62rem', color: '#374151' }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: '0.58rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase' as const, margin: '0.5rem 0', letterSpacing: '0.05em' }}>Step 2 · Creative Brief</div>
                  {[['Event', 'PMB'], ['Durasi', 'Medium (6s)'], ['Mode', 'Text to Video × x1']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: '0.5rem', marginBottom: '3px' }}>
                      <span style={{ fontSize: '0.6rem', color: '#9ca3af', minWidth: '70px' }}>{k}</span>
                      <span style={{ fontSize: '0.62rem', color: '#374151' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ background: '#f3f4f6', borderRadius: '8px', padding: '0.6rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Copywriting Caption</div>
                    <div style={{ fontSize: '0.6rem', color: '#6b7280', lineHeight: 1.5 }}>Halo generasi masa depan! Tahukah kamu bahwa inovasi pendidikan modern…</div>
                  </div>
                  <div style={{ background: '#f3f4f6', borderRadius: '8px', padding: '0.6rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Hashtags</div>
                    <div style={{ fontSize: '0.6rem', color: '#4f46e5' }}>#ITS #PMB2025 #KampusImpian</div>
                  </div>
                  <div style={{ padding: '8px 12px', background: '#4f46e5', color: 'white', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 600, textAlign: 'center' }}>Generate Storyboard</div>
                </div>
              </div>
            </MockLayout>
          </MockBrowser>
          <DescBox items={[
            { text: 'Review lengkap: Business Brief, Creative Brief, Tema — semua terlihat di satu halaman' },
            { text: 'Edit copywriting caption dan hashtag langsung sebelum generate' },
            { text: 'Export ke PDF untuk dokumentasi atau presentasi ke klien' },
            { text: 'Klik Generate Storyboard → AI menyusun narasi + visual 3 scene otomatis' },
          ]} />
        </ScreenSection>

        {/* ── STEP 5 ── */}
        <ScreenSection id="step5" step="5" title="Storyboard Editor" subtitle="Edit narasi & visual tiap scene, lalu generate video ke WaveSpeed Veo" color="#10b981">
          <MockBrowser>
            <MockLayout>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Naskah Storyboard — 3 Scene</div>
                {[
                  { id: '01', title: '1. Hook / Perkenalan', narration: 'Institut Teknologi Sepuluh Nopember — institusi unggulan yang berkomitmen mencetak pemimpin terbaik.', visual: 'Aerial drone shot sinematik kampus ITS saat golden hour…' },
                  { id: '02', title: '2. Nilai Unggulan', narration: 'Dengan program Teknik Informatika, Teknik Elektro… kami mempersiapkan Anda menghadapi tantangan global.', visual: 'Tracking shot menelusuri laboratorium canggih ITS…' },
                ].map(scene => (
                  <div key={scene.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#4f46e5', color: 'white', fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{scene.id}</div>
                    <div style={{ background: '#f3f4f6', borderRadius: '8px', padding: '0.6rem', flex: 1 }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>{scene.title}</div>
                      <div style={{ fontSize: '0.58rem', color: '#6b7280', lineHeight: 1.4 }}>{scene.narration}</div>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <div style={{ padding: '6px 14px', background: '#10b981', color: 'white', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 600 }}>Generate 3 Scene Videos</div>
                </div>
              </div>
            </MockLayout>
          </MockBrowser>
          <DescBox items={[
            { text: '3 scene otomatis: Hook / Nilai Unggulan / CTA — narasi & visual disesuaikan tone, tema, dan event yang dipilih' },
            { text: 'Edit narasi sulih suara dan visual prompt tiap scene sebelum generate' },
            { text: 'Durasi tiap scene sesuai pilihan di Creative Brief (4s / 6s / 8s)' },
            { text: '1x klik Generate = 3 video dikirim ke WaveSpeed Veo 3.1 sekaligus paralel — tidak ada generate per-scene satuan' },
          ]} />
        </ScreenSection>

        {/* ── PREVIEW ── */}
        <ScreenSection id="preview" step="▶" title="Preview & Download" subtitle="1 versi = 3 scene video berurutan. Tab muncul tiap kali regenerate sebagai versi baru." color="#0ea5e9">
          <MockBrowser>
            <MockLayout>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Video Promosi ITS 2025</div>

                {/* Version tabs — hanya muncul jika regenerate */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '0.75rem', alignItems: 'center' }}>
                  {[{ l: 'Versi 1', a: false }, { l: 'Versi 2', a: true }].map(tab => (
                    <div key={tab.l} style={{ padding: '3px 10px', borderRadius: '20px', background: tab.a ? '#0ea5e9' : '#f3f4f6', color: tab.a ? 'white' : '#6b7280', fontSize: '0.6rem', fontWeight: tab.a ? 600 : 400 }}>{tab.l}</div>
                  ))}
                  <span style={{ fontSize: '0.53rem', color: '#9ca3af' }}>← tab baru tiap regenerate</span>
                </div>

                {/* Dalam 1 versi: 3 scene berurutan (stacked) */}
                {[
                  { s: 'Scene 1 — Hook / Perkenalan' },
                  { s: 'Scene 2 — Nilai Unggulan' },
                  { s: 'Scene 3 — Call to Action' },
                ].map((scene, i) => (
                  <div key={i} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '0.4rem', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#374151' }}>{scene.s}</span>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.55rem', color: '#10b981', fontWeight: 600 }}>● Ready</span>
                        <div style={{ padding: '2px 8px', background: '#0d6efd', color: 'white', borderRadius: '10px', fontSize: '0.55rem', fontWeight: 600 }}>Download</div>
                      </div>
                    </div>
                    <div style={{ background: '#1f2937', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                  </div>
                ))}
              </div>
            </MockLayout>
          </MockBrowser>
          <DescBox items={[
            { text: 'Tab = per versi generate. Jika hanya 1x generate → tidak ada tab (langsung tampil). Tab muncul mulai dari Versi 2 saat regenerate.' },
            { text: '1 versi = 3 scene video berurutan (Hook → Nilai → CTA) ditampilkan sekaligus dalam satu halaman, bukan bergantian' },
            { text: 'Setiap scene punya tombol Download sendiri — format MP4' },
            { text: '"Edit Ulang Storyboard" → kembali ke editor → klik Generate lagi → versi baru (tab baru) dengan 3 video baru' },
          ]} />
        </ScreenSection>

        {/* ── LIBRARY ── */}
        <ScreenSection id="library" step="LIB" title="Library" subtitle="Semua video yang pernah dibuat — cari, preview, dan download ulang" color="#6366f1">
          <MockBrowser>
            <MockLayout>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827' }}>Library Video</div>
                  <div style={{ background: '#f3f4f6', borderRadius: '6px', padding: '4px 8px', fontSize: '0.62rem', color: '#6b7280' }}>Cari project…</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {[
                    { name: 'PMB ITS 2025', status: 'Selesai', scenes: 3, color: '#10b981' },
                    { name: 'Beasiswa UNAIR', status: 'Proses', scenes: 2, color: '#f59e0b' },
                    { name: 'Kampus Undip', status: 'Draft', scenes: 0, color: '#9ca3af' },
                  ].map(v => (
                    <div key={v.name} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ background: '#1f2937', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                      </div>
                      <div style={{ padding: '6px 8px' }}>
                        <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#374151' }}>{v.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <Badge color={v.color}>{v.status}</Badge>
                          <span style={{ fontSize: '0.55rem', color: '#9ca3af' }}>{v.scenes} scene</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </MockLayout>
          </MockBrowser>
          <DescBox items={[
            { text: 'Semua project & video tersimpan dan bisa diakses kapan saja' },
            { text: 'Cari project berdasarkan nama atau status' },
            { text: 'Klik project untuk masuk ke halaman Preview & Download' },
            { text: 'Buka kembali untuk edit storyboard dan re-generate video' },
          ]} />
        </ScreenSection>

        {/* Credit flow */}
        <div style={{ background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)', borderRadius: '16px', padding: '1.5rem', color: 'white', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Sistem Kredit</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {[
              { mode: 'Text to Video', formula: 'Durasi × 3 scene × 1', example: '6s × 3 × 1 = 18 kredit' },
              { mode: 'Image to Video', formula: 'Durasi × 3 scene × 2', example: '6s × 3 × 2 = 36 kredit' },
              { mode: 'Start-End to Video', formula: 'Durasi × 3 scene × 3', example: '6s × 3 × 3 = 54 kredit' },
            ].map(c => (
              <div key={c.mode} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: '4px' }}>{c.mode}</div>
                <div style={{ fontSize: '0.62rem', opacity: 0.8, marginBottom: '2px' }}>{c.formula}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, background: 'rgba(255,255,255,0.2)', borderRadius: '4px', padding: '2px 6px', display: 'inline-block' }}>{c.example}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', marginTop: '2rem' }}>
          Sevima AI Video Gen — Powered by WaveSpeed Veo 3.1 Lite
        </p>
      </div>
    </div>
  );
}
