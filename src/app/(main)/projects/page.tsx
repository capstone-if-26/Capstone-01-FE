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
import videoService, { VideoMode } from '@/services/video.service';

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

// ================= STORYBOARD BUILDER =================
function buildDynamicScenes(
  institutionName: string,
  offeredDegrees: string,
  eventContent: string,
  toneOfVoice: string,
  selectedKeyMessage: string,
  selectedTheme: string,
  prompt: string,
  videoMode: VideoMode,
  sceneDur: number
): Scene[] {
  const inst = institutionName || 'institusi kami';

  // Ambil 3 program studi pertama saja
  const programs = offeredDegrees
    ? offeredDegrees.split(',').slice(0, 3).map(p => p.trim()).filter(Boolean).join(', ')
    : 'berbagai program unggulan';

  const event = eventContent || 'pendaftaran';
  const keyMsg = selectedKeyMessage || 'Wujudkan masa depan cerahmu bersama kami.';
  const tone = toneOfVoice || 'Profesional & Formal';
  const theme = selectedTheme || 'Tur Kampus Sinematik';

  // ── Narasi per tone ───────────────────────────────────────────
  const narrationHook: Record<string, string> = {
    'Santai & Ramah':
      `Hei, generasi muda! Pernah kepikiran mau kuliah di kampus yang asyik dan berkualitas? Yuk, kenalan sama ${inst}!`,
    'Profesional & Formal':
      `${inst} — institusi pendidikan terkemuka yang telah mencetak pemimpin dan profesional unggul selama puluhan tahun.`,
    'Kreatif & Inovatif':
      `Siap mengubah ide brilianmu jadi karya nyata? Selamat datang di ${inst}, tempat di mana inovasi terlahir setiap hari!`,
    'Berwibawa & Meyakinkan':
      `Bergabunglah dengan ribuan alumni terbaik. ${inst} — pilihan utama bagi mereka yang mengejar standar tertinggi.`,
  };

  const narrationValue: Record<string, string> = {
    'Santai & Ramah':
      `Di ${inst}, kamu bakal belajar ${programs} bareng komunitas yang hangat dan supportif. Seru banget, kan?`,
    'Profesional & Formal':
      `Dengan program ${programs}, ${inst} mempersiapkan Anda dengan kompetensi global dan integritas tertinggi. ${keyMsg}`,
    'Kreatif & Inovatif':
      `Eksplorasi ${programs} bersama mentor berpengalaman dan ekosistem inovasi ${inst} yang tanpa batas. ${keyMsg}`,
    'Berwibawa & Meyakinkan':
      `${inst} menawarkan ${programs} dengan kurikulum berstandar internasional. ${keyMsg}`,
  };

  const narrationCTA: Record<string, string> = {
    'Santai & Ramah':
      `Jangan sampai ketinggalan ${event}! Daftar sekarang dan mulai petualangan belajarmu di ${inst}. Kita tunggu kamu!`,
    'Profesional & Formal':
      `Bergabunglah dalam ${event} ${inst}. Jadilah bagian dari generasi unggul yang siap menghadapi tantangan global.`,
    'Kreatif & Inovatif':
      `${event} kini dibuka! Ambil langkah pertamamu dan ciptakan masa depan luar biasa bersama ${inst}. Daftarkan diri sekarang!`,
    'Berwibawa & Meyakinkan':
      `Daftarkan diri Anda dalam ${event} ${inst} hari ini. Raih posisi terbaik Anda. Kuota terbatas.`,
  };

  // ── Visual prompt per tema ────────────────────────────────────
  const modeNote = videoMode === 'image-to-video'
    ? ` Gunakan logo ${inst} sebagai referensi visual utama.`
    : videoMode === 'start-end-to-video'
    ? ` Logo ${inst} sebagai frame pembuka, foto lingkungan kampus sebagai frame penutup.`
    : '';
  const extraNote = prompt ? ` Catatan: ${prompt}` : '';

  const visualHook: Record<string, string> = {
    'Tur Kampus Sinematik':
      `Aerial drone shot sinematik menyapu kampus ${inst} saat golden hour. Kamera reveal dari langit turun ke gerbang utama yang megah. Pencahayaan hangat keemasan, motion slow-motion cinematik.${modeNote}${extraNote}`,
    'Cerita Kehidupan Mahasiswa':
      `Slow-motion montage mahasiswa ${inst}: tertawa bersama di taman, berdiskusi di kelas, mengikuti kegiatan UKM. Warna natural hangat, suasana autentik dan genuine.${modeNote}${extraNote}`,
    'Keunggulan Akademik':
      `Close-up dramatis peralatan laboratorium canggih ${inst}. Mahasiswa serius meneliti, layar komputer menyala. Pencahayaan profesional, komposisi presisi dan teknikal.${modeNote}${extraNote}`,
    'Tren & Gaya Hidup Cepat':
      `Fast-cut energetik kampus ${inst}: sesi kreatif, olahraga, event kampus. Estetika Gen Z — warna vibrant, transisi cepat dinamis, vertikal-style shots.${modeNote}${extraNote}`,
  };

  const visualValue: Record<string, string> = {
    'Tur Kampus Sinematik':
      `Tracking shot menelusuri fasilitas ${inst}: perpustakaan modern, aula megah, ruang kelas berteknologi. Kamera glide smooth, depth of field sinematik.`,
    'Cerita Kehidupan Mahasiswa':
      `Cuplikan interaksi hangat dosen dan mahasiswa ${inst}, pameran karya, kegiatan komunitas. Suasana inklusif dan supportif. Warna cerah natural.`,
    'Keunggulan Akademik':
      `Montase riset terkini ${inst}: presentasi hasil penelitian, infografis prestasi dan penghargaan muncul on-screen, kerja sama industri dan partner internasional.`,
    'Tren & Gaya Hidup Cepat':
      `Vertical-style shots: mahasiswa ${inst} berkreasi, coding, desain grafis, kolaborasi di co-working space modern. Color grading trendy, music beat-sync.`,
  };

  const visualCTA: Record<string, string> = {
    'Tur Kampus Sinematik':
      `Logo ${inst} reveal sinematik di tengah layar dengan background blur kampus yang indah. Animasi teks elegan: "${event}". Fade smooth ke brand color.`,
    'Cerita Kehidupan Mahasiswa':
      `Grup mahasiswa ${inst} tersenyum menatap kamera dengan penuh semangat. Overlay teks ajakan hangat dan ramah. Logo institusi dengan animasi smooth.`,
    'Keunggulan Akademik':
      `Split-screen: prestasi mahasiswa di kiri, informasi ${event} di kanan. Logo ${inst} dan tagline muncul tegas. Tone resmi dan percaya diri.`,
    'Tren & Gaya Hidup Cepat':
      `Quick-cut highlight terbaik ${inst}, diakhiri freeze-frame mahasiswa tersenyum. Teks "${event}" muncul bold dan besar. Animasi CTA energetik.`,
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return [
    {
      id: '01',
      time: '00:00:00',
      title: '1. Hook / Perkenalan',
      duration: `00:0${sceneDur}`,
      status: 'Ready',
      narration: narrationHook[tone] || narrationHook['Profesional & Formal'],
      visual: visualHook[theme] || visualHook['Tur Kampus Sinematik'],
      isEditing: false,
      durationNum: sceneDur,
    },
    {
      id: '02',
      time: `00:00:${pad(sceneDur)}`,
      title: '2. Nilai Unggulan',
      duration: `00:0${sceneDur}`,
      status: 'Ready',
      narration: narrationValue[tone] || narrationValue['Profesional & Formal'],
      visual: visualValue[theme] || visualValue['Tur Kampus Sinematik'],
      isEditing: false,
      durationNum: sceneDur,
    },
    {
      id: '03',
      time: `00:00:${pad(sceneDur * 2)}`,
      title: '3. Call to Action',
      duration: `00:0${sceneDur}`,
      status: 'Ready',
      narration: narrationCTA[tone] || narrationCTA['Profesional & Formal'],
      visual: visualCTA[theme] || visualCTA['Tur Kampus Sinematik'],
      isEditing: false,
      durationNum: sceneDur,
    },
  ];
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

  // Tandai apakah user sudah upload dokumen referensi (agar fetch server tidak overwrite)
  const docUploadedRef = useRef(false);

  // ================= STATES: STORYBOARD (STEP 5) =================
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // ================= STATES: VIDEO GENERATION SETTINGS =================
  // start_image → logo dari business brief, end_image → foto lingkungan (auto, tidak diinput user)
  const [videoMode, setVideoMode] = useState<VideoMode>('text-to-video');

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
            if (!docUploadedRef.current && (data.theme || cb.theme || data.selected_theme)) setSelectedTheme(data.theme || cb.theme || data.selected_theme || '');
            
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
  const normalizeText = (text: string) =>
    text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\t/g, ' ').replace(/ +/g, ' ').trim();

  const extractProjectFields = (text: string) => {
    const normalized = normalizeText(text);
    // Filter baris kosong DAN baris separator (----, ====, dsb)
    const lines = normalized.split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !/^[=\-*]{3,}$/.test(l));
    const textLower = normalized.toLowerCase();

    const findIdx = (keywords: string[]) =>
      lines.findIndex((l) => keywords.some((k) => l.toLowerCase().includes(k)));

    // Ekstrak value setelah separator (:/-/–/—) atau ambil baris-baris berikutnya
    const extractValue = (keywords: string[], maxNext = 1): string => {
      const idx = findIdx(keywords);
      if (idx < 0) return '';
      const afterSep = lines[idx].split(/[:\-–—]/).slice(1).join('').trim();
      if (afterSep.length > 3) return afterSep;
      const nextLines: string[] = [];
      for (let i = idx + 1; i < Math.min(idx + 1 + maxNext, lines.length); i++) {
        // Stop jika baris berikutnya adalah label baru (Huruf + kata pendek + separator)
        if (/^[A-Za-z][A-Za-z\s]{1,25}[:\-–—]/.test(lines[i])) break;
        nextLines.push(lines[i]);
      }
      return nextLines.join(' ').trim() || afterSep;
    };

    // ── Step 1: Business Brief ─────────────────────────────────────
    // Selalu overwrite jika ditemukan di dokumen
    const projName = extractValue(['nama project', 'nama proyek', 'project name', 'judul project', 'judul proyek', 'nama video', 'judul video']);
    if (projName) setProjectName(projName);

    const instName = extractValue(['nama institusi', 'nama kampus', 'nama sekolah', 'nama universitas', 'nama perguruan tinggi', 'nama lembaga']);
    if (instName) setInstitutionName(instName);

    const history = extractValue(['latar belakang', 'sejarah', 'tentang kami', 'tentang institusi', 'asal usul', 'berdiri sejak'], 5);
    if (history) setInstitutionHistory(history);

    const degrees = extractValue(['program studi', 'prodi', 'jurusan', 'fakultas', 'program yang ditawarkan', 'program unggulan', 'bidang studi'], 5);
    if (degrees) setOfferedDegrees(degrees);

    const levelVal = extractValue(['jenjang pendidikan', 'tingkat sekolah', 'jenjang', 'level pendidikan', 'tingkat pendidikan']);
    if (levelVal) {
      const levels = ['PreSchool', 'TK', 'SD', 'SMP', 'SMA', 'SMK', 'Perguruan Tinggi'];
      const matched = levels.find((l) => levelVal.toLowerCase().includes(l.toLowerCase()));
      setSchoolLevel(matched || levelVal);
    }

    // ── Step 2: Creative Brief ─────────────────────────────────────

    // eventContent → wajib cocok dengan <option> dropdown
    const eventVal = extractValue(['kegiatan', 'event', 'acara', 'pendaftaran', 'pmb', 'open day', 'open house'], 2);
    if (eventVal) {
      const ev = eventVal.toLowerCase();
      const eventMap: [string, string][] = [
        ['penerimaan',           'Penerimaan Mahasiswa Baru'],
        ['mahasiswa baru',       'Penerimaan Mahasiswa Baru'],
        ['pmb',                  'Penerimaan Mahasiswa Baru'],
        ['snbp',                 'Penerimaan Mahasiswa Baru'],
        ['snbt',                 'Penerimaan Mahasiswa Baru'],
        ['dies natalis',         'Dies Natalis / Ulang Tahun'],
        ['ulang tahun',          'Dies Natalis / Ulang Tahun'],
        ['anniversary',          'Dies Natalis / Ulang Tahun'],
        ['beasiswa',             'Promosi Beasiswa'],
        ['scholarship',          'Promosi Beasiswa'],
        ['pengenalan kehidupan', 'Pengenalan Kehidupan Kampus'],
        ['pkkmb',                'Pengenalan Kehidupan Kampus'],
        ['orientasi',            'Pengenalan Kehidupan Kampus'],
      ];
      const matched = eventMap.find(([k]) => ev.includes(k));
      if (matched) setEventContent(matched[1]);
    }

    // videoDuration → wajib cocok dengan <option> dropdown
    const durVal = extractValue(['durasi video', 'durasi', 'duration', 'panjang video', 'lama video']);
    if (durVal) {
      const dv = durVal.toLowerCase();
      if (dv.includes('short'))                              setVideoDuration('Short (4 detik)');
      else if (dv.includes('medium') || dv.includes('sedang')) setVideoDuration('Medium (6 detik)');
      else if (dv.includes('long')   || dv.includes('panjang')) setVideoDuration('Long (8 detik)');
      else {
        // Angka murni: bisa total detik (12/18/24) atau per scene (4/6/8)
        // Jika > 8, anggap total → bagi 3 → per scene
        const n = parseInt(dv.replace(/\D/g, ''));
        if (!isNaN(n) && n > 0) {
          const perScene = n > 8 ? Math.round(n / 3) : n;
          if (perScene <= 4)      setVideoDuration('Short (4 detik)');
          else if (perScene <= 6) setVideoDuration('Medium (6 detik)');
          else                    setVideoDuration('Long (8 detik)');
        }
      }
    }

    // Tone of voice — scan seluruh dokumen
    if (textLower.match(/\bberwibawa\b|\bmeyakinkan\b|\bprestisius\b|\bauthoritative\b/)) {
      setToneOfVoice('Berwibawa & Meyakinkan');
    } else if (textLower.match(/\bprofesional\b|\bformal\b|\bresmi\b/)) {
      setToneOfVoice('Profesional & Formal');
    } else if (textLower.match(/\bkreatif\b|\binovatif\b|\bcreative\b|\binnovative\b/)) {
      setToneOfVoice('Kreatif & Inovatif');
    }

    // Key message — cocokkan dengan opsi yang ada
    const keyMsgVal = extractValue(['pesan utama', 'key message', 'pesan kunci', 'tagline', 'slogan', 'nilai utama', 'usp', 'unique selling point']);
    if (keyMsgVal) {
      const allMessages = Object.values(keyMessageOptions).flat();
      const kv = keyMsgVal.toLowerCase();
      const matched = allMessages.find((m) =>
        m.toLowerCase().includes(kv.slice(0, 20)) || kv.includes(m.toLowerCase().slice(0, 20))
      );
      if (matched) setSelectedKeyMessage(matched);
    }

    // Prompt / instruksi tambahan
    const promptVal = extractValue(['instruksi tambahan', 'catatan khusus', 'notes', 'prompt', 'arahan tambahan', 'keterangan khusus'], 3);
    if (promptVal) setPrompt(promptVal);

    // ── Step 3: Tema Video ─────────────────────────────────────────
    // Gunakan regex langsung pada full text agar robust terhadap variasi format
    const themeMap: [string, string][] = [
      ['tur kampus',          'Tur Kampus Sinematik'],
      ['sinematik',           'Tur Kampus Sinematik'],
      ['kehidupan mahasiswa', 'Cerita Kehidupan Mahasiswa'],
      ['keseharian',          'Cerita Kehidupan Mahasiswa'],
      ['keunggulan akademik', 'Keunggulan Akademik'],
      ['laboratorium',        'Keunggulan Akademik'],
      ['riset',               'Keunggulan Akademik'],
      ['prestasi',            'Keunggulan Akademik'],
      ['tren',                'Tren & Gaya Hidup Cepat'],
      ['gen z',               'Tren & Gaya Hidup Cepat'],
      ['gaya hidup',          'Tren & Gaya Hidup Cepat'],
      ['energik',             'Tren & Gaya Hidup Cepat'],
    ];

    // Coba ambil dari label eksplisit "Tema Video: ..."
    const themeRegex = normalized.match(/tema\s*video\s*[:\-–—]\s*(.+)/i);
    const themeVal = themeRegex ? themeRegex[1].trim() : extractValue(['tema video', 'theme', 'konsep video', 'gaya video', 'tipe video']);
    if (themeVal) {
      const tv = themeVal.toLowerCase();
      const matched = themeMap.find(([k]) => tv.includes(k));
      if (matched) setSelectedTheme(matched[1]);
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
        docUploadedRef.current = true;
        extractProjectFields(text);
      };
      reader.readAsArrayBuffer(selectedFile);
      return;
    }

    if (fileName.endsWith('.docx') || selectedFile.type.includes('wordprocessingml')) {
      const text = await extractDocxText(selectedFile);
      setPdfText(text);
      docUploadedRef.current = true;
      extractProjectFields(text);
      return;
    }

    if (selectedFile.type === 'text/plain' || fileName.endsWith('.txt')) {
      const text = await selectedFile.text();
      setPdfText(text);
      docUploadedRef.current = true;
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
      const generatedCopy = `Halo generasi masa depan!\n\nTahukah kamu bahwa ${selectedKeyMessage.toLowerCase()} Di ${institutionName}, kami siap membantumu mewujudkan impian itu.\n\nJangan lewatkan momen ${eventContent} tahun ini. Yuk, raih mimpimu bersama kami!`;
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
      const sceneDur = videoDuration === 'Short (4 detik)' ? 4 : videoDuration === 'Long (8 detik)' ? 8 : 6;
      const dynamicScenes = buildDynamicScenes(
        institutionName, offeredDegrees, eventContent,
        toneOfVoice, selectedKeyMessage, selectedTheme,
        prompt, videoMode, sceneDur
      );

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
  const handleSceneDuration = (id: string, dur: number) => setScenes((prev) => prev.map(s => s.id === id ? { ...s, durationNum: dur, duration: `00:0${dur}` } : s));
  
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

      // 1. Cek apakah ada video yang SEDANG DIPROSES
      let videoIdsToPoll: string[] = [];
      try {
        const variantsRes = await videoService.getStoryboardVariants(savedStoryboardId);
        if (variantsRes.success && variantsRes.data && variantsRes.data.length > 0) {
          const processingVideos = variantsRes.data.filter((v: any) =>
            v.status === 'pending' || v.status === 'processing' || v.status === 'stitching_video'
          );
          if (processingVideos.length > 0) {
            videoIdsToPoll = processingVideos.map((v: any) => v.id);
          }
        }
      } catch (e) {
        console.log("No existing video found or error fetching variants", e);
      }

      // 2. Generate 3 video (satu per scene) jika belum ada yang diproses
      if (videoIdsToPoll.length === 0) {
        // Gambar otomatis dari Business Brief (hanya CDN URL, bukan blob/object URL)
        const cdnLogo = logoPreview?.startsWith('http') ? logoPreview : undefined;
        const cdnEnv  = envPreview?.startsWith('http') ? envPreview : undefined;

        if (videoMode === 'image-to-video' && !cdnLogo) {
          alert('Mode Image-to-Video membutuhkan Logo Institut yang sudah tersimpan (CDN URL). Upload logo di Step 1 terlebih dahulu.');
          setIsRendering(false); isRenderingRef.current = false; return;
        }
        if (videoMode === 'start-end-to-video' && (!cdnLogo || !cdnEnv)) {
          alert('Mode Start-End-to-Video membutuhkan Logo Institut DAN Foto Lingkungan yang sudah tersimpan (CDN URL).');
          setIsRendering(false); isRenderingRef.current = false; return;
        }

        try {
          const res = await videoService.generateVideo({
            project_id: pid,
            storyboard_id: savedStoryboardId,
            custom_prompt: prompt,
            video_mode: videoMode,
            start_image: videoMode !== 'text-to-video' ? cdnLogo : undefined,
            end_image: videoMode === 'start-end-to-video' ? cdnEnv : undefined,
            resolution: '1080p',
          });
          const videosData = (res.data as any).videos as Array<{ video_id: string }>;
          videoIdsToPoll = videosData.map(v => v.video_id).filter(Boolean);
        } catch (err: any) {
          const msg = err?.response?.data?.message;
          if (msg === "sedang ada proses generate video yang berjalan untuk storyboard ini") {
            try {
              const variantsRes = await videoService.getStoryboardVariants(savedStoryboardId);
              if (variantsRes.success && variantsRes.data && variantsRes.data.length > 0) {
                videoIdsToPoll = variantsRes.data.map((v: any) => v.id);
              }
            } catch (e) {}
          }
          if (videoIdsToPoll.length === 0) throw err;
        }
      }

      if (videoIdsToPoll.length === 0) {
        throw new Error("Video ID tidak ditemukan di respons backend");
      }

      // 3. Poll semua 3 video sekaligus
      const progressInterval = setInterval(() => {
        setRenderProgress(prev => Math.min(prev + 3, 80));
      }, 3000);

      await videoService.pollAllUntilComplete(
        videoIdsToPoll,
        (completedCount, total, lastStatus) => {
          console.log(`Scene selesai: ${completedCount}/${total} — status: ${lastStatus.status}`);
          const pct = Math.round((completedCount / total) * 100);
          setRenderProgress(Math.max(15, pct));
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

      {/* STEPPER HEADER — setiap step bisa diklik */}
      <div className={styles.stepper}>
        <div className={styles.stepLine}></div>
        <div className={styles.stepLineActive} style={{ width: `${(currentStep - 1) * 25}%` }}></div>
        {['Business', 'Creative', 'Tema', 'Ringkasan', 'Storyboard'].map((step, idx) => {
          const isLocked = idx === 4 && !savedStoryboardId;
          return (
            <div
              key={idx}
              className={`${styles.stepItem} ${!isLocked && currentStep >= idx + 1 ? styles.active : ''}`}
              onClick={() => { if (!isLocked) setCurrentStep(idx + 1); }}
              style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
              title={isLocked ? 'Generate Storyboard terlebih dahulu dari halaman Ringkasan' : undefined}
            >
              {isLocked ? (
                <div className={styles.stepCircle} style={{
                  backgroundColor: '#f9fafb',
                  borderStyle: 'dashed',
                  borderColor: '#d1d5db',
                  color: '#9ca3af',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
              ) : (
                <div className={styles.stepCircle}>{idx + 1}</div>
              )}
              <span className={styles.stepText} style={isLocked ? { color: '#9ca3af' } : {}}>
                {step}
              </span>
            </div>
          );
        })}
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
          videoMode={videoMode} setVideoMode={setVideoMode}
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
          briefRef={briefRef}
          institutionName={institutionName} institutionHistory={institutionHistory}
          schoolLevel={schoolLevel} offeredDegrees={offeredDegrees}
          eventContent={eventContent} videoDuration={videoDuration}
          selectedTheme={selectedTheme} toneOfVoice={toneOfVoice}
          selectedKeyMessage={selectedKeyMessage} prompt={prompt}
          videoMode={videoMode}
          logoPreview={logoPreview} envPreview={envPreview}
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
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1a1a1a' }}>{scene.title}</h3>
                    {scene.isEditing ? (
                      <button onClick={() => toggleEditScene(scene.id)} style={{ backgroundColor: '#20c997', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Simpan Teks</button>
                    ) : (
                      <button onClick={() => toggleEditScene(scene.id)} style={{ backgroundColor: 'white', color: '#495057', border: '1px solid #ced4da', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Edit Teks</button>
                    )}
                  </div>

                  <div style={{ fontSize: '0.7rem', color: '#6c757d' }}>Durasi: <strong>{scene.durationNum}s</strong></div>

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
              <h3 style={{marginBottom: '0.5rem'}}>AI sedang menghasilkan 3 scene video Anda...</h3>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#e9ecef', borderRadius: '10px', marginTop: '1rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#0d6efd', width: `${renderProgress}%`, transition: 'width 0.3s ease' }}></div>
              </div>
            </div>
          ) : isFinished ? (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#e6f4ea', borderRadius: '12px', border: '1px solid #c3e6cb' }}>
              <h3 style={{ color: '#137333', margin: '0 0 0.5rem 0' }}>Video Berhasil Dibuat!</h3>
              <p style={{ color: '#155724', margin: '0 0 1.5rem 0', fontSize: '0.9rem' }}>Video marketing Anda sudah siap diunduh atau diputar.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer' }} onClick={() => { window.location.href = `/preview/${savedProjectId || projectId}`; }}>Preview & Download Video</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderTop: '1px solid #e9ecef', paddingTop: '2rem', flexWrap: 'wrap' }}>
              <button style={{ background: 'transparent', color: '#6c757d', border: 'none', padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} onClick={() => setCurrentStep(4)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                Kembali ke Ringkasan
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                {!savedStoryboardId && (
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#dc3545', fontWeight: 500 }}>
                    Klik <strong>Generate Storyboard</strong> di Ringkasan terlebih dahulu sebelum membuat video.
                  </p>
                )}
                <button
                  onClick={handleFinalRender}
                  disabled={!savedStoryboardId}
                  style={{
                    backgroundColor: savedStoryboardId ? '#0d6efd' : '#ced4da',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    cursor: savedStoryboardId ? 'pointer' : 'not-allowed',
                    boxShadow: savedStoryboardId ? '0 4px 12px rgba(13,110,253,0.2)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  Generate 3 Scene Videos
                </button>
              </div>
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