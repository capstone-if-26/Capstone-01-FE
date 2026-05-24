"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from './projects.module.css';

import BusinessBrief from "./components/businessbrief";
import CreativeBrief from "./components/creativebrief";
import VideoTheme from "./components/videotheme";
import ProjectSummary from "./components/summary";

// Pastikan getProjectById sudah ditambahkan di project.service.ts Anda
import { initializeProject, getProjectById } from '@/services/project.service';
import videoService from '@/services/video.service';

// --- DATA DUMMY & OPTIONS ---
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

interface Scene {
  id: string; time: string; title: string; duration: string; status: string;
  narration: string; visual: string;
  isEditing: boolean;
  durationNum: number;
}

// ================= KOMPONEN UTAMA (KONTEN) =================
function NewProjectContent() {
  const router = useRouter();
  
  // Tangkap ID dari URL (Berasal dari klik card di Dashboard)
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const briefRef = useRef<HTMLDivElement>(null);
  const [savedProjectId, setSavedProjectId] = useState<string>('');
  const [savedStoryboardId, setSavedStoryboardId] = useState<string>('');

  // ================= STATES: BUSINESS & CREATIVE BRIEF =================
  const [projectName, setProjectName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [institutionHistory, setInstitutionHistory] = useState('');
  const [offeredDegrees, setOfferedDegrees] = useState('');
  const [schoolLevel, setSchoolLevel] = useState('');

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string>("");
  const [pdfText, setPdfText] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string>("");

  const [envFile, setEnvFile] = useState<File | null>(null);
  const [envPreview, setEnvPreview] = useState<string | null>(null);
  const [envBase64, setEnvBase64] = useState<string>("");

  const [eventContent, setEventContent] = useState('');
  const [toneOfVoice, setToneOfVoice] = useState('Santai & Ramah');
  const [selectedKeyMessage, setSelectedKeyMessage] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('Tur Kampus Sinematik');

  const [editableCopywriting, setEditableCopywriting] = useState('');
  const [editableHashtags, setEditableHashtags] = useState('');
  const [isEditingCopywriting, setIsEditingCopywriting] = useState(false);
  const [isEditingHashtags, setIsEditingHashtags] = useState(false);

  // ================= STATES: STORYBOARD (STEP 5) =================
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // ================= EFEK: LOAD PROJECT DARI DASHBOARD =================
  useEffect(() => {
    if (projectId) {
      const fetchProjectData = async () => {
        try {
          const res = await getProjectById(projectId);
          if (res.success && res.data) {
            const data = res.data;
            const bb = data.business_briefs?.[0] || {};
            const cb = bb.creative_briefs?.[0] || {};

            // 1. Isi form text dengan data dari database
            if (data.name) setProjectName(data.name);
            if (bb.institution_name || data.institution_name || data.name) setInstitutionName(bb.institution_name || data.institution_name || data.name || '');
            if (data.description || bb.institution_history || data.institution_history) setInstitutionHistory(data.description || bb.institution_history || data.institution_history || '');
            if (data.theme || cb.theme || data.selected_theme) setSelectedTheme(data.theme || cb.theme || data.selected_theme || '');
            
            if (cb.event_content || data.event_content) setEventContent(cb.event_content || data.event_content);
            if (cb.tone_of_voice || data.tone_of_voice) setToneOfVoice(cb.tone_of_voice || data.tone_of_voice);
            if (cb.key_message || data.selected_key_message) setSelectedKeyMessage(cb.key_message || data.selected_key_message);
            if (cb.prompt || data.prompt) setPrompt(cb.prompt || data.prompt);
            if (cb.video_duration || data.video_duration) setVideoDuration(cb.video_duration || data.video_duration);
            if (bb.school_level || data.school_level) setSchoolLevel(bb.school_level || data.school_level);
            if (bb.offered_degrees || data.offered_degrees) setOfferedDegrees(bb.offered_degrees || data.offered_degrees);

            // 2. Isi form gambar dengan URL dari Supabase / Backend
            if (bb.logo_path || data.logo_url) setLogoPreview(bb.logo_path || data.logo_url);
            if (bb.environment_path || data.env_url) setEnvPreview(bb.environment_path || data.env_url);
            
            setSavedProjectId(data.id || projectId);

            // Cek apakah storyboard sudah ada
            if (data.storyboard && data.storyboard.id) {
              setSavedStoryboardId(data.storyboard.id);
              if (data.storyboard.sections && data.storyboard.sections.length > 0) {
                 setScenes(data.storyboard.sections.map((sec: any, index: number) => {
                  let parsedNarration = sec.content;
                  let parsedVisual = `Visual sesuai ${data.theme || 'Tren & Gaya Hidup Cepat'}`;
                  try {
                    const parsed = JSON.parse(sec.content);
                    if (parsed.narration) parsedNarration = parsed.narration;
                    if (parsed.visual) parsedVisual = parsed.visual;
                  } catch (e) {
                    // Not JSON, use default fallback
                  }
                  return {
                    id: `0${index + 1}`,
                    time: '00:00:00', 
                    title: `${index + 1}. ${sec.section_type}`,
                    duration: `00:0${sec.duration}`,
                    status: 'Ready',
                    narration: parsedNarration,
                    visual: parsedVisual,
                    isEditing: false,
                    durationNum: sec.duration
                  };
                }));
              }
              // Langsung lompat ke Step 5 (Storyboard)
              setCurrentStep(5);
            } else {
              // Langsung lompat ke Step 4 (Ringkasan)
              setCurrentStep(4);
            }
          }
        } catch (error) {
          console.error("Gagal memuat detail project:", error);
        }
      };
      fetchProjectData();
    }
  }, [projectId]);

  // ================= LOGIKA EKSTRAK FILE DOKUMEN =================
  const normalizeText = (text: string) => text.replace(/\r\n/g, '\n').replace(/\t/g, ' ').replace(/ +/g, ' ').trim();
  const parseLabelLine = (line: string) => {
    const split = line.split(/[:\-–—]/);
    return split.length > 1 ? split.slice(1).join('').trim() : line.trim();
  };

  const extractProjectFields = (text: string) => {
    const normalized = normalizeText(text);
    const lines = normalized.split('\n').map((line) => line.trim()).filter(Boolean);

    const findLine = (keywords: string[]) => lines.find((line) => keywords.some((k) => line.toLowerCase().includes(k)));
    const institutionLine = findLine(['nama institusi', 'nama kampus', 'kampus', 'universitas', 'institut']);
    const historyLine = findLine(['sejarah', 'latar belakang', 'asal usul', 'berdiri']);
    const degreeLine = findLine(['program studi', 'prodi', 'fakultas', 'jurusan']);
    const levelLine = findLine(['tingkat sekolah', 'jenjang pendidikan', 'jenjang']);

    if (!institutionName && institutionLine) setInstitutionName(parseLabelLine(institutionLine));
    if (!institutionHistory && historyLine) setInstitutionHistory(parseLabelLine(historyLine));
    if (!offeredDegrees && degreeLine) setOfferedDegrees(parseLabelLine(degreeLine));
    if (!schoolLevel && levelLine) {
      const parsedLevel = parseLabelLine(levelLine);
      const levels = ["PreSchool", "TK", "SD", "SMP", "SMA", "SMK", "Perguruan Tinggi"];
      const matched = levels.find(l => parsedLevel.toLowerCase().includes(l.toLowerCase()));
      if (matched) {
        setSchoolLevel(matched);
      } else {
        setSchoolLevel(parsedLevel);
      }
    }
  };

  const extractDocxText = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const JSZipModule = await import('jszip');
    const JSZip = JSZipModule.default;
    const zip = await JSZip.loadAsync(arrayBuffer);
    const documentXml = zip.file('word/document.xml');
    if (!documentXml) return '';
    const xmlText = await documentXml.async('string');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    const textNodes = Array.from(xmlDoc.getElementsByTagName('w:t')).map((node) => node.textContent || '');
    return textNodes.join(' ');
  };

  // ================= LOGIKA UPLOAD (DENGAN PERBAIKAN CRASH MEMORI) =================
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(null);
    const fileName = selectedFile.name.toLowerCase();

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setBase64(reader.result);
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(selectedFile);
      return;
    }

    if (selectedFile.type === 'application/pdf' || fileName.endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = async function () {
        const typedarray = new Uint8Array(this.result as ArrayBuffer);
        const pdfjsLib = await import('pdfjs-dist');
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str || '').join(' ') + '\n';
        }
        setPdfText(text);
        extractProjectFields(text);
      };
      reader.readAsArrayBuffer(selectedFile);
      return;
    }

    if (fileName.endsWith('.docx') || selectedFile.type.includes('wordprocessingml')) {
      const text = await extractDocxText(selectedFile);
      setPdfText(text);
      extractProjectFields(text);
      return;
    }

    if (selectedFile.type === 'text/plain' || fileName.endsWith('.txt')) {
      const text = await selectedFile.text();
      setPdfText(text);
      extractProjectFields(text);
      return;
    }

    alert('Format file tidak didukung.');
  };

  // PERBAIKAN: Menggunakan URL.createObjectURL agar browser tidak Crash saat Preview Gambar
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !selectedFile.type.startsWith('image/')) return;

    setLogoFile(selectedFile);
    setLogoPreview(URL.createObjectURL(selectedFile)); // Menghasilkan link bayangan yang sangat ringan

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') setLogoBase64(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleEnvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !selectedFile.type.startsWith('image/')) return;

    setEnvFile(selectedFile);
    setEnvPreview(URL.createObjectURL(selectedFile)); // Menghasilkan link bayangan yang sangat ringan

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') setEnvBase64(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  // ================= EFEK: AUTO GENERATE COPYWRITING DI STEP 4 =================
  useEffect(() => {
    if (currentStep === 4) {
      const generatedCopy = `Halo generasi masa depan! ✨\n\nTahukah kamu bahwa ${selectedKeyMessage.toLowerCase()} Di ${institutionName}, kami siap membantumu mewujudkan impian itu.\n\nJangan lewatkan momen ${eventContent} tahun ini. Yuk, raih mimpimu bersama kami! 👇`;
      const generatedHash = `#${institutionName.replace(/\s+/g, '')} #${eventContent.replace(/\s+/g, '')} #Pendidikan #KampusImpian #SevimaAI`;
      setEditableCopywriting(generatedCopy);
      setEditableHashtags(generatedHash);
    }
  }, [currentStep, institutionName, eventContent, selectedKeyMessage]);

  const handleNext = () => {
    if (currentStep === 1 && (!institutionName || !institutionHistory || !schoolLevel)) {
      alert("Mohon lengkapi Nama Institusi, Sejarah, dan Tingkat Sekolah."); return;
    }
    if (currentStep === 2 && (!eventContent || !selectedKeyMessage || !videoDuration)) {
      alert("Mohon lengkapi Kebutuhan Konten, Pesan Utama, dan Durasi Video."); return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);
  
  const withTimeout = (promise: Promise<any>, ms: number) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("TIMEOUT")), ms);
      promise.then((res) => { clearTimeout(timer); resolve(res); }).catch((err) => { clearTimeout(timer); reject(err); });
    });
  };

  // ================= GENERATE ACTION (PINDAH KE STEP 5: STORYBOARD) =================
  const handleGenerate = async () => {
    setIsGenerating(true);

    const payload = {
      project_id: projectId || "",
      project_name: projectName,
      institution_name: institutionName,
      institution_history: institutionHistory,
      school_level: schoolLevel,
      offered_degrees: offeredDegrees,
      event_content: eventContent,
      tone_of_voice: toneOfVoice,
      selected_key_message: selectedKeyMessage,
      video_duration: videoDuration,
      prompt: prompt,
      selected_theme: selectedTheme,
      editable_copywriting: editableCopywriting,
      editable_hashtags: editableHashtags,
      logo_base64: logoBase64,
      env_base64: envBase64,
      document_base64: base64,
    };

    try {
      // 1. Tembak API Backend (Bisa Error jika token belum ada/expired)
      await withTimeout(initializeProject(payload), 10000)
        .then((res: any) => {
          if (res?.data?.project_id) setSavedProjectId(res.data.project_id);
          if (res?.data?.storyboard_id) setSavedStoryboardId(res.data.storyboard_id);
        })
        .catch(e => {
          console.warn("API Backend gagal atau timeout. Melanjutkan ke Storyboard lokal.");
        });

      // 2. Siapkan data Naskah Storyboard
      const dynamicScenes: Scene[] = [
        {
          id: '01', time: '00:00:00', title: '1. Intro & Hook', duration: '00:15', status: 'Ready',
          narration: `"Halo generasi masa depan! Tahukah kamu bahwa ${selectedKeyMessage?.toLowerCase() || 'pendidikan itu penting'}"`,
          visual: `Visual bergaya ${toneOfVoice}. Menampilkan gerbang utama ${institutionName || 'kampus'}. Sesuai instruksi: ${prompt || 'Buat semenarik mungkin'}.`,
          isEditing: false,
          durationNum: 15
        },
        {
          id: '02', time: '00:00:15', title: '2. Suasana & Keunggulan Kampus', duration: '00:20', status: 'Ready',
          narration: `"Di ${institutionName || 'sini'}, kami siap membantumu mewujudkan impian itu melalui program unggulan kami."`,
          visual: `Gaya visual: ${selectedTheme}. Memperlihatkan mahasiswa sedang beraktivitas, fasilitas modern.`,
          isEditing: false,
          durationNum: 20
        },
        {
          id: '03', time: '00:00:35', title: '3. Promosi & Call to Action', duration: '00:10', status: 'Ready',
          narration: `"Jangan lewatkan momen ${eventContent || 'pendaftaran'} tahun ini. Yuk, raih mimpimu bersama kami!"`,
          visual: `Logo ${institutionName || 'kampus'} muncul di tengah layar dengan teks ajakan (Call to Action).`,
          isEditing: false,
          durationNum: 10
        }
      ];

      setScenes(dynamicScenes);
      
      // 3. Masuk ke Tahap 5 (UI Storyboard)
      setCurrentStep(5);

    } catch (err) {
      console.error(err);
      alert("Gagal memproses data. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
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

  // ================= FUNGSI STEP 5 (EDIT SCENE & RENDER) =================
  const toggleEditScene = (id: string) => setScenes((prev) => prev.map(s => s.id === id ? { ...s, isEditing: !s.isEditing } : s));
  const handleSceneChange = (id: string, field: 'narration' | 'visual', value: string) => setScenes((prev) => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  
  const isRenderingRef = useRef(false);

  const handleFinalRender = async () => {
    if (isRenderingRef.current) return;
    isRenderingRef.current = true;
    setIsRendering(true);
    setRenderProgress(10);
    
    try {
      const pid = savedProjectId || projectId;
      if (!pid || !savedStoryboardId) {
        alert("Gagal memproses, ID Proyek atau Storyboard tidak ditemukan.");
        setIsRendering(false);
        isRenderingRef.current = false;
        return;
      }

      // 0. Auto-save storyboard before rendering
      try {
        const { storyboardService } = await import('@/services/storyboard.service');
        const updatedSections = scenes.map(s => ({
          section_type: s.title.replace(/^\d+\.\s*/, ''),
          content: JSON.stringify({ narration: s.narration, visual: s.visual }),
          duration: s.durationNum
        }));
        await storyboardService.updateStoryboard(savedStoryboardId, {
          sections: updatedSections
        });
      } catch (err) {
        console.warn("Gagal auto-save storyboard:", err);
      }

      // 1. Memanggil endpoint generate video backend
      const res = await videoService.generateVideo({
        project_id: pid,
        storyboard_id: savedStoryboardId,
        custom_prompt: prompt
      });
      
      const videoId = (res.data as any).video_id;
      if (!videoId) {
        throw new Error("Video ID tidak ditemukan di respons backend");
      }

      // 2. Polling progress dengan batas maksimum tertentu
      let currentProgress = 15;
      const progressInterval = setInterval(() => {
        setRenderProgress(prev => Math.min(prev + 5, 85));
      }, 3000);

      await videoService.pollUntilComplete(
        videoId,
        (status) => {
           console.log("Status video saat ini:", status.status);
           if (status.status === "stitching_video") {
              setRenderProgress(90);
           }
        },
        5000, 
        120 
      );
      
      clearInterval(progressInterval);
      setRenderProgress(100);
      setIsRendering(false);
      isRenderingRef.current = false;
      setIsFinished(true);

    } catch (err: any) {
      console.error("Gagal melakukan render final:", err);
      alert(err?.response?.data?.message || "Terjadi kesalahan saat memproses video di backend.");
      setIsRendering(false);
      isRenderingRef.current = false;
    }
  };

  return (
    <div className={styles.container}>
      {isGenerating && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.spinner}></div>
            <h3>Menyiapkan Konsep Video...</h3>
            <p>AI sedang memproses Ringkasan Anda menjadi rangkaian Storyboard. Mohon tunggu.</p>
          </div>
        </div>
      )}

      {/* STEPPER HEADER (MENJADI 5 STEP) */}
      <div className={styles.stepper}>
        <div className={styles.stepLine}></div>
        <div className={styles.stepLineActive} style={{ width: `${(currentStep - 1) * 25}%` }}></div>
        {['Business', 'Creative', 'Tema', 'Ringkasan', 'Storyboard'].map((step, idx) => (
          <div key={idx} className={`${styles.stepItem} ${currentStep >= idx + 1 ? styles.active : ''}`}>
            <div className={styles.stepCircle}>{idx + 1}</div>
            <span className={styles.stepText}>{step}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: BUSINESS BRIEF */}
      {currentStep === 1 && (
        <BusinessBrief
          projectName={projectName} setProjectName={setProjectName}
          institutionName={institutionName} setInstitutionName={setInstitutionName}
          institutionHistory={institutionHistory} setInstitutionHistory={setInstitutionHistory}
          schoolLevel={schoolLevel} setSchoolLevel={setSchoolLevel}
          offeredDegrees={offeredDegrees} setOfferedDegrees={setOfferedDegrees}
          logoPreview={logoPreview} envPreview={envPreview}
          handleLogoChange={handleLogoChange} handleEnvChange={handleEnvChange}
          handleFileChange={handleFileChange} handleNext={handleNext}
        />
      )}

      {/* STEP 2: CREATIVE BRIEF */}
      {currentStep === 2 && (
        <CreativeBrief
          eventContent={eventContent} setEventContent={setEventContent}
          toneOfVoice={toneOfVoice} setToneOfVoice={setToneOfVoice}
          selectedKeyMessage={selectedKeyMessage} setSelectedKeyMessage={setSelectedKeyMessage}
          videoDuration={videoDuration} setVideoDuration={setVideoDuration}
          prompt={prompt} setPrompt={setPrompt}
          keyMessageOptions={keyMessageOptions} handleNext={handleNext} prevStep={prevStep}
        />
      )}

      {/* STEP 3: TEMA VIDEO */}
      {currentStep === 3 && (
        <VideoTheme
          selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme}
          videoThemes={videoThemes} handleNext={handleNext} prevStep={prevStep}
        />
      )}

      {/* STEP 4: SUMMARY */}
      {currentStep === 4 && (
        <ProjectSummary
          briefRef={briefRef} institutionName={institutionName} schoolLevel={schoolLevel} offeredDegrees={offeredDegrees}
          eventContent={eventContent} videoDuration={videoDuration} selectedTheme={selectedTheme} toneOfVoice={toneOfVoice}
          selectedKeyMessage={selectedKeyMessage} prompt={prompt} logoPreview={logoPreview} envPreview={envPreview}
          editableCopywriting={editableCopywriting} setEditableCopywriting={setEditableCopywriting}
          editableHashtags={editableHashtags} setEditableHashtags={setEditableHashtags}
          isEditingCopywriting={isEditingCopywriting} setIsEditingCopywriting={setIsEditingCopywriting}
          isEditingHashtags={isEditingHashtags} setIsEditingHashtags={setIsEditingHashtags}
          prevStep={prevStep} handleExportPDF={handleExportPDF} handleGenerate={handleGenerate} isGenerating={isGenerating}
        />
      )}

      {/* STEP 5: STORYBOARD EDITOR */}
      {currentStep === 5 && (
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e9ecef' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{margin: '0 0 0.5rem 0'}}>Naskah Storyboard</h2>
              <p style={{margin: 0, color: '#6c757d'}}>Edit teks narasi dan instruksi visual sebelum dirender menjadi video final.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
            {scenes.map((scene) => (
              <div key={scene.id} style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
                <div style={{ width: '36px', height: '36px', backgroundColor: '#0d6efd', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, zIndex: 2 }}>{scene.id}</div>
                
                <div style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '12px', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1a1a1a' }}>{scene.title} <span style={{color: '#0d6efd', fontSize: '1rem'}}>✓</span></h3>
                    {scene.isEditing ? (
                      <button onClick={() => toggleEditScene(scene.id)} style={{ backgroundColor: '#20c997', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>✓ Simpan Teks</button>
                    ) : (
                      <button onClick={() => toggleEditScene(scene.id)} style={{ backgroundColor: 'white', color: '#495057', border: '1px solid #ced4da', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>✏️ Edit Teks</button>
                    )}
                  </div>

                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0d6efd', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '-0.5rem' }}>AI NARRATION (SULIH SUARA)</div>
                  {scene.isEditing ? (
                    <textarea value={scene.narration} onChange={(e) => handleSceneChange(scene.id, 'narration', e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #0d6efd', borderRadius: '8px', backgroundColor: '#f8fbff', fontStyle: 'italic', fontFamily: 'inherit', outline: 'none', minHeight: '80px' }} />
                  ) : (
                    <p style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e9ecef', fontStyle: 'italic', color: '#495057', margin: 0, fontSize: '0.95rem' }}>{scene.narration}</p>
                  )}

                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0d6efd', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '-0.5rem' }}>VISUAL PROMPT (ARAHAN VISUAL)</div>
                  {scene.isEditing ? (
                    <textarea value={scene.visual} onChange={(e) => handleSceneChange(scene.id, 'visual', e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #0d6efd', borderRadius: '8px', fontFamily: 'inherit', outline: 'none', minHeight: '80px' }} />
                  ) : (
                    <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>{scene.visual}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isRendering ? (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
              <div className={styles.spinner} style={{width: '32px', height: '32px', border: '3px solid #e9ecef', borderTopColor: '#0d6efd'}}></div>
              <h3 style={{marginBottom: '0.5rem'}}>AI sedang meramu video Anda...</h3>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#e9ecef', borderRadius: '10px', marginTop: '1rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#0d6efd', width: `${renderProgress}%`, transition: 'width 0.3s ease' }}></div>
              </div>
            </div>
          ) : isFinished ? (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#e6f4ea', borderRadius: '12px', border: '1px solid #c3e6cb' }}>
              <h3 style={{ color: '#137333', margin: '0 0 0.5rem 0' }}>✨ Video Berhasil Dibuat!</h3>
              <p style={{ color: '#155724', margin: '0 0 1.5rem 0', fontSize: '0.9rem' }}>Video marketing Anda sudah siap diunduh atau diputar.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer' }} onClick={() => { window.location.href = `/preview/${savedProjectId || projectId}`; }}>Preview & Download Video</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #e9ecef', paddingTop: '2rem' }}>
              <button style={{ background: 'transparent', color: '#6c757d', border: 'none', padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => setCurrentStep(4)}>← Kembali ke Ringkasan</button>
              <button style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(13,110,253,0.2)' }} onClick={handleFinalRender}>Combine & Render Final Video ✨</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ================= PEMBUNGKUS (SUSPENSE) =================
export default function NewProjectPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#6c757d' }}>
        Memuat Modul Project...
      </div>
    }>
      <NewProjectContent />
    </Suspense>
  );
}