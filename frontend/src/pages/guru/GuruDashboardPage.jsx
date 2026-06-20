import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { localStore } from '@services/localStore';
import logoSman12 from '@assets/logo-sman12.png';

const GuruDashboardPage = () => {
  const navigate = useNavigate();

  // ====== Layout and Tab States ======
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ====== Data States ======
  const [students, setStudents] = useState([]);
  const [allHistory, setAllHistory] = useState([]);
  const [parentMessages, setParentMessages] = useState([]);

  // ====== Form Input States ======
  const [formNisn, setFormNisn] = useState('');
  const [formKategori, setFormKategori] = useState('Pelanggaran Ringan');
  const [formTipe, setFormTipe] = useState('negative');
  const [formJumlah, setFormJumlah] = useState(5);
  const [formKeterangan, setFormKeterangan] = useState('');
  const [formTanggal, setFormTanggal] = useState(new Date().toISOString().split("T")[0]);

  // ====== Search and Filter States ======
  const [searchSiswaQuery, setSearchSiswaQuery] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');

  // ====== UI Notification States ======
  const [successToast, setSuccessToast] = useState('');
  const [replyMessageId, setReplyMessageId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // ====== Add Student States ======
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNisn, setNewStudentNisn] = useState('');
  const [newStudentKelas, setNewStudentKelas] = useState('XII MIPA 1');
  const [newStudentPasswordSiswa, setNewStudentPasswordSiswa] = useState('siswa123');
  const [newStudentPasswordOrangTua, setNewStudentPasswordOrangTua] = useState('ortu123');
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalError, setModalError] = useState('');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // ====== Searchable Student Selection States ======
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ====== Point Rules States ======
  const [pointRules, setPointRules] = useState([]);
  const [selectedRuleId, setSelectedRuleId] = useState('');

  // ====== Lifecycle Effects ======
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('adminRole');

    if (!token || role !== 'guru') {
      navigate('/login');
    } else {
      loadData();
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (formKategori === 'Penghargaan') {
      setFormTipe('positive');
    } else {
      setFormTipe('negative');
    }
  }, [formKategori]);

  useEffect(() => {
    // Reset form states and prefill correct defaults when activeTab changes
    if (activeTab === 'input_pelanggaran') {
      setFormKategori('Pelanggaran Ringan');
      setFormTipe('negative');
      setFormJumlah(5);
      setFormKeterangan('');
      setSelectedRuleId('');
    } else if (activeTab === 'input_penghargaan') {
      setFormKategori('Penghargaan');
      setFormTipe('positive');
      setFormJumlah(15);
      setFormKeterangan('');
      setSelectedRuleId('');
    }
  }, [activeTab]);

  // ====== Data Loading Helper ======
  const loadData = () => {
    setStudents(localStore.getSiswa());
    setAllHistory(localStore.getAllRiwayatPoin());
    setParentMessages(localStore.getPesanBk());
    setPointRules(localStore.getPointRules());
  };

  // ====== Navigation Handlers ======
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminRole');
    navigate('/login');
  };

  const handleSelectStudentForPelanggaran = (nisn) => {
    setFormNisn(nisn);
    setActiveTab('input_pelanggaran');
    setIsSidebarOpen(false);
  };

  const handleSelectStudentForPenghargaan = (nisn) => {
    setFormNisn(nisn);
    setActiveTab('input_penghargaan');
    setIsSidebarOpen(false);
  };

  // ====== Form Submission Handlers ======
  const handleSaveViolation = (e) => {
    e.preventDefault();
    if (!formNisn) return;

    localStore.updateSiswaPoin(
      formNisn,
      formKategori,
      formJumlah,
      formTipe,
      formKeterangan
    );

    loadData();
    setSuccessToast('Data poin karakter siswa berhasil disimpan!');
    
    setFormNisn('');
    setFormKeterangan('');
    setFormJumlah(5);
    setSelectedRuleId('');
    
    setTimeout(() => {
      setSuccessToast('');
      setActiveTab(formTipe === 'positive' ? 'riwayat_penghargaan' : 'riwayat_pelanggaran');
    }, 1500);
  };

  const handleSaveReply = (id) => {
    if (!replyText.trim()) return;

    const msg = parentMessages.find(m => m.id === parseInt(id));
    localStore.balasPesanBk(id, replyText);
    
    if (msg) {
      const truncatedReply = replyText.length > 40 ? replyText.substring(0, 40) + '...' : replyText;
      localStore.addSiswaNotifikasi(
        msg.nisn,
        `Guru BK membalas konsultasi Anda: "${truncatedReply}"`,
        'success'
      );
    }

    loadData();
    
    setReplyText('');
    setReplyMessageId(null);
    setSuccessToast('Balasan konsultasi berhasil dikirim!');
    
    setTimeout(() => {
      setSuccessToast('');
    }, 2000);
  };

  const handleDeletePesan = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesan konsultasi ini?')) {
      localStore.deletePesanBk(id);
      loadData();
      setSuccessToast('Pesan konsultasi berhasil dihapus!');
      setTimeout(() => {
        setSuccessToast('');
      }, 2000);
    }
  };

  const resetAddStudentForm = () => {
    setNewStudentName('');
    setNewStudentNisn('');
    setNewStudentKelas('XII MIPA 1');
    setNewStudentPasswordSiswa('siswa123');
    setNewStudentPasswordOrangTua('ortu123');
    setModalError('');
    setIsEditMode(false);
    setIsStudentModalOpen(false);
  };

  const handleEditStudentClick = (siswa) => {
    setIsEditMode(true);
    setNewStudentName(siswa.name);
    setNewStudentNisn(siswa.nisn);
    setNewStudentKelas(siswa.kelas);
    setNewStudentPasswordSiswa(siswa.passwordSiswa || 'siswa123');
    setNewStudentPasswordOrangTua(siswa.passwordOrangTua || 'ortu123');
    setModalError('');
    setIsStudentModalOpen(true);
  };

  const handleDeleteStudentClick = (nisn, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun siswa "${name}" (NISN: ${nisn})? Semua data pelanggaran, penghargaan, dan pesan konsultasi yang terkait akan dihapus secara permanen.`)) {
      localStore.deleteSiswa(nisn);
      setStudents(localStore.getSiswa());
      setAllHistory(localStore.getAllRiwayatPoin());
      setParentMessages(localStore.getPesanBk());
      setFormNisn('');
      setSuccessToast(`Akun siswa ${name} berhasil dihapus.`);
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  const handleSaveNewStudent = (e) => {
    e.preventDefault();
    setModalError('');

    if (newStudentNisn.length !== 10) {
      setModalError('NISN harus tepat 10 digit angka.');
      return;
    }

    if (newStudentPasswordSiswa.length < 6 || newStudentPasswordOrangTua.length < 6) {
      setModalError('Kata sandi masing-masing akun minimal harus 6 karakter.');
      return;
    }

    if (!isEditMode) {
      const existing = students.find(s => s.nisn === newStudentNisn);
      if (existing) {
        setModalError('Siswa dengan NISN ini sudah terdaftar.');
        return;
      }
    }

    localStore.saveSiswa({
      name: newStudentName,
      nisn: newStudentNisn,
      kelas: newStudentKelas,
      poin_pelanggaran: isEditMode ? (students.find(s => s.nisn === newStudentNisn)?.poin_pelanggaran || 0) : 0,
      poin_penghargaan: isEditMode ? (students.find(s => s.nisn === newStudentNisn)?.poin_penghargaan || 0) : 0,
      status: isEditMode ? (students.find(s => s.nisn === newStudentNisn)?.status || 'Bebas Pelanggaran') : 'Bebas Pelanggaran',
      passwordSiswa: newStudentPasswordSiswa,
      passwordOrangTua: newStudentPasswordOrangTua
    });

    loadData();
    resetAddStudentForm();
    setSuccessToast(isEditMode ? 'Data & akun siswa berhasil diperbarui!' : 'Siswa baru & akun berhasil didaftarkan!');
    setTimeout(() => {
      setSuccessToast('');
    }, 1500);
  };

  // ====== Helper Calculations ======
  const todayStr = new Date().toISOString().split("T")[0];
  
  const todayViolationsCount = allHistory.filter(h => h.tanggal === todayStr && h.type === 'negative').length;
  
  const totalStudentsCount = students.length;
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyReportsCount = allHistory.filter(h => {
    const d = new Date(h.tanggal);
    return d >= oneWeekAgo;
  }).length;

  const totalPointsIn = allHistory.reduce((sum, h) => {
    if (h.type === 'positive') {
      const match = h.poin.match(/\d+/);
      return sum + (match ? parseInt(match[0]) : 0);
    }
    return sum;
  }, 0);

  const filteredStudentsList = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchSiswaQuery.toLowerCase()) || s.nisn.includes(searchSiswaQuery);
    const matchesKelas = filterKelas === 'Semua' || s.kelas === filterKelas;
    return matchesSearch && matchesKelas;
  });

  const filteredHistoryPelanggaran = allHistory.filter(h => {
    if (h.type === 'positive' || h.kategori.toLowerCase() === 'penghargaan') return false;
    const studentName = students.find(s => s.nisn === h.nisn)?.name || 'Siswa';
    return studentName.toLowerCase().includes(searchHistoryQuery.toLowerCase()) || h.nisn.includes(searchHistoryQuery);
  });

  const filteredHistoryPenghargaan = allHistory.filter(h => {
    if (h.type !== 'positive' && h.kategori.toLowerCase() !== 'penghargaan') return false;
    const studentName = students.find(s => s.nisn === h.nisn)?.name || 'Siswa';
    return studentName.toLowerCase().includes(searchHistoryQuery.toLowerCase()) || h.nisn.includes(searchHistoryQuery);
  });

  const unrepliedCount = parentMessages.filter(m => !m.dibalas).length;

  // ====== Statistics Calculations ======
  const statStatus = {
    bebasPelanggaran: students.filter(s => s.status === 'Bebas Pelanggaran').length,
    panggilanI: students.filter(s => s.status === 'Panggilan I').length,
    panggilanII: students.filter(s => s.status === 'Panggilan II').length,
    panggilanIII: students.filter(s => s.status === 'Panggilan III').length,
    panggilanIV: students.filter(s => s.status === 'Panggilan IV').length,
    panggilanTerakhir: students.filter(s => s.status === 'Panggilan Terakhir').length,
  };

  const statKategori = {
    ringan: allHistory.filter(h => h.kategori.toLowerCase() === 'pelanggaran ringan').length,
    sedang: allHistory.filter(h => h.kategori.toLowerCase() === 'pelanggaran sedang').length,
    berat: allHistory.filter(h => h.kategori.toLowerCase() === 'pelanggaran berat').length,
    penghargaan: allHistory.filter(h => h.kategori.toLowerCase() === 'penghargaan').length,
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex relative">
      {/* ====== SUCCESS TOAST ====== */}
      {successToast && (
        <div className="fixed bottom-6 right-6 bg-[#0B1528] text-white border border-slate-700/50 rounded-xl shadow-2xl p-4 flex items-start gap-3 animate-slideInRight max-w-sm z-[9999]">
          <div className="bg-emerald-500/15 text-emerald-400 p-1.5 rounded-lg shrink-0 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 text-xs">
            <p className="font-extrabold tracking-wide uppercase text-slate-200">Operasi Sukses</p>
            <p className="text-slate-400 mt-1 leading-relaxed font-medium">{successToast}</p>
          </div>
          <button
            onClick={() => setSuccessToast('')}
            className="text-slate-500 hover:text-white transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* ====== Sidebar (Left) ====== */}
      <aside className={`fixed top-0 left-0 w-64 h-screen bg-[#0B1528] text-white flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="px-6 py-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoSman12} alt="SMAN 12 Logo" className="w-8 h-8 object-contain shrink-0" />
            <div className="min-w-0">
              <h2 className="text-xs font-extrabold tracking-wider text-white uppercase">Portal BK</h2>
              <p className="text-[9px] font-bold text-primary tracking-widest uppercase">SMAN 12 KOTA TANGERANG SELATAN</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
            { id: 'siswa', label: 'Data Siswa', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
            { id: 'input_pelanggaran', label: 'Input Pelanggaran', icon: 'M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'input_penghargaan', label: 'Input Penghargaan', icon: 'M11.48 3.499c.198-.39.723-.39.92 0l2.184 4.3c.075.148.22.25.385.27l4.743.616c.43.056.602.547.29.839l-3.433 3.35c-.12.117-.175.285-.147.45l.81 4.721c.073.427-.378.756-.764.555l-4.24-2.228a.75.75 0 00-.698 0l-4.24 2.228c-.386.2-.837-.13-.763-.555l.81-4.72c.028-.164-.027-.333-.147-.45l-3.433-3.35c-.312-.29-.14-.782.29-.838l4.743-.617a.75.75 0 00.385-.27l2.184-4.3z' },
            { id: 'riwayat_pelanggaran', label: 'Riwayat Pelanggaran', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
            { id: 'riwayat_penghargaan', label: 'Riwayat Penghargaan', icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 01-1.116-.088C15.908 3.75 15.54 3.75 15 3.75h-1.5M9 3.75H7.5A2.25 2.25 0 005.25 6v12.75a2.25 2.25 0 002.25 2.25h1.5m10.5-18v18.75c0 .621-.504 1.125-1.125 1.125H9.75c-.621 0-1.125-.504-1.125-1.125V3.75m1.5-.75h4.5c.621 0 1.125.504 1.125 1.125V3.75h-6.75v-.375c0-.621.504-1.125 1.125-1.125z' },
            { id: 'statistik', label: 'Statistik', icon: 'M3.75 3v16.5M21 19.5H3.75M6.75 12v3m3-6v6m3-9v9m3-12v12m3-15v15' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 bg-[#070E1A]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M19.5 12H9m10.5 0l-3-3m3 3l-3 3" />
            </svg>
            Keluar
          </button>
        </div>
      </aside>

      {/* ====== Backdrop for Mobile Sidebar ====== */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/55 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ====== Main Content Wrap ====== */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        {/* ====== Top Navbar ====== */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xs font-bold text-slate-400 tracking-widest uppercase">SMAN 12 KOTA TANGERANG SELATAN</h1>
              <p className="text-sm font-extrabold text-slate-800 tracking-wide mt-0.5">Sistem Poin Karakter Siswa</p>
            </div>
          </div>

          {/* ====== Search Bar Sederhana ====== */}
          <div className="hidden md:flex items-center relative w-64 mx-4">
            <input
              type="text"
              placeholder="Cari siswa cepat..."
              value={searchSiswaQuery}
              onChange={(e) => {
                setSearchSiswaQuery(e.target.value);
                setFilterKelas('Semua');
                if (activeTab !== 'siswa') {
                  setActiveTab('siswa');
                }
              }}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-300 text-slate-700 font-medium"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification bell badge */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative"
              title="Konsultasi Wali Murid Baru"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.041 9.041 0 01-9.717-.373 9.04 9.04 0 01-3.69-6.398 9.04 9.04 0 0110.963-9.529 9.041 9.041 0 018.775 6.333M21 21l-4.35-4.35M19 10.5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z" />
              </svg>
              {unrepliedCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {unrepliedCount}
                </span>
              )}
            </button>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-800">Ana Mukarromah, S.Si., M.Pd</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Wakasek Kesiswaan</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#0B1528] text-primary flex items-center justify-center font-extrabold text-sm border-2 border-primary/20 shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* ====== Dynamic Main Dashboard Content ====== */}
        <main className="p-6 md:p-8 flex-1 space-y-6 max-w-7xl w-full mx-auto">

          {/* ====== TAB 1: DASHBOARD ====== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
                {[
                  { label: 'Pelanggaran Hari Ini', val: todayViolationsCount, desc: 'Laporan tercatat hari ini', bg: 'bg-white', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', col: 'text-red-500 bg-red-50' },
                  { label: 'Siswa Dipantau', val: totalStudentsCount, desc: 'Jumlah total data siswa', bg: 'bg-white', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z', col: 'text-blue-500 bg-blue-50' },
                  { label: 'Laporan Minggu Ini', val: weeklyReportsCount, desc: 'Aktivitas poin 7 hari terakhir', bg: 'bg-white', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', col: 'text-orange-500 bg-orange-50' },
                  { label: 'Total Poin Masuk', val: `+${totalPointsIn}`, desc: 'Penghargaan positif masuk', bg: 'bg-white', icon: 'M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z', col: 'text-green-500 bg-green-50' }
                ].map((card, i) => (
                  <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">{card.label}</p>
                      <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{card.val}</h3>
                      <p className="text-[10px] text-slate-400 mt-1">{card.desc}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.col}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lower Section (Consultation Inbox & Recent Activity) */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Side: Parent Message Inbox */}
                <div className="xl:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col h-[520px]">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">Pesan Wali Murid</h3>
                    {unrepliedCount > 0 && (
                      <span className="px-2 py-0.5 bg-primary text-white text-[9px] font-extrabold rounded-full animate-pulse">
                        {unrepliedCount} BARU
                      </span>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 pt-4 pr-1">
                    {parentMessages.map((msg) => (
                      <div key={msg.id} className={`border rounded-xl p-4 transition-all duration-200 ${
                        msg.dibalas ? 'bg-slate-50/50 border-slate-100' : 'bg-primary/5 border-primary/20 shadow-sm'
                      }`}>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{msg.namaOrangTua}</h4>
                            <p className="text-[10px] text-slate-400">Wali dari {msg.namaSiswa} ({msg.kelas})</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap">{msg.tanggal}</span>
                            <button
                              onClick={() => handleDeletePesan(msg.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded transition-colors shrink-0"
                              title="Hapus Pesan"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100 leading-relaxed italic">
                          "{msg.pesan}"
                        </p>
                        
                        {replyMessageId === msg.id ? (
                          <div className="mt-3">
                            <div className="space-y-2">
                              <textarea
                                rows="2"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Ketik balasan Anda..."
                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-300 resize-none text-slate-700 font-medium"
                              />
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => setReplyMessageId(null)}
                                  className="px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:underline"
                                >
                                  Batal
                                </button>
                                <button
                                  onClick={() => handleSaveReply(msg.id)}
                                  className="px-3 py-1 bg-[#0B1528] hover:bg-[#12233f] text-white text-[10px] font-bold uppercase rounded-md shadow-sm"
                                >
                                  Simpan
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : msg.dibalas ? (
                          <div className="mt-3 text-[11px] text-slate-600 pl-3 border-l-2 border-slate-300">
                            <div className="flex justify-between items-center">
                              <p className="font-bold text-slate-900">Balasan Anda:</p>
                              <button
                                onClick={() => {
                                  setReplyMessageId(msg.id);
                                  setReplyText(msg.balasan);
                                }}
                                className="text-[10px] font-bold text-[#F5921B] hover:text-[#e08110] transition-colors"
                              >
                                Ubah Balasan
                              </button>
                            </div>
                            <p className="italic bg-slate-100 p-2 rounded text-slate-500 mt-1">"{msg.balasan}"</p>
                          </div>
                        ) : (
                          <div className="mt-3">
                            <button
                              onClick={() => {
                                setReplyMessageId(msg.id);
                                setReplyText('');
                              }}
                              className="w-full text-center py-1.5 bg-[#0B1528] hover:bg-[#12233f] text-white text-[10px] font-bold uppercase rounded-lg transition-all"
                            >
                              Tulis Balasan
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {parentMessages.length === 0 && (
                      <div className="text-center py-16 text-slate-400 text-xs">
                        Tidak ada pesan masuk.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Recent Violations */}
                <div className="xl:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col h-[520px]">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">Pelanggaran & Penghargaan Terbaru</h3>
                    <button onClick={() => setActiveTab('riwayat_pelanggaran')} className="text-[10px] text-primary font-bold hover:underline uppercase">
                      Lihat Semua
                    </button>
                  </div>

                  <div className="flex-1 overflow-x-auto pt-3">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold tracking-wider uppercase">
                          <th className="py-3 px-4">Nama Siswa</th>
                          <th className="py-3 px-4">Tanggal</th>
                          <th className="py-3 px-4">Kategori</th>
                          <th className="py-3 px-4">Keterangan</th>
                          <th className="py-3 px-4 text-right">Poin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {allHistory.slice(0, 7).map((act) => {
                          const sInfo = students.find(s => s.nisn === act.nisn);
                          return (
                            <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 px-4 font-bold text-slate-900">
                                {sInfo ? sInfo.name : 'Siswa'}
                                <span className="block text-[9px] text-slate-400 font-medium">{act.nisn}</span>
                              </td>
                              <td className="py-3 px-4 text-slate-500 font-medium whitespace-nowrap">{act.tanggal}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-block px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                                  act.kategori.toLowerCase() === 'penghargaan' ? 'bg-emerald-50 text-emerald-600' :
                                  act.kategori.toLowerCase() === 'pelanggaran ringan' ? 'bg-yellow-50 text-yellow-600' :
                                  act.kategori.toLowerCase() === 'pelanggaran sedang' ? 'bg-orange-50 text-orange-600' :
                                  'bg-red-50 text-red-600'
                                }`}>
                                  {act.kategori}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-600 font-medium max-w-[150px] truncate" title={act.keterangan}>
                                {act.keterangan}
                              </td>
                              <td className={`py-3 px-4 text-right font-extrabold font-mono text-sm ${
                                act.type === 'positive' ? 'text-green-600' : 'text-red-500'
                              }`}>
                                {act.poin}
                              </td>
                            </tr>
                          );
                        })}

                        {allHistory.length === 0 && (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-slate-400">
                              Tidak ada riwayat aktivitas poin kesiswaan.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====== TAB 2: DATA SISWA ====== */}
          {activeTab === 'siswa' && (
            <>
              {/* Table Card (Full width on desktop to ensure actions column is completely visible) */}
              <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                {/* Header Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">Daftar Poin Karakter Siswa</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Cari siswa, pantau skor kedisiplinan, dan lakukan penyesuaian poin.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        setIsStudentModalOpen(true);
                      }}
                      className="px-3 py-2 bg-[#0B1528] hover:bg-[#12233f] text-white text-xs font-bold uppercase rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Tambah Siswa
                    </button>
                    <div className="relative flex-1 sm:w-44">
                      <input
                        type="text"
                        placeholder="Cari Nama / NISN..."
                        value={searchSiswaQuery}
                        onChange={(e) => setSearchSiswaQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-300 text-slate-700 font-medium"
                      />
                      <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>

                    <select
                      value={filterKelas}
                      onChange={(e) => setFilterKelas(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-600 font-medium"
                    >
                      <option value="Semua">Semua Kelas</option>
                      <option value="XII MIPA 1">XII MIPA 1</option>
                      <option value="XII MIPA 2">XII MIPA 2</option>
                      <option value="XI MIPA 3">XI MIPA 3</option>
                    </select>
                  </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold tracking-wider uppercase whitespace-nowrap">
                        <th className="py-4 px-4">Nama Siswa</th>
                        <th className="py-4 px-4">NISN</th>
                        <th className="py-4 px-4">Kelas</th>
                        <th className="py-4 px-4">Password (Siswa/Ortu)</th>
                        <th className="py-4 px-4 text-center">Poin Sisa (Karakter)</th>
                        <th className="py-4 px-4 text-center">Poin Pelanggaran</th>
                        <th className="py-4 px-4 text-center">Poin Penghargaan</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudentsList.map((siswa) => {
                        let statusBadge = 'bg-emerald-50 text-emerald-600';
                        if (siswa.status === 'Panggilan I') statusBadge = 'bg-blue-50 text-blue-600';
                        else if (siswa.status === 'Panggilan II') statusBadge = 'bg-yellow-50 text-yellow-600';
                        else if (siswa.status === 'Panggilan III') statusBadge = 'bg-orange-50 text-orange-600';
                        else if (siswa.status === 'Panggilan IV') statusBadge = 'bg-red-50 text-red-500';
                        else if (siswa.status === 'Panggilan Terakhir') statusBadge = 'bg-red-100 text-red-700';

                        const sisaPoin = Math.max(0, Math.min(100, 100 - (siswa.poin_pelanggaran || 0) + (siswa.poin_penghargaan || 0)));

                        return (
                          <tr key={siswa.nisn} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">{siswa.name}</td>
                            <td className="py-4 px-4 font-mono text-slate-500 whitespace-nowrap">{siswa.nisn}</td>
                            <td className="py-4 px-4 font-medium text-slate-600 whitespace-nowrap">{siswa.kelas}</td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] text-slate-400 font-bold uppercase w-10">Siswa:</span>
                                  <span className="font-mono text-slate-700 font-bold text-[10px] bg-slate-100 px-1 py-0.5 rounded">{siswa.passwordSiswa || 'siswa123'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] text-slate-400 font-bold uppercase w-10">Ortu:</span>
                                  <span className="font-mono text-slate-700 font-bold text-[10px] bg-slate-100 px-1 py-0.5 rounded">{siswa.passwordOrangTua || 'ortu123'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center font-extrabold text-sm font-mono whitespace-nowrap">
                              <span className={
                                sisaPoin === 100 ? 'text-emerald-600' :
                                sisaPoin >= 80 ? 'text-blue-600' :
                                sisaPoin >= 60 ? 'text-yellow-600' :
                                sisaPoin >= 40 ? 'text-orange-600' : 'text-red-600'
                              }>
                                {sisaPoin} Pts
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center font-extrabold text-red-500 text-sm font-mono whitespace-nowrap">
                              {siswa.poin_pelanggaran || 0} Pts
                            </td>
                            <td className="py-4 px-4 text-center font-extrabold text-emerald-600 text-sm font-mono whitespace-nowrap">
                              +{siswa.poin_penghargaan || 0} Pts
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className={`px-2.5 py-0.5 rounded font-extrabold text-[9px] uppercase tracking-wider whitespace-nowrap ${statusBadge}`}>
                                {siswa.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditStudentClick(siswa)}
                                  className="px-2 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold uppercase rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1"
                                  title="Edit Data & Password"
                                >
                                  <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteStudentClick(siswa.nisn, siswa.name)}
                                  className="px-2 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1"
                                  title="Hapus Siswa"
                                >
                                  <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Hapus
                                </button>
                                <button
                                  onClick={() => handleSelectStudentForPelanggaran(siswa.nisn)}
                                  className="px-2 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase rounded-lg shadow-sm transition-all active:scale-95"
                                >
                                  + Pelanggaran
                                </button>
                                <button
                                  onClick={() => handleSelectStudentForPenghargaan(siswa.nisn)}
                                  className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase rounded-lg shadow-sm transition-all active:scale-95"
                                >
                                  + Penghargaan
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredStudentsList.length === 0 && (
                        <tr>
                          <td colSpan="8" className="py-12 text-center text-slate-400">
                            Siswa tidak ditemukan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ====== Modal Registrasi / Edit Siswa ====== */}
              {isStudentModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
                  <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 transform transition-all duration-300">
                    {/* Modal Header */}
                    <div className="px-6 py-4 bg-[#0B1528] text-white flex items-center justify-between">
                      <h3 className="text-xs font-extrabold tracking-wider uppercase">
                        {isEditMode ? '✏️ Edit Data & Akun Siswa' : '👤 Registrasi Siswa Baru'}
                      </h3>
                      <button
                        type="button"
                        onClick={resetAddStudentForm}
                        className="w-6 h-6 text-slate-400 hover:text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Modal Body */}
                    <form onSubmit={handleSaveNewStudent} className="p-6 space-y-4">
                      {modalError && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl animate-fadeIn">
                          {modalError}
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Lengkap Siswa</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Muhammad Rafli"
                          value={newStudentName}
                          onChange={(e) => setNewStudentName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 placeholder:text-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">NISN (10 Digit)</label>
                        <input
                          type="text"
                          required
                          disabled={isEditMode}
                          maxLength={10}
                          placeholder="Contoh: 0023456789"
                          value={newStudentNisn}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setNewStudentNisn(val);
                          }}
                          className={`w-full px-4 py-2.5 border rounded-xl text-xs font-mono font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 placeholder:text-slate-300 ${isEditMode ? 'bg-slate-100 border-slate-200 cursor-not-allowed text-slate-400' : 'bg-slate-50 border-slate-200'}`}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Kelas</label>
                        <select
                          required
                          value={newStudentKelas}
                          onChange={(e) => setNewStudentKelas(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                        >
                          <option value="XII MIPA 1">XII MIPA 1</option>
                          <option value="XII MIPA 2">XII MIPA 2</option>
                          <option value="XI MIPA 3">XI MIPA 3</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password Akun Siswa</label>
                        <input
                          type="text"
                          required
                          value={newStudentPasswordSiswa}
                          onChange={(e) => setNewStudentPasswordSiswa(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 placeholder:text-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password Akun Orang Tua</label>
                        <input
                          type="text"
                          required
                          value={newStudentPasswordOrangTua}
                          onChange={(e) => setNewStudentPasswordOrangTua(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 placeholder:text-slate-300"
                        />
                      </div>

                      <div className="pt-2 flex flex-col gap-2">
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#0B1528] hover:bg-[#12233f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-4 h-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            {isEditMode ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            )}
                          </svg>
                          {isEditMode ? 'Perbarui Data & Akun' : 'Simpan Siswa & Akun'}
                        </button>
                        <button
                          type="button"
                          onClick={resetAddStudentForm}
                          className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ====== TAB 3A: INPUT PELANGGARAN ====== */}
          {activeTab === 'input_pelanggaran' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm max-w-xl mx-auto space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">Input Pelanggaran Kesiswaan</h3>
                <p className="text-xs text-slate-400 mt-1">Gunakan form ini untuk mencatat pelanggaran tata tertib siswa.</p>
              </div>

              <form onSubmit={handleSaveViolation} className="space-y-5">
                <div className="relative">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pilih Siswa</label>
                  
                  {formNisn ? (
                    (() => {
                      const s = students.find(siswa => siswa.nisn === formNisn);
                      if (!s) return null;
                      let statusBg = 'bg-emerald-50 text-emerald-600 border-emerald-200/50';
                      if (s.status === 'Bebas Pelanggaran') statusBg = 'bg-emerald-50 text-emerald-600 border-emerald-200/50';
                      else if (s.status === 'Panggilan I') statusBg = 'bg-blue-50 text-blue-600 border-blue-200/50';
                      else if (s.status === 'Panggilan II') statusBg = 'bg-yellow-50 text-yellow-600 border-yellow-200/50';
                      else if (s.status === 'Panggilan III') statusBg = 'bg-orange-50 text-orange-600 border-orange-200/50';
                      else if (s.status === 'Panggilan IV') statusBg = 'bg-red-50 text-red-500 border-red-200/50';
                      else if (s.status === 'Panggilan Terakhir') statusBg = 'bg-red-100 text-red-700 border-red-300/50';

                      const initials = s.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

                      return (
                        <div className="bg-[#0B1528]/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-4 animate-fadeIn">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0B1528] text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-primary/20">
                              {initials}
                            </div>
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-900">{s.name}</h4>
                              <p className="text-[10px] text-slate-500 font-medium">NISN: {s.nisn} | Kelas: {s.kelas}</p>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[10px] text-slate-500 font-semibold animate-fadeIn">
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase">Sisa Poin:</span>
                                  <span className={`font-extrabold font-mono whitespace-nowrap ${
                                    (100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)) >= 80 ? 'text-emerald-600' :
                                    (100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)) >= 60 ? 'text-blue-600' :
                                    (100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)) >= 40 ? 'text-amber-500' : 'text-red-600'
                                  }`}>{Math.max(0, Math.min(100, 100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)))} Pts</span>
                                </div>
                                <div className="h-3 w-px bg-slate-200 shrink-0" />
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase">Pelanggaran:</span>
                                  <span className="font-extrabold text-red-500 font-mono whitespace-nowrap">{s.poin_pelanggaran || 0} Pts</span>
                                </div>
                                <div className="h-3 w-px bg-slate-200 shrink-0" />
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase">Penghargaan:</span>
                                  <span className="font-extrabold text-emerald-600 font-mono whitespace-nowrap">+{s.poin_penghargaan || 0} Pts</span>
                                </div>
                                <div className="h-3 w-px bg-slate-200 shrink-0" />
                                <span className={`px-2 py-0.5 rounded-md font-bold text-[8px] uppercase tracking-wider border shrink-0 whitespace-nowrap ${statusBg}`}>
                                  {s.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setFormNisn('');
                              setStudentSearchQuery('');
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px] font-bold uppercase rounded-lg shadow-sm transition-all active:scale-95 shrink-0"
                          >
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            Ganti Siswa
                          </button>
                        </div>
                      );
                    })()
                  ) : (
                    <div ref={dropdownRef} className="relative z-30">
                      <div className="relative z-50">
                        <input
                          type="text"
                          placeholder="Cari siswa dengan nama, NISN, atau kelas..."
                          value={studentSearchQuery}
                          onChange={(e) => {
                            setStudentSearchQuery(e.target.value);
                            setIsDropdownOpen(true);
                          }}
                          onFocus={() => setIsDropdownOpen(true)}
                          className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                        />
                        <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                      </div>

                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-2xl max-h-56 overflow-y-auto z-50 divide-y divide-slate-100 animate-slideDown font-medium">
                            {students
                              .filter(s => 
                                s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || 
                                s.nisn.includes(studentSearchQuery) || 
                                s.kelas.toLowerCase().includes(studentSearchQuery.toLowerCase())
                              )
                              .map((s) => {
                                const initials = s.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
                                return (
                                  <button
                                    key={s.nisn}
                                    type="button"
                                    onClick={() => {
                                      setFormNisn(s.nisn);
                                      setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 text-[#0B1528] font-bold flex items-center justify-center text-[10px] shrink-0 border border-slate-200">
                                        {initials}
                                      </div>
                                      <div>
                                        <span className="block text-xs font-bold text-slate-900">{s.name}</span>
                                        <span className="block text-[10px] text-slate-500 font-medium">Kelas: {s.kelas} | NISN: {s.nisn}</span>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className={`block text-[10px] font-extrabold font-mono px-2 py-0.5 rounded ${
                                        (100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)) >= 80 ? 'bg-emerald-50 text-emerald-600' :
                                        (100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)) >= 60 ? 'bg-yellow-50 text-yellow-600 border border-yellow-200/50' :
                                        (100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)) >= 40 ? 'bg-orange-50 text-orange-600 border border-orange-200/50' : 'bg-red-50 text-red-600'
                                      }`}>
                                        Sisa: {Math.max(0, Math.min(100, 100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)))} Pts
                                      </span>
                                      <span className="block text-[8px] font-bold text-slate-400 font-mono mt-0.5">
                                        {s.poin_pelanggaran || 0} PR | +{s.poin_penghargaan || 0} PH
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            {students.filter(s => 
                              s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || 
                              s.nisn.includes(studentSearchQuery) || 
                              s.kelas.toLowerCase().includes(studentSearchQuery.toLowerCase())
                            ).length === 0 && (
                              <div className="px-4 py-4 text-center text-xs text-slate-400">
                                Siswa tidak ditemukan
                              </div>
                            )}
                          </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Searchable/Selectable Point Rules Dropdown */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pilih Aturan Tata Tertib Resmi</label>
                  <select
                    value={selectedRuleId}
                    onChange={(e) => {
                      const ruleId = e.target.value;
                      setSelectedRuleId(ruleId);
                      if (ruleId) {
                        const rule = pointRules.find(r => r.id === parseInt(ruleId));
                        if (rule) {
                          setFormTipe(rule.tipe);
                          setFormKategori(rule.kategori);
                          setFormJumlah(rule.poin);
                          setFormKeterangan(`[${rule.kode}] ${rule.nama}`);
                        }
                      } else {
                        setSelectedRuleId('');
                      }
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                  >
                    <option value="">-- Input Manual (Bukan Aturan Resmi) --</option>
                    <optgroup label="Pelanggaran Ringan (PR)">
                      {pointRules.filter(r => r.kode.startsWith('PR.')).map(r => (
                        <option key={r.id} value={r.id}>
                          {r.kode} - {r.nama.length > 55 ? r.nama.substring(0, 55) + '...' : r.nama} ({r.poin} Poin)
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Pelanggaran Sedang (PS)">
                      {pointRules.filter(r => r.kode.startsWith('PS.')).map(r => (
                        <option key={r.id} value={r.id}>
                          {r.kode} - {r.nama.length > 55 ? r.nama.substring(0, 55) + '...' : r.nama} ({r.poin} Poin)
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Pelanggaran Berat (PB)">
                      {pointRules.filter(r => r.kode.startsWith('PB.')).map(r => (
                        <option key={r.id} value={r.id}>
                          {r.kode} - {r.nama.length > 55 ? r.nama.substring(0, 55) + '...' : r.nama} ({r.poin} Poin)
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Kategori Pelanggaran</label>
                  <select
                    value={formKategori}
                    onChange={(e) => setFormKategori(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                  >
                    <option value="Pelanggaran Ringan">Pelanggaran Ringan</option>
                    <option value="Pelanggaran Sedang">Pelanggaran Sedang</option>
                    <option value="Pelanggaran Berat">Pelanggaran Berat</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Poin Pelanggaran</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formJumlah}
                      onChange={(e) => setFormJumlah(parseInt(e.target.value))}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tanggal</label>
                    <input
                      type="date"
                      value={formTanggal}
                      onChange={(e) => setFormTanggal(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Keterangan Kejadian</label>
                  <textarea
                    rows="3"
                    value={formKeterangan}
                    onChange={(e) => setFormKeterangan(e.target.value)}
                    placeholder="Contoh: Datang terlambat lebih dari 15 menit tanpa surat keterangan..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 placeholder:text-slate-300 resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={!formNisn}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Simpan Pelanggaran
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ====== TAB 3B: INPUT PENGHARGAAN ====== */}
          {activeTab === 'input_penghargaan' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm max-w-xl mx-auto space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">Input Penghargaan Siswa</h3>
                <p className="text-xs text-slate-400 mt-1">Gunakan form ini untuk mencatat penghargaan prestasi siswa.</p>
              </div>

              <form onSubmit={handleSaveViolation} className="space-y-5">
                <div className="relative">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pilih Siswa</label>
                  
                  {formNisn ? (
                    (() => {
                      const s = students.find(siswa => siswa.nisn === formNisn);
                      if (!s) return null;
                      let statusBg = 'bg-emerald-50 text-emerald-600 border-emerald-200/50';
                      if (s.status === 'Bebas Pelanggaran') statusBg = 'bg-emerald-50 text-emerald-600 border-emerald-200/50';
                      else if (s.status === 'Panggilan I') statusBg = 'bg-blue-50 text-blue-600 border-blue-200/50';
                      else if (s.status === 'Panggilan II') statusBg = 'bg-yellow-50 text-yellow-600 border-yellow-200/50';
                      else if (s.status === 'Panggilan III') statusBg = 'bg-orange-50 text-orange-600 border-orange-200/50';
                      else if (s.status === 'Panggilan IV') statusBg = 'bg-red-50 text-red-500 border-red-200/50';
                      else if (s.status === 'Panggilan Terakhir') statusBg = 'bg-red-100 text-red-700 border-red-300/50';

                      const initials = s.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

                      return (
                        <div className="bg-[#0B1528]/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-4 animate-fadeIn">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0B1528] text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-primary/20">
                              {initials}
                            </div>
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-900">{s.name}</h4>
                              <p className="text-[10px] text-slate-500 font-medium">NISN: {s.nisn} | Kelas: {s.kelas}</p>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[10px] text-slate-500 font-semibold animate-fadeIn">
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase">Sisa Poin:</span>
                                  <span className={`font-extrabold font-mono whitespace-nowrap ${
                                    (100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)) >= 80 ? 'text-emerald-600' :
                                    (100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)) >= 60 ? 'text-blue-600' :
                                    (100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)) >= 40 ? 'text-amber-500' : 'text-red-600'
                                  }`}>{Math.max(0, Math.min(100, 100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)))} Pts</span>
                                </div>
                                <div className="h-3 w-px bg-slate-200 shrink-0" />
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase">Pelanggaran:</span>
                                  <span className="font-extrabold text-red-500 font-mono whitespace-nowrap">{s.poin_pelanggaran || 0} Pts</span>
                                </div>
                                <div className="h-3 w-px bg-slate-200 shrink-0" />
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase">Penghargaan:</span>
                                  <span className="font-extrabold text-emerald-600 font-mono whitespace-nowrap">+{s.poin_penghargaan || 0} Pts</span>
                                </div>
                                <div className="h-3 w-px bg-slate-200 shrink-0" />
                                <span className={`px-2 py-0.5 rounded-md font-bold text-[8px] uppercase tracking-wider border shrink-0 whitespace-nowrap ${statusBg}`}>
                                  {s.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setFormNisn('');
                              setStudentSearchQuery('');
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px] font-bold uppercase rounded-lg shadow-sm transition-all active:scale-95 shrink-0"
                          >
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            Ganti Siswa
                          </button>
                        </div>
                      );
                    })()
                  ) : (
                    <div ref={dropdownRef} className="relative z-30">
                      <div className="relative z-50">
                        <input
                          type="text"
                          placeholder="Cari siswa dengan nama, NISN, atau kelas..."
                          value={studentSearchQuery}
                          onChange={(e) => {
                            setStudentSearchQuery(e.target.value);
                            setIsDropdownOpen(true);
                          }}
                          onFocus={() => setIsDropdownOpen(true)}
                          className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                        />
                        <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                      </div>

                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-2xl max-h-56 overflow-y-auto z-50 divide-y divide-slate-100 animate-slideDown font-medium">
                            {students
                              .filter(s => 
                                s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || 
                                s.nisn.includes(studentSearchQuery) || 
                                s.kelas.toLowerCase().includes(studentSearchQuery.toLowerCase())
                              )
                              .map((s) => {
                                const initials = s.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
                                return (
                                  <button
                                    key={s.nisn}
                                    type="button"
                                    onClick={() => {
                                      setFormNisn(s.nisn);
                                      setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 text-[#0B1528] font-bold flex items-center justify-center text-[10px] shrink-0 border border-slate-200">
                                        {initials}
                                      </div>
                                      <div>
                                        <span className="block text-xs font-bold text-slate-900">{s.name}</span>
                                        <span className="block text-[10px] text-slate-500 font-medium">Kelas: {s.kelas} | NISN: {s.nisn}</span>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className={`block text-[10px] font-extrabold font-mono px-2 py-0.5 rounded ${
                                        (100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)) >= 80 ? 'bg-emerald-50 text-emerald-600' :
                                        (100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)) >= 60 ? 'bg-yellow-50 text-yellow-600 border border-yellow-200/50' :
                                        (100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)) >= 40 ? 'bg-orange-50 text-orange-600 border border-orange-200/50' : 'bg-red-50 text-red-600'
                                      }`}>
                                        Sisa: {Math.max(0, Math.min(100, 100 - (s.poin_pelanggaran || 0) + (s.poin_penghargaan || 0)))} Pts
                                      </span>
                                      <span className="block text-[8px] font-bold text-slate-400 font-mono mt-0.5">
                                        {s.poin_pelanggaran || 0} PR | +{s.poin_penghargaan || 0} PH
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            {students.filter(s => 
                              s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || 
                              s.nisn.includes(studentSearchQuery) || 
                              s.kelas.toLowerCase().includes(studentSearchQuery.toLowerCase())
                            ).length === 0 && (
                              <div className="px-4 py-4 text-center text-xs text-slate-400">
                                Siswa tidak ditemukan
                              </div>
                            )}
                          </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Kategori</label>
                  <input
                    type="text"
                    value="Penghargaan"
                    disabled
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Poin Penghargaan</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formJumlah}
                      onChange={(e) => setFormJumlah(parseInt(e.target.value))}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tanggal</label>
                    <input
                      type="date"
                      value={formTanggal}
                      onChange={(e) => setFormTanggal(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Prestasi / Kegiatan</label>
                  <textarea
                    rows="3"
                    value={formKeterangan}
                    onChange={(e) => setFormKeterangan(e.target.value)}
                    placeholder="Contoh: Memenangkan Juara I Lomba Matematika tingkat Kota..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 placeholder:text-slate-300 resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={!formNisn}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Simpan Penghargaan
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ====== TAB 4A: RIWAYAT PELANGGARAN ====== */}
          {activeTab === 'riwayat_pelanggaran' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Header Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">Riwayat Pelanggaran Siswa</h3>
                  <p className="text-xs text-slate-400 mt-1">Log aktivitas pencatatan poin pelanggaran tata tertib kesiswaan.</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Cari Nama / NISN..."
                    value={searchHistoryQuery}
                    onChange={(e) => setSearchHistoryQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-300"
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold tracking-wider uppercase">
                      <th className="py-4 px-6">Nama Siswa</th>
                      <th className="py-4 px-6">Tanggal</th>
                      <th className="py-4 px-6">Kategori</th>
                      <th className="py-4 px-6">Catatan Kegiatan</th>
                      <th className="py-4 px-6 text-right">Poin Pelanggaran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHistoryPelanggaran.map((act) => {
                      const sInfo = students.find(s => s.nisn === act.nisn);
                      return (
                        <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">
                            {sInfo ? sInfo.name : 'Siswa'}
                            <span className="block text-[9px] text-slate-400 font-medium">NISN: {act.nisn}</span>
                          </td>
                          <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">{act.tanggal}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-block px-2.5 py-0.5 rounded font-bold uppercase text-[9px] ${
                              act.kategori.toLowerCase() === 'pelanggaran ringan' ? 'bg-yellow-50 text-yellow-600' :
                              act.kategori.toLowerCase() === 'pelanggaran sedang' ? 'bg-orange-50 text-orange-600' :
                              'bg-red-50 text-red-600'
                            }`}>
                              {act.kategori}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-600 font-medium leading-relaxed max-w-sm">
                            {act.keterangan}
                          </td>
                          <td className="py-4 px-6 text-right font-extrabold font-mono text-sm text-red-500">
                            {act.poin}
                          </td>
                        </tr>
                      );
                    })}

                    {filteredHistoryPelanggaran.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-slate-400">
                          Riwayat pelanggaran tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====== TAB 4B: RIWAYAT PENGHARGAAN ====== */}
          {activeTab === 'riwayat_penghargaan' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Header Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">Riwayat Penghargaan Siswa</h3>
                  <p className="text-xs text-slate-400 mt-1">Log aktivitas pencatatan poin penghargaan atas prestasi siswa.</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Cari Nama / NISN..."
                    value={searchHistoryQuery}
                    onChange={(e) => setSearchHistoryQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-300"
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold tracking-wider uppercase">
                      <th className="py-4 px-6">Nama Siswa</th>
                      <th className="py-4 px-6">Tanggal</th>
                      <th className="py-4 px-6">Kategori</th>
                      <th className="py-4 px-6">Catatan Kegiatan / Prestasi</th>
                      <th className="py-4 px-6 text-right">Poin Penghargaan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHistoryPenghargaan.map((act) => {
                      const sInfo = students.find(s => s.nisn === act.nisn);
                      return (
                        <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">
                            {sInfo ? sInfo.name : 'Siswa'}
                            <span className="block text-[9px] text-slate-400 font-medium">NISN: {act.nisn}</span>
                          </td>
                          <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">{act.tanggal}</td>
                          <td className="py-4 px-6">
                            <span className="inline-block px-2.5 py-0.5 rounded font-bold uppercase text-[9px] bg-emerald-50 text-emerald-600">
                              {act.kategori}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-600 font-medium leading-relaxed max-w-sm">
                            {act.keterangan}
                          </td>
                          <td className="py-4 px-6 text-right font-extrabold font-mono text-sm text-green-600">
                            {act.poin}
                          </td>
                        </tr>
                      );
                    })}

                    {filteredHistoryPenghargaan.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-slate-400">
                          Riwayat penghargaan tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====== TAB 5: STATISTIK ====== */}
          {activeTab === 'statistik' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Kedisiplinan Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">Tingkat Kedisiplinan Siswa</h3>
                    <p className="text-xs text-slate-400 mt-1">Distribusi status evaluasi kedisiplinan siswa terpantau.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Bebas Pelanggaran', count: statStatus.bebasPelanggaran, color: 'bg-emerald-500', total: totalStudentsCount },
                      { label: 'Panggilan I', count: statStatus.panggilanI, color: 'bg-blue-500', total: totalStudentsCount },
                      { label: 'Panggilan II', count: statStatus.panggilanII, color: 'bg-yellow-500', total: totalStudentsCount },
                      { label: 'Panggilan III', count: statStatus.panggilanIII, color: 'bg-orange-500', total: totalStudentsCount },
                      { label: 'Panggilan IV', count: statStatus.panggilanIV, color: 'bg-red-400', total: totalStudentsCount },
                      { label: 'Panggilan Terakhir', count: statStatus.panggilanTerakhir, color: 'bg-red-600', total: totalStudentsCount }
                    ].map((item, index) => {
                      const percentage = item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
                      return (
                        <div key={index} className="space-y-1.5">
                          <div className="flex justify-between text-xs text-slate-600">
                            <span className="font-bold">{item.label}</span>
                            <span className="font-mono font-bold text-slate-800">{item.count} Siswa ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                            <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Kategori Pelanggaran Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">Laporan Poin per Kategori</h3>
                    <p className="text-xs text-slate-400 mt-1">Jumlah pencatatan data poin berdasarkan kategori karakter.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Pelanggaran Ringan', count: statKategori.ringan, color: 'bg-yellow-500', total: statKategori.ringan + statKategori.sedang + statKategori.berat + statKategori.penghargaan },
                      { label: 'Pelanggaran Sedang', count: statKategori.sedang, color: 'bg-orange-500', total: statKategori.ringan + statKategori.sedang + statKategori.berat + statKategori.penghargaan },
                      { label: 'Pelanggaran Berat', count: statKategori.berat, color: 'bg-red-500', total: statKategori.ringan + statKategori.sedang + statKategori.berat + statKategori.penghargaan },
                      { label: 'Penghargaan', count: statKategori.penghargaan, color: 'bg-emerald-500', total: statKategori.ringan + statKategori.sedang + statKategori.berat + statKategori.penghargaan }
                    ].map((item, index) => {
                      const percentage = item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
                      return (
                        <div key={index} className="space-y-1.5">
                          <div className="flex justify-between text-xs text-slate-600">
                            <span className="font-bold">{item.label}</span>
                            <span className="font-mono font-bold text-slate-800">{item.count} Laporan ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                            <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
};

export default GuruDashboardPage;
