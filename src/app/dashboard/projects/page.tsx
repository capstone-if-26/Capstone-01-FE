"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  // States
  const [brandPersonality, setBrandPersonality] = useState('Friendly');
  const [contentPillar, setContentPillar] = useState('Educational');
  const [contentTheme, setContentTheme] = useState('Step-by-Step Tutorial');
  
  // State untuk Pop-up Loading
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (themesByPillar[contentPillar]) {
      setContentTheme(themesByPillar[contentPillar][0].id);
    }
  }, [contentPillar]);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // Fungsi simulasi loading AI lalu pindah ke Storyboard
  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulasi AI bekerja selama 3 detik
    setTimeout(() => {
      router.push('/dashboard/storyboard');
    }, 3000);
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

      {/* STEPPER HEADER (4 Langkah) */}
      <div className={styles.stepper}>
        <div className={styles.stepLine}></div>
        <div className={styles.stepLineActive} style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '33%' : currentStep === 3 ? '66%' : '100%' }}></div>
        
        <div className={`${styles.stepItem} ${currentStep >= 1 ? styles.active : ''}`}>
          <div className={styles.stepCircle}>1</div>
          <span className={styles.stepText}>Business Brief</span>
        </div>
        <div className={`${styles.stepItem} ${currentStep >= 2 ? styles.active : ''}`}>
          <div className={styles.stepCircle}>2</div>
          <span className={styles.stepText}>Content Brief</span>
        </div>
        <div className={`${styles.stepItem} ${currentStep >= 3 ? styles.active : ''}`}>
          <div className={styles.stepCircle}>3</div>
          <span className={styles.stepText}>Content Pillar</span>
        </div>
        <div className={`${styles.stepItem} ${currentStep >= 4 ? styles.active : ''}`}>
          <div className={styles.stepCircle}>4</div>
          <span className={styles.stepText}>Creative Brief</span>
        </div>
      </div>

      {/* ================= STEP 1: FULL BUSINESS BRIEF ================= */}
      {currentStep === 1 && (
        <div className={styles.card}>
          <h2>Business Brief</h2>
          <p className={styles.subtitle}>Tell us about your business to help Sevima AI generate highly relevant and personalized content.</p>
          
          <div className={styles.formGroup}>
            <label>Nama Sekolah/Institusi</label>
            <input type="text" className={styles.input} placeholder="Isi nama Sekolah/Institusi" />
          </div>

          <div className={styles.formGroup}>
            <label>Event Content</label>
            <select className={styles.select}>
              <option>Pilih Kebutuhan</option>
              <option>Penerimaan Mahasiswa Baru</option>
              <option>Dies Natalis</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Tingkat Sekolah</label>
            <select className={styles.select}>
              <option>PreSchool, TK, SD, SMA, SMK, Perguruan Tinggi.</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Target Audience</label>
            <div className={styles.pillContainer}>
              <div className={styles.pill}>
                Millennials <button>✕</button>
              </div>
              <div className={styles.pill}>
                Small Business Owners <button>✕</button>
              </div>
              <button className={styles.pillAdd}>+ Add Audience</button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Brand Personality</label>
            <div className={styles.grid4}>
              {['Friendly', 'Professional', 'Creative', 'Authoritative'].map((brand) => (
                <div 
                  key={brand} 
                  className={`${styles.selectCard} ${brandPersonality === brand ? styles.selected : ''}`}
                  onClick={() => setBrandPersonality(brand)}
                >
                  <div style={{fontSize: '1.5rem'}}>
                    {brand === 'Friendly' && '😊'}
                    {brand === 'Professional' && '💼'}
                    {brand === 'Creative' && '💡'}
                    {brand === 'Authoritative' && '🎓'}
                  </div>
                  <h4>{brand}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.footerActions}>
            <button className={styles.btnPrimary} onClick={nextStep}>
              Lanjut ke Content Brief →
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: FULL CONTENT BRIEF ================= */}
      {currentStep === 2 && (
        <div className={styles.card}>
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Marketing Goal</label>
              <select className={styles.select}>
                <option>Select your objective</option>
                <option>Brand Awareness</option>
                <option>Lead Generation</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Video Duration</label>
              <select className={styles.select}>
                <option>Medium (30 seconds)</option>
                <option>Short (15 seconds)</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Key Message</label>
            <input type="text" className={styles.input} placeholder="e.g. Revolutionize your workflow with AI-driven insights" />
          </div>

          <div className={styles.formGroup}>
            <label>Call to Action (CTA)</label>
            <input type="text" className={styles.input} placeholder="e.g. Try for free at sevima.ai" />
          </div>

          <div className={styles.formGroup}>
            <label>Specific Requirements / Prompt</label>
            <textarea className={styles.textarea} placeholder="Describe visual style, tone of voice, or any specific details you want the AI to include..."></textarea>
            <p style={{fontSize: '0.8rem', color: '#6c757d', marginTop: '0.5rem'}}>ⓘ Tip: Be as detailed as possible for better AI generation results.</p>
          </div>

          <div className={styles.footerActions}>
            <button className={styles.btnOutline} onClick={prevStep}>← Kembali</button>
            <button className={styles.btnPrimary} onClick={nextStep}>
              Lanjut ke Content Pillar →
            </button>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoBoxIcon}>💡</div>
            <div className={styles.infoBoxContent}>
              <h4>How it works?</h4>
              <p>Sevima AI analyzes your brief to curate scenes, generate natural voiceovers, and synchronize background music that matches your marketing goal perfectly.</p>
            </div>
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
            <button className={styles.btnPrimary} onClick={nextStep}>
              Buat Creative Brief ✨
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: CREATIVE BRIEF (DARI AI) ================= */}
      {currentStep === 4 && (
        <div className={styles.card}>
          <h2>Creative Brief</h2>
          <p className={styles.subtitle}>Financial Awareness · TikTok Short Video · 30 detik · {brandPersonality}</p>

          <h4 className={styles.briefSectionTitle}>CORE IDEA</h4>
          <div className={styles.briefBox}>
            <h5>BIG IDEA</h5>
            <p>Kebocoran keuangan bukan soal gaji kecil — tapi kebiasaan yang gak disadari.</p>
          </div>
          <div className={styles.briefBox}>
            <h5>KEY MESSAGE</h5>
            <p>Sadar dulu, baru bisa berubah.</p>
          </div>

          <h4 className={styles.briefSectionTitle}>FORMAT</h4>
          <div className={styles.grid3} style={{marginBottom: '1.5rem'}}>
            <div className={styles.briefBox} style={{textAlign:'center', marginBottom:0}}>
              <h5>PLATFORM</h5><p>TikTok</p>
            </div>
            <div className={styles.briefBox} style={{textAlign:'center', marginBottom:0}}>
              <h5>FORMAT</h5><p>Short Video</p>
            </div>
            <div className={styles.briefBox} style={{textAlign:'center', marginBottom:0}}>
              <h5>DURASI</h5><p>30 detik</p>
            </div>
          </div>

          <h4 className={styles.briefSectionTitle}>EXECUTION</h4>
          <div className={styles.blueBox}>
            <h5>HOOK</h5>
            <p>"Gaji baru masuk, udah habis?"</p>
          </div>
          
          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <div className={styles.numBadge}>1</div>
              <p className={styles.itemText}><b>Opening problem</b> — Angkat rasa frustrasi saat gaji langsung ludes tanpa tau ke mana perginya.</p>
            </div>
            <div className={styles.numberedItem}>
              <div className={styles.numBadge}>2</div>
              <p className={styles.itemText}><b>Relatable scene</b> — Visualisasi habit sehari-hari: kopi, langganan, impuls beli, dll.</p>
            </div>
            <div className={styles.numberedItem}>
              <div className={styles.numBadge}>3</div>
              <p className={styles.itemText}><b>Insight</b> — Bukan soal jumlah gaji, tapi soal awareness pengeluaran kecil yang numpuk.</p>
            </div>
            <div className={styles.numberedItem}>
              <div className={styles.numBadge}>4</div>
              <p className={styles.itemText}><b>Solution</b> — Mulai dari hal simpel: catat & cek pengeluaran hari ini.</p>
            </div>
          </div>

          <div className={styles.dashedBox}>
            <h5>CTA</h5>
            <p>"Coba cek pengeluaran lo hari ini"</p>
          </div>

          <h4 className={styles.briefSectionTitle}>VISUAL DIRECTION</h4>
          <div className={styles.pillContainer} style={{marginBottom: '1rem'}}>
            <span className={styles.pill} style={{border:'none', backgroundColor:'#f1f3f5', color:'#495057'}}>Casual</span>
            <span className={styles.pill} style={{border:'none', backgroundColor:'#f1f3f5', color:'#495057'}}>Relatable</span>
            <span className={styles.pill} style={{border:'none', backgroundColor:'#f1f3f5', color:'#495057'}}>Authentic</span>
          </div>
          <div className={styles.briefBox}>
            <p style={{fontWeight:'normal', fontSize:'0.9rem', color:'#495057'}}>TikTok storytelling — talking head, on-screen text, everyday setting (kamar/dapur)</p>
          </div>

          <h4 className={styles.briefSectionTitle}>COPYWRITING</h4>
          <p style={{color:'#495057', fontSize:'0.95rem', lineHeight:'1.6'}}>Gaji abis sebelum akhir bulan? Bukan soal gaji lo kecil — tapi pengeluaran kecil yang gak lo sadari. Mulai dari sekarang, cek dulu ke mana uang lo pergi.</p>
          <div className={styles.hashtagList}>
            <span className={styles.hashtag}>#gajihabis</span>
            <span className={styles.hashtag}>#finansialpribadi</span>
            <span className={styles.hashtag}>#financialawareness</span>
            <span className={styles.hashtag}>#tipskeuangan</span>
            <span className={styles.hashtag}>#budgeting</span>
          </div>

          <div className={styles.footerActions} style={{marginTop: '3rem'}}>
            <button className={styles.btnGhost} onClick={prevStep}>← Kembali</button>
            <button className={styles.btnOutline}>Export Brief</button>
            <button className={styles.btnPrimary} onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? 'Memproses...' : 'Generate Assets ✨'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}