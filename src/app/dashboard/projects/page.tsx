"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from './projects.module.css';

// Opsi Pesan Utama berdasarkan Tone of Voice
const keyMessageOptions: Record<string, string[]> = {
  'Santai & Ramah': [
    "Mulai petualangan belajarmu di lingkungan yang seru dan mendukung.",
    "Kampus asik, masa depan makin cerdik. Yuk gabung bersama kami!",
    "Temukan potensimu dan jadilah dirimu sendiri di komunitas yang hangat."
  ],
  'Profesional & Formal': [
    "Membangun kompetensi unggul untuk menghadapi persaingan karier global.",
    "Inovasi pendidikan modern dengan standar integritas tertinggi.",
    "Pusat pengembangan karier dan profesionalisme masa depan Anda."
  ],
  'Kreatif & Inovatif': [
    "Wujudkan ide gilamu menjadi karya nyata di ekosistem tanpa batas.",
    "Eksplorasi kreativitasmu dan ciptakan tren, bukan sekadar mengikutinya.",
    "Belajar dengan cara yang berbeda, out-of-the-box, dan penuh inovasi."
  ],
  'Berwibawa & Meyakinkan': [
    "Mencetak bibit pemimpin berintegritas dan berwawasan luas.",
    "Tradisi keunggulan akademik yang terbukti melahirkan lulusan terbaik.",
    "Pilihan utama bagi mereka yang mengejar standar kualitas pendidikan tertinggi."
  ]
};

const videoThemes = [
  { id: 'Tur Kampus Sinematik', desc: 'Visual estetik menelusuri sudut-sudut fasilitas kampus.' },
  { id: 'Cerita Kehidupan Mahasiswa', desc: 'Fokus pada keseharian, kegiatan UKM, dan testimoni.' },
  { id: 'Keunggulan Akademik', desc: 'Menonjolkan fasilitas laboratorium, riset, dan prestasi.' },
  { id: 'Tren & Gaya Hidup Cepat', desc: 'Konten energik dengan transisi cepat untuk menarik Gen Z.' }
];

export default function NewProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const briefRef = useRef<HTMLDivElement>(null);

  // ================= STATES: STEP 1 - BUSINESS BRIEF =================
  const [institutionName, setInstitutionName] = useState('');
  const [institutionHistory, setInstitutionHistory] = useState('');
  const [offeredDegrees, setOfferedDegrees] = useState(''); // Sekarang Optional
  const [schoolLevel, setSchoolLevel] = useState(''); // Dikembalikan: Tingkat Sekolah

  // ================= STATES: STEP 2 - CREATIVE BRIEF =================
  const [eventContent, setEventContent] = useState('');
  const [toneOfVoice, setToneOfVoice] = useState('Santai & Ramah');
  const [selectedKeyMessage, setSelectedKeyMessage] = useState('');
  const [videoDuration, setVideoDuration] = useState(''); // Dikembalikan: Durasi
  const [prompt, setPrompt] = useState(''); // Dikembalikan: Specific Prompt

  // ================= STATES: STEP 3 - TEMA VIDEO =================
  const [selectedTheme, setSelectedTheme] = useState('Tur Kampus Sinematik');

  // ================= STATES: STEP 4 - SUMMARY (EDITABLE) =================
  const [editableCopywriting, setEditableCopywriting] = useState('');
  const [editableHashtags, setEditableHashtags] = useState('');
  
  // State untuk mode edit form di Ringkasan
  const [isEditingCopywriting, setIsEditingCopywriting] = useState(false);
  const [isEditingHashtags, setIsEditingHashtags] = useState(false);

  useEffect(() => {
    if (currentStep === 4) {
      const generatedCopy = `Halo generasi masa depan! ✨\n\nTahukah kamu bahwa ${selectedKeyMessage.toLowerCase()} Di ${institutionName}, kami siap membantumu mewujudkan impian itu.\n\nJangan lewatkan momen ${eventContent} tahun ini. Yuk, raih mimpimu bersama kami! 👇`;
      const generatedHash = `#${institutionName.replace(/\s+/g, '')} #${eventContent.replace(/\s+/g, '')} #Pendidikan #KampusImpian #SevimaAI`;
      
      setEditableCopywriting(generatedCopy);
      setEditableHashtags(generatedHash);
    }
  }, [currentStep, institutionName, eventContent, selectedKeyMessage]);

  const handleNext = () => {
    // Validasi Step 1 (Program Studi tidak wajib)
    if (currentStep === 1 && (!institutionName || !institutionHistory || !schoolLevel)) {
      alert("Mohon lengkapi Nama Institusi, Sejarah, dan Tingkat Sekolah."); return;
    }

    if (currentStep === 2 && (!eventContent || !selectedKeyMessage || !videoDuration)) {
      alert("Mohon lengkapi Kebutuhan Konten, Pesan Utama, dan Durasi Video."); return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // 1. Simpan semua data input (Creative Brief) ke Local Storage
    const projectDraft = {
      institutionName, offeredDegrees, eventContent, toneOfVoice, selectedKeyMessage, selectedTheme, prompt, copywriting: editableCopywriting,
    };
    localStorage.setItem('currentProjectDraft', JSON.stringify(projectDraft));

    // 2. TAMBAHKAN QUERY PARAMETER '?new=true' SAAT PUSH ROUTER
    // Perubahan di baris bawah ini 👇
    setTimeout(() => router.push('/dashboard/storyboard?new=true'), 3000);
  };

  const handleExportPDF = async () => {
    if (!briefRef.current) return;
    const canvas = await html2canvas(briefRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Ringkasan_Proyek_${institutionName.replace(/\s+/g, '_') || 'Kampus'}.pdf`);
  };

  return (
    <div className={styles.container}>
      {isGenerating && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.spinner}></div>
            <h3>Menyiapkan Aset Video...</h3>
            <p>AI sedang memproses Ringkasan Anda menjadi rangkaian Storyboard. Mohon tunggu.</p>
          </div>
        </div>
      )}

      {/* STEPPER */}
      <div className={styles.stepper}>
        <div className={styles.stepLine}></div>
        <div className={styles.stepLineActive} style={{ width: `${(currentStep - 1) * 33}%` }}></div>
        {['Business Brief', 'Creative Brief', 'Tema Video', 'Ringkasan'].map((step, idx) => (
          <div key={idx} className={`${styles.stepItem} ${currentStep >= idx + 1 ? styles.active : ''}`}>
            <div className={styles.stepCircle}>{idx + 1}</div>
            <span className={styles.stepText}>{step}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: BUSINESS BRIEF */}
      {currentStep === 1 && (
        <div className={styles.card}>
          <h2>Business Brief</h2>
          <p className={styles.subtitle}>Informasi fundamental mengenai profil institusi Anda.</p>
          
          <div className={styles.formGroup}>
            <label>Nama Institusi <span style={{color:'red'}}>*</span></label>
            <input type="text" className={styles.input} placeholder="Contoh: Universitas Brawijaya" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} />
          </div>

          <div className={styles.formGroup}>
            <label>Sejarah / Latar Belakang Institusi <span style={{color:'red'}}>*</span></label>
            <textarea className={styles.textarea} placeholder="Ceritakan sejarah singkat, visi, atau misi institusi Anda..." value={institutionHistory} onChange={(e) => setInstitutionHistory(e.target.value)}></textarea>
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
            <label>Program Studi / Gelar yang Ditawarkan <span style={{color:'#6c757d', fontWeight:'normal'}}>(Opsional)</span></label>
            <input type="text" className={styles.input} placeholder="Contoh: S1 Informatika, S2 Manajemen..." value={offeredDegrees} onChange={(e) => setOfferedDegrees(e.target.value)} />
          </div>

          <div className={styles.footerActions}>
            <button className={styles.btnPrimary} onClick={handleNext}>Lanjut ke Creative Brief →</button>
          </div>
        </div>
      )}

      {/* STEP 2: CREATIVE BRIEF */}
      {currentStep === 2 && (
        <div className={styles.card}>
          <h2>Creative Brief</h2>
          <p className={styles.subtitle}>Tentukan tujuan pemasaran dan gaya penyampaian konten.</p>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Kebutuhan Konten (Event) <span style={{color:'red'}}>*</span></label>
              <select className={styles.select} value={eventContent} onChange={(e) => setEventContent(e.target.value)}>
                <option value="">-- Pilih Kebutuhan --</option>
                <option value="Penerimaan Mahasiswa Baru">Penerimaan Mahasiswa Baru</option>
                <option value="Dies Natalis / Ulang Tahun">Dies Natalis / Ulang Tahun</option>
                <option value="Promosi Beasiswa">Promosi Beasiswa</option>
                <option value="Pengenalan Kehidupan Kampus">Pengenalan Kehidupan Kampus (PKKMB)</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Durasi Video <span style={{color:'red'}}>*</span></label>
              <select className={styles.select} value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)}>
                <option value="">-- Pilih Durasi --</option>
                <option value="Short (15 detik)">Short (15 detik)</option>
                <option value="Medium (30 detik)">Medium (30 detik)</option>
                <option value="Long (60 detik)">Long (60 detik)</option>
              </select>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Tone of Voice (Gaya Bahasa Brand)</label>
            <div className={styles.grid4} style={{marginBottom: '1rem'}}>
              {Object.keys(keyMessageOptions).map((tone) => (
                <div key={tone} className={`${styles.selectCard} ${toneOfVoice === tone ? styles.selected : ''}`} onClick={() => {setToneOfVoice(tone); setSelectedKeyMessage('');}}>
                  <h4>{tone}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Pilihan Pesan Utama (Key Message) <span style={{color:'red'}}>*</span></label>
            <p style={{fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.75rem'}}>Pilih salah satu pesan yang paling sesuai dengan target audiens Anda:</p>
            {keyMessageOptions[toneOfVoice].map((msg, i) => (
              <div key={i} className={`${styles.messageOption} ${selectedKeyMessage === msg ? styles.messageSelected : ''}`} onClick={() => setSelectedKeyMessage(msg)}>
                <input type="radio" checked={selectedKeyMessage === msg} readOnly />
                <span>{msg}</span>
              </div>
            ))}
          </div>

          <div className={styles.formGroup}>
            <label>Specific Requirements / Prompt Tambahan <span style={{color:'#6c757d', fontWeight:'normal'}}>(Opsional)</span></label>
            <textarea className={styles.textarea} placeholder="Contoh: Gunakan backsound yang energik, fokuskan visual pada fasilitas gedung A..." value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>
          </div>

          <div className={styles.footerActions}>
            <button className={styles.btnOutline} onClick={prevStep}>← Kembali</button>
            <button className={styles.btnPrimary} onClick={handleNext}>Lanjut ke Tema Video →</button>
          </div>
        </div>
      )}

      {/* STEP 3: TEMA VIDEO */}
      {currentStep === 3 && (
        <div className={styles.card}>
          <h2>Pilih Tema Video</h2>
          <p className={styles.subtitle}>Tentukan kerangka visual utama untuk video Anda.</p>
          
          <div className={styles.grid2}>
            {videoThemes.map((theme) => (
              <div key={theme.id} className={`${styles.selectCard} ${selectedTheme === theme.id ? styles.selected : ''}`} onClick={() => setSelectedTheme(theme.id)} style={{padding: '2rem', textAlign: 'left', alignItems: 'flex-start'}}>
                <h3 style={{margin: '0 0 0.5rem 0', color: '#1a1a1a'}}>{theme.id}</h3>
                <p style={{margin: 0, color: '#6c757d', lineHeight: '1.5'}}>{theme.desc}</p>
              </div>
            ))}
          </div>

          <div className={styles.footerActions}>
            <button className={styles.btnGhost} onClick={prevStep}>← Kembali</button>
            <button className={styles.btnPrimary} onClick={handleNext}>Lihat Ringkasan ✨</button>
          </div>
        </div>
      )}

      {/* STEP 4: SUMMARY DENGAN TOGGLE EDIT */}
      {currentStep === 4 && (
        <div className={styles.card}>
          <div ref={briefRef} style={{backgroundColor: 'white', padding: '10px'}}>
            <h2 style={{margin: '0 0 0.5rem 0'}}>Ringkasan Proyek</h2>
            <p className={styles.subtitle}>Tinjau kembali konten Anda sebelum diproses oleh AI.</p>
            
            <div className={styles.infoBox}>
              <p><b>Institusi:</b> {institutionName} - {schoolLevel} {offeredDegrees ? `(${offeredDegrees})` : ''}</p>
              <p><b>Kebutuhan:</b> {eventContent} ({videoDuration})</p>
              <p><b>Tema & Gaya:</b> {selectedTheme} / {toneOfVoice}</p>
              <p><b>Pesan Utama:</b> "{selectedKeyMessage}"</p>
              <p><b>Instruksi Tambahan:</b> {prompt}</p>
            </div>

            {/* EDITABLE COPYWRITING */}
            <div className={styles.editHeader}>
              <h4>COPYWRITING CAPTION</h4>
              {!isEditingCopywriting && (
                <button className={styles.btnEdit} onClick={() => setIsEditingCopywriting(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Edit
                </button>
              )}
            </div>
            
            {isEditingCopywriting ? (
              <div>
                <textarea className={styles.editableTextarea} value={editableCopywriting} onChange={(e) => setEditableCopywriting(e.target.value)}></textarea>
                <button className={styles.btnSaveEdit} onClick={() => setIsEditingCopywriting(false)}>✓ Selesai</button>
              </div>
            ) : (
              <div className={styles.textDisplay}>{editableCopywriting}</div>
            )}

            {/* EDITABLE HASHTAGS */}
            <div className={styles.editHeader} style={{marginTop: '2rem'}}>
              <h4>HASHTAGS</h4>
              {!isEditingHashtags && (
                <button className={styles.btnEdit} onClick={() => setIsEditingHashtags(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Edit
                </button>
              )}
            </div>

            {isEditingHashtags ? (
              <div>
                <input type="text" className={styles.hashtagInput} value={editableHashtags} onChange={(e) => setEditableHashtags(e.target.value)} />
                <button className={styles.btnSaveEdit} onClick={() => setIsEditingHashtags(false)}>✓ Selesai</button>
              </div>
            ) : (
              <div className={styles.textDisplay} style={{color: '#0d6efd', fontWeight: 500}}>{editableHashtags}</div>
            )}
            
          </div>

          <div className={styles.footerActions} style={{marginTop: '3rem'}}>
            <button className={styles.btnGhost} onClick={prevStep}>← Edit Tema</button>
            <button className={styles.btnOutline} onClick={handleExportPDF}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '6px', verticalAlign: 'middle'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
               Export ke PDF
            </button>
            <button className={styles.btnPrimary} onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? 'Memproses...' : 'Generate Storyboard 🚀'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}