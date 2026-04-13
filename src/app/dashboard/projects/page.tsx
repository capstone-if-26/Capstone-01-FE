"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from './projects.module.css';

const themesByPillar: Record<string, { id: string, desc: string }[]> = {
  'Educational': [
    { id: 'Step-by-Step Tutorial', desc: 'Panduan lengkap langkah demi langkah' },
    { id: 'Industry Insights', desc: 'Berita dan tren perkembangan terbaru' },
    { id: 'Problem & Solution', desc: 'Cara mengatasi kendala umum audiens' },
    { id: 'Product How-to', desc: 'Cara maksimal menggunakan fitur' }
  ],
  'Promotional': [
    { id: 'Feature Highlight', desc: 'Fokus pada fitur unggulan dan manfaat' },
    { id: 'Limited Time Offer', desc: 'Menciptakan urgensi promo terbatas' }
  ],
  'Behind the Scenes': [
    { id: 'Team Profile', desc: 'Mengenalkan sosok profesional tim' },
    { id: 'Work Process', desc: 'Mengintip proses pembuatan produk' }
  ]
};

export default function NewProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Ref untuk elemen yang akan di-export ke PDF
  const briefRef = useRef<HTMLDivElement>(null);

  // ================= STATES: BUSINESS BRIEF (Step 1) =================
  const [schoolName, setSchoolName] = useState('');
  const [eventContent, setEventContent] = useState('');
  const [schoolLevel, setSchoolLevel] = useState('');
  const [audiences, setAudiences] = useState<string[]>(['Millennials', 'Pelajar']);
  const [audienceInput, setAudienceInput] = useState('');
  const [brandPersonality, setBrandPersonality] = useState('Friendly');

  // ================= STATES: CONTENT BRIEF (Step 2) =================
  const [marketingGoal, setMarketingGoal] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [keyMessage, setKeyMessage] = useState('');
  const [cta, setCta] = useState('');
  const [prompt, setPrompt] = useState('');

  // ================= STATES: PILLAR & THEME (Step 3) =================
  const [contentPillar, setContentPillar] = useState('Educational');
  const [contentTheme, setContentTheme] = useState('Step-by-Step Tutorial');

  // Efek untuk reset Theme jika Pillar berubah
  useEffect(() => {
    if (themesByPillar[contentPillar]) {
      setContentTheme(themesByPillar[contentPillar][0].id);
    }
  }, [contentPillar]);

  // ================= FUNGSI TARGET AUDIENCE =================
  const handleAddAudience = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && audienceInput.trim() !== '') {
      e.preventDefault();
      if (!audiences.includes(audienceInput.trim())) {
        setAudiences([...audiences, audienceInput.trim()]);
      }
      setAudienceInput('');
    }
  };

  const removeAudience = (tagToRemove: string) => {
    setAudiences(audiences.filter(tag => tag !== tagToRemove));
  };

  // ================= FUNGSI VALIDASI & NAVIGASI =================
  const handleNext = () => {
    // Validasi Step 1
    if (currentStep === 1) {
      if (!schoolName || !eventContent || !schoolLevel || audiences.length === 0) {
        alert("Mohon lengkapi semua data Business Brief (termasuk minimal 1 Target Audience) sebelum melanjutkan.");
        return;
      }
    }
    // Validasi Step 2
    if (currentStep === 2) {
      if (!marketingGoal || !videoDuration || !keyMessage || !cta || !prompt) {
        alert("Mohon lengkapi semua data Content Brief sebelum melanjutkan.");
        return;
      }
    }
    // Lanjut jika lolos validasi
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // ================= FUNGSI GENERATE VIDEO =================
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      router.push('/dashboard/storyboard');
    }, 3000);
  };

  // ================= FUNGSI EXPORT PDF =================
  const handleExportPDF = async () => {
    if (!briefRef.current) return;
    try {
      // Mengubah elemen HTML menjadi Canvas (Gambar)
      const canvas = await html2canvas(briefRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      // Inisialisasi PDF (A4 Portrait)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Memasukkan gambar ke PDF dan menyimpannya
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Creative_Brief_${schoolName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Gagal mengekspor PDF:", error);
      alert("Terjadi kesalahan saat mengekspor PDF.");
    }
  };

  return (
    <div className={styles.container}>
      {/* POP-UP MODAL LOADING */}
      {isGenerating && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.spinner}></div>
            <h3>Menyusun Storyboard...</h3>
            <p>AI sedang memecah Creative Brief menjadi scene-scene visual. Mohon tunggu sebentar.</p>
          </div>
        </div>
      )}

      {/* STEPPER HEADER */}
      <div className={styles.stepper}>
        <div className={styles.stepLine}></div>
        <div className={styles.stepLineActive} style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '33%' : currentStep === 3 ? '66%' : '100%' }}></div>
        
        <div className={`${styles.stepItem} ${currentStep >= 1 ? styles.active : ''}`}><div className={styles.stepCircle}>1</div><span className={styles.stepText}>Business Brief</span></div>
        <div className={`${styles.stepItem} ${currentStep >= 2 ? styles.active : ''}`}><div className={styles.stepCircle}>2</div><span className={styles.stepText}>Content Brief</span></div>
        <div className={`${styles.stepItem} ${currentStep >= 3 ? styles.active : ''}`}><div className={styles.stepCircle}>3</div><span className={styles.stepText}>Content Pillar</span></div>
        <div className={`${styles.stepItem} ${currentStep >= 4 ? styles.active : ''}`}><div className={styles.stepCircle}>4</div><span className={styles.stepText}>Creative Brief</span></div>
      </div>

      {/* ================= STEP 1: BUSINESS BRIEF ================= */}
      {currentStep === 1 && (
        <div className={styles.card}>
          <h2>Business Brief</h2>
          <p className={styles.subtitle}>Ceritakan tentang institusi/bisnis Anda untuk hasil yang lebih personal.</p>
          
          <div className={styles.formGroup}>
            <label>Nama Sekolah/Institusi <span style={{color:'red'}}>*</span></label>
            <input type="text" className={styles.input} placeholder="Contoh: Universitas Brawijaya" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
          </div>

          <div className={styles.formGroup}>
            <label>Event Content <span style={{color:'red'}}>*</span></label>
            <select className={styles.select} value={eventContent} onChange={(e) => setEventContent(e.target.value)}>
              <option value="">-- Pilih Kebutuhan --</option>
              <option value="Penerimaan Mahasiswa Baru">Penerimaan Mahasiswa Baru</option>
              <option value="Dies Natalis">Dies Natalis</option>
              <option value="Promosi Beasiswa">Promosi Beasiswa</option>
              <option value="Fasilitas Kampus">Tour Fasilitas Kampus</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Tingkat Sekolah <span style={{color:'red'}}>*</span></label>
            <select className={styles.select} value={schoolLevel} onChange={(e) => setSchoolLevel(e.target.value)}>
              <option value="">-- Pilih Tingkat Sekolah --</option>
              <option value="PreSchool">PreSchool</option>
              <option value="TK">TK</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
              <option value="SMK">SMK</option>
              <option value="Perguruan Tinggi">Perguruan Tinggi</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Target Audience <span style={{color:'red'}}>*</span></label>
            <div className={styles.pillContainer}>
              {audiences.map((aud) => (
                <div key={aud} className={styles.pill}>
                  {aud} <button type="button" onClick={() => removeAudience(aud)}>✕</button>
                </div>
              ))}
              <input 
                type="text" 
                className={styles.pillInput} 
                placeholder="Ketik & tekan Enter untuk tambah"
                value={audienceInput}
                onChange={(e) => setAudienceInput(e.target.value)}
                onKeyDown={handleAddAudience}
              />
            </div>
            <small style={{color: '#6c757d', marginTop: '4px', display:'block'}}>Contoh: Siswa SMA, Orang Tua, Profesional</small>
          </div>

          <div className={styles.formGroup}>
            <label>Brand Personality</label>
            <div className={styles.grid4}>
              {['Friendly', 'Professional', 'Creative', 'Authoritative'].map((brand) => (
                <div key={brand} className={`${styles.selectCard} ${brandPersonality === brand ? styles.selected : ''}`} onClick={() => setBrandPersonality(brand)}>
                  <h4>{brand}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.footerActions}>
            <button className={styles.btnPrimary} onClick={handleNext}>Lanjut ke Content Brief →</button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: CONTENT BRIEF ================= */}
      {currentStep === 2 && (
        <div className={styles.card}>
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Marketing Goal <span style={{color:'red'}}>*</span></label>
              <select className={styles.select} value={marketingGoal} onChange={(e) => setMarketingGoal(e.target.value)}>
                <option value="">-- Pilih Tujuan --</option>
                <option value="Brand Awareness">Brand Awareness</option>
                <option value="Lead Generation (Pendaftaran)">Lead Generation (Pendaftaran)</option>
                <option value="Engagement">Engagement & Community</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Video Duration <span style={{color:'red'}}>*</span></label>
              <select className={styles.select} value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)}>
                <option value="">-- Pilih Durasi --</option>
                <option value="Short (15 detik)">Short (15 detik)</option>
                <option value="Medium (30 detik)">Medium (30 detik)</option>
                <option value="Long (60 detik)">Long (60 detik)</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Key Message / Pesan Utama <span style={{color:'red'}}>*</span></label>
            <input type="text" className={styles.input} placeholder="Contoh: Masa depan cerah dimulai dari pendidikan yang tepat." value={keyMessage} onChange={(e) => setKeyMessage(e.target.value)} />
          </div>

          <div className={styles.formGroup}>
            <label>Call to Action (CTA) <span style={{color:'red'}}>*</span></label>
            <input type="text" className={styles.input} placeholder="Contoh: Daftar sekarang di sevima.com/pmb" value={cta} onChange={(e) => setCta(e.target.value)} />
          </div>

          <div className={styles.formGroup}>
            <label>Specific Requirements / Prompt Tambahan <span style={{color:'red'}}>*</span></label>
            <textarea className={styles.textarea} placeholder="Contoh: Gunakan tone suara yang ceria, masukkan elemen warna biru kampus..." value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>
          </div>

          <div className={styles.footerActions}>
            <button className={styles.btnOutline} onClick={prevStep}>← Kembali</button>
            <button className={styles.btnPrimary} onClick={handleNext}>Lanjut ke Content Pillar →</button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: CONTENT PILLAR ================= */}
      {currentStep === 3 && (
        <div className={styles.card}>
          <h3 style={{marginBottom: '1rem'}}>1. Pilih Content Pillar</h3>
          <div className={`${styles.grid3} ${styles.formGroup}`}>
            {Object.keys(themesByPillar).map((pillar) => (
              <div key={pillar} className={`${styles.selectCard} ${contentPillar === pillar ? styles.selected : ''}`} onClick={() => setContentPillar(pillar)} style={{textAlign: 'left'}}>
                <h4>{pillar}</h4>
              </div>
            ))}
          </div>

          <h3 style={{marginBottom: '1rem', marginTop: '2rem'}}>2. Pilih Konsep (Tema)</h3>
          <div className={styles.card} style={{backgroundColor: '#f8f9fa', padding: '1.5rem'}}>
            <div className={styles.grid2}>
               {themesByPillar[contentPillar]?.map((theme) => (
                 <div key={theme.id} className={`${styles.selectCard} ${contentTheme === theme.id ? styles.selected : ''}`} onClick={() => setContentTheme(theme.id)} style={{flexDirection: 'row', alignItems: 'center', textAlign: 'left', padding: '1rem'}}>
                   <input type="radio" checked={contentTheme === theme.id} readOnly style={{marginRight: '0.5rem'}}/>
                   <div><h4 style={{fontSize: '0.95rem'}}>{theme.id}</h4><p>{theme.desc}</p></div>
                 </div>
               ))}
            </div>
          </div>

          <div className={styles.footerActions}>
            <button className={styles.btnGhost} onClick={prevStep}>← Kembali</button>
            <button className={styles.btnPrimary} onClick={handleNext}>Buat Creative Brief ✨</button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: CREATIVE BRIEF (HASIL DINAMIS) ================= */}
      {currentStep === 4 && (
        <div className={styles.card}>
          
          {/* Bungkus area ini dengan ID agar mudah dibaca oleh html2canvas */}
          <div id="creative-brief-content" ref={briefRef} style={{ padding: '1rem', backgroundColor: 'white' }}>
            <h2>Creative Brief: {schoolName}</h2>
            <p className={styles.subtitle}>{marketingGoal} · {videoDuration} · Gaya: {brandPersonality} · {schoolLevel}</p>

            <h4 className={styles.briefSectionTitle}>CORE IDEA</h4>
            <div className={styles.briefBox}>
              <h5>BIG IDEA / THEME</h5>
              <p>Membahas <b>{contentTheme}</b> dalam rangka <b>{eventContent}</b> untuk memikat perhatian {audiences.join(', ')}.</p>
            </div>
            <div className={styles.briefBox}>
              <h5>KEY MESSAGE</h5>
              <p>"{keyMessage}"</p>
            </div>

            <h4 className={styles.briefSectionTitle}>FORMAT & STYLING</h4>
            <div className={styles.grid3} style={{marginBottom: '1.5rem'}}>
              <div className={styles.briefBox} style={{textAlign:'center', marginBottom:0}}>
                <h5>CONTENT PILLAR</h5><p>{contentPillar}</p>
              </div>
              <div className={styles.briefBox} style={{textAlign:'center', marginBottom:0}}>
                <h5>DURASI</h5><p>{videoDuration}</p>
              </div>
              <div className={styles.briefBox} style={{textAlign:'center', marginBottom:0}}>
                <h5>PERSONALITY</h5><p>{brandPersonality}</p>
              </div>
            </div>

            <h4 className={styles.briefSectionTitle}>EXECUTION & FLOW</h4>
            <div className={styles.blueBox}>
              <h5>TARGET AUDIENCE</h5>
              <p>{audiences.join(' • ')}</p>
            </div>
            
            <div className={styles.numberedList}>
              <div className={styles.numberedItem}>
                <div className={styles.numBadge}>1</div>
                <p className={styles.itemText}><b>Opening Hook</b> — Sapa langsung audiens ({audiences[0]}) dan angkat relevansi terkait {eventContent}.</p>
              </div>
              <div className={styles.numberedItem}>
                <div className={styles.numBadge}>2</div>
                <p className={styles.itemText}><b>Value Proposition</b> — {prompt ? prompt : `Jelaskan keunggulan ${schoolName} sesuai dengan tema ${contentTheme}.`}</p>
              </div>
              <div className={styles.numberedItem}>
                <div className={styles.numBadge}>3</div>
                <p className={styles.itemText}><b>Resolution</b> — {keyMessage}</p>
              </div>
            </div>

            <div className={styles.dashedBox}>
              <h5>CALL TO ACTION (CTA)</h5>
              <p>"{cta}"</p>
            </div>
          </div>

          <div className={styles.footerActions} style={{marginTop: '2rem'}}>
            <button className={styles.btnGhost} onClick={prevStep}>← Edit Data</button>
            
            {/* Tombol Export PDF memanggil fungsi handleExportPDF */}
            <button className={styles.btnOutline} onClick={handleExportPDF}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '6px', verticalAlign: 'middle'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
               Export PDF
            </button>
            
            <button className={styles.btnPrimary} onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? 'Memproses...' : 'Generate Video Assets ✨'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}