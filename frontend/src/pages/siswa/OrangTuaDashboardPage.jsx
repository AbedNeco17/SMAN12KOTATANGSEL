import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { localStore } from '@services/localStore';
import ConfirmModal from '@components/ui/ConfirmModal';

const OrangTuaDashboardPage = () => {
  const navigate = useNavigate();
  const [parent, setParent] = useState({ name: 'Orang Tua', nisn: '0012345678', kelas: 'XII MIPA 2', role: 'orangtua' });
  const [studentPoints, setStudentPoints] = useState({ poin_pelanggaran: 0, poin_penghargaan: 0, name: 'Lucas Adiputra', status: 'Bebas Pelanggaran' });
  const [pointActivities, setPointActivities] = useState([]);
  const [violationPoints, setViolationPoints] = useState(0);
  const [langkahPembinaan, setLangkahPembinaan] = useState({ tahap: 'Bebas Pelanggaran', pembina: '-', tindakan: '' });
  const [pointRules, setPointRules] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showBkContact, setShowBkContact] = useState(false);
  const [confirmedReview, setConfirmedReview] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    const token = localStorage.getItem('siswaToken') || sessionStorage.getItem('siswaToken');
    const savedProfile = localStorage.getItem('siswaProfile') || sessionStorage.getItem('siswaProfile');

    if (!token) {
      navigate('/kesiswaan/login/siswa');
    } else if (savedProfile) {
      const prof = JSON.parse(savedProfile);
      setParent(prof);

      const sData = localStore.getSiswaByNisn(prof.nisn);
      if (sData) {
        setStudentPoints(sData);
      }

      const history = localStore.getRiwayatPoin(prof.nisn);
      setPointActivities(history);

      const notifs = localStore.getSiswaNotifikasi(prof.nisn);
      setNotifications(notifs);

      const bkMsgs = localStore.getPesanBk().filter(m => m.nisn === prof.nisn);
      setSentMessages(bkMsgs);

      const vPts = localStore.getViolationPoints(prof.nisn);
      setViolationPoints(vPts);
      setLangkahPembinaan(localStore.getLangkahPembinaan(vPts));
      setPointRules(localStore.getPointRules());
    }
  }, [navigate]);

  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const vPoints = studentPoints.poin_pelanggaran || 0;
    const aPoints = studentPoints.poin_penghargaan || 0;
    const currentStatus = studentPoints.status || 'Bebas Pelanggaran';
    
    const rows = pointActivities.map((act, index) => `
      <tr style="border-bottom: 1px solid #000000;">
        <td style="padding: 10px; font-family: monospace;">${index + 1}</td>
        <td style="padding: 10px;">${act.tanggal}</td>
        <td style="padding: 10px; font-weight: bold; color: #000000;">${act.type === 'negative' ? 'Pelanggaran' : 'Penghargaan'}</td>
        <td style="padding: 10px;">${act.kategori}</td>
        <td style="padding: 10px;">${act.keterangan}</td>
        <td style="padding: 10px; font-family: monospace; font-weight: bold; color: #000000;">
          ${act.type === 'negative' ? '' : '+'}${act.poin.replace(/[^0-9]/g, '')} Pts
        </td>
      </tr>
    `).join('');

    const htmlContent = `
      <html>
      <head>
        <title>Laporan Poin Karakter Siswa - SMAN 12 Tangerang Selatan</title>
        <style>
          @page {
            size: auto;
            margin: 0mm;
          }
          @media print {
            body { margin: 20mm 15mm; padding: 0; font-family: Arial, sans-serif; font-size: 12px; color: #000000; }
            .no-print { display: none; }
          }
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #000000; line-height: 1.5; }
          .header-table { width: 100%; border-collapse: collapse; border-bottom: 3px double #000000; padding-bottom: 10px; margin-bottom: 25px; }
          .header-logo { width: 80px; text-align: center; }
          .header-text { text-align: center; }
          .header-title { font-size: 16px; font-weight: bold; margin: 0; text-transform: uppercase; }
          .header-subtitle { font-size: 18px; font-weight: bold; margin: 3px 0 0 0; text-transform: uppercase; }
          .header-info { font-size: 10px; font-style: italic; margin: 5px 0 0 0; color: #000000; }
          .student-info-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          .student-info-table td { padding: 6px 4px; font-size: 13px; color: #000000; }
          .summary-container { display: flex; gap: 15px; margin-bottom: 25px; }
          .summary-card { flex: 1; border: 1px solid #000000; border-radius: 8px; padding: 12px; text-align: center; background: #ffffff; }
          .summary-val { font-size: 20px; font-weight: bold; margin-top: 5px; color: #000000; }
          .history-table { width: 100%; border-collapse: collapse; margin-bottom: 35px; }
          .history-table th { background: #000000; color: white; padding: 12px 10px; font-size: 11px; text-transform: uppercase; text-align: left; }
          .history-table td { padding: 12px 10px; font-size: 12px; color: #000000; }
          .signature-container { display: flex; justify-content: space-between; margin-top: 50px; font-size: 13px; page-break-inside: avoid; color: #000000; }
          .signature-col { text-align: center; width: 30%; }
          .signature-space { height: 70px; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td class="header-logo">
              <img src="https://sman12kotatangsel.sch.id/wp-content/uploads/2021/08/cropped-cropped-cropped-LOGO-DUBES-trans-1.png" width="70" alt="Logo SMAN 12">
            </td>
            <td class="header-text">
              <div class="header-title">Pemerintah Provinsi Banten</div>
              <div class="header-title">Dinas Pendidikan dan Kebudayaan</div>
              <div class="header-subtitle">SMA Negeri 12 Kota Tangerang Selatan</div>
              <div class="header-info">Jl. Cilenggang I, Cilenggang, Kec. Serpong, Kota Tangerang Selatan, Banten 15310</div>
            </td>
          </tr>
        </table>

        <h3 style="text-align: center; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 0.5px;">Kartu Kendali Poin & Pembinaan Karakter Siswa</h3>
        
        <table class="student-info-table">
          <tr>
            <td style="width: 15%; font-weight: bold;">Nama Siswa</td>
            <td style="width: 35%;">: ${studentPoints.name}</td>
            <td style="width: 15%; font-weight: bold;">Tahun Ajaran</td>
            <td style="width: 35%;">: 2025/2026</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">NISN</td>
            <td>: ${parent.nisn}</td>
            <td style="font-weight: bold;">Kelas</td>
            <td>: ${studentPoints.kelas}</td>
          </tr>
        </table>

        <div class="summary-container">
          <div class="summary-card">
            <div style="font-size: 10px; text-transform: uppercase; color: #000000; font-weight: bold;">Poin Pelanggaran</div>
            <div class="summary-val" style="color: #000000;">${vPoints}</div>
          </div>
          <div class="summary-card">
            <div style="font-size: 10px; text-transform: uppercase; color: #000000; font-weight: bold;">Poin Penghargaan</div>
            <div class="summary-val" style="color: #000000;">+${aPoints}</div>
          </div>
          <div class="summary-card">
            <div style="font-size: 10px; text-transform: uppercase; color: #000000; font-weight: bold;">Status Kesiswaan</div>
            <div class="summary-val" style="color: #000000; font-size: 14px; text-transform: uppercase; margin-top: 10px;">${currentStatus}</div>
          </div>
        </div>

        <h4 style="margin: 0 0 10px 0; border-bottom: 1px solid #000000; padding-bottom: 5px; text-transform: uppercase;">Riwayat Pelanggaran & Penghargaan</h4>
        <table class="history-table">
          <thead>
            <tr>
              <th style="width: 5%;">No</th>
              <th style="width: 15%;">Tanggal</th>
              <th style="width: 15%;">Tipe</th>
              <th style="width: 20%;">Kategori</th>
              <th style="width: 35%;">Keterangan</th>
              <th style="width: 10%;">Skor</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length > 0 ? rows : '<tr><td colspan="6" style="text-align: center; color: #000000; padding: 20px;">Belum ada riwayat pelanggaran atau penghargaan tercatat.</td></tr>'}
          </tbody>
        </table>

        <div class="signature-container">
          <div class="signature-col">
            <div>Peserta Didik,</div>
            <div class="signature-space"></div>
            <div style="font-weight: bold; text-decoration: underline;">${studentPoints.name}</div>
            <div>NISN: ${parent.nisn}</div>
          </div>
          <div class="signature-col">
            <div>Orang Tua / Wali,</div>
            <div class="signature-space"></div>
            <div style="font-weight: bold; text-decoration: underline;">${parent.name}</div>
            <div>Wali Murid</div>
          </div>
          <div class="signature-col">
            <div>Tangerang Selatan, ${today}</div>
            <div>Wakasek Kesiswaan,</div>
            <div class="signature-space"></div>
            <div style="font-weight: bold; text-decoration: underline;">Ana Mukarromah, S.Si., M.Pd</div>
            <div>NIP: 197911172009022002</div>
          </div>
        </div>
      </body>
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleLogout = () => {
    localStorage.removeItem('siswaToken');
    localStorage.removeItem('siswaProfile');
    sessionStorage.removeItem('siswaToken');
    sessionStorage.removeItem('siswaProfile');
    navigate('/kesiswaan/login/siswa');
  };

  const handleMarkAsRead = (id) => {
    localStore.markNotifikasiRead(id);
    setNotifications(localStore.getSiswaNotifikasi(parent.nisn));
  };

  const handleDeleteNotification = (id) => {
    localStore.deleteNotifikasi(id);
    setNotifications(localStore.getSiswaNotifikasi(parent.nisn));
  };

  const handleMarkAllAsRead = () => {
    localStore.markAllNotifikasiRead(parent.nisn);
    setNotifications(localStore.getSiswaNotifikasi(parent.nisn));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    localStore.addPesanBk(
      parent.nisn,
      parent.name || 'Wali Murid',
      studentPoints.name || 'Lucas Adiputra',
      studentPoints.kelas || 'XII MIPA 2',
      newMessage
    );

    setSentMessages(localStore.getPesanBk().filter(m => m.nisn === parent.nisn));
    setNewMessage('');
    addToast('Pesan Anda berhasil dikirim ke Guru BK dan akan segera dibalas.', 'success');
  };

  const unreadCount = notifications.filter(n => !n.dibaca).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ====== Top Header Bar ====== */}
      <header className="bg-[#0B1528] text-white py-4 px-6 sm:sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg flex items-center justify-center text-white shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-wide uppercase">
                SMAN 12 Kota Tangerang Selatan
              </h1>
              <p className="text-[10px] text-primary tracking-widest uppercase font-semibold">
                Sistem Poin Karakter Siswa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{parent.name}</p>
              <p className="text-[10px] text-slate-400">
                Wali Murid | Siswa: {studentPoints.name} | NISN: {parent.nisn}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 text-xs font-semibold rounded-lg border border-red-500/20 transition-all duration-200"
            >
              Keluar
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M19.5 12H9m10.5 0l-3-3m3 3l-3 3" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ====== Main Content Dashboard ====== */}
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shrink-0 relative ${
            studentPoints.poin_pelanggaran > 0 ? 'border-red-500/30 bg-red-50/50' : 'border-emerald-500/30 bg-emerald-50/50'
          }`}>
            <span className={`text-3xl font-extrabold leading-none ${studentPoints.poin_pelanggaran > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {studentPoints.poin_pelanggaran || 0}
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1 text-center px-2">Poin Pelanggaran</span>
            <div className={`absolute -bottom-1 px-2.5 py-0.5 text-white rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm ${
              studentPoints.poin_pelanggaran > 0 ? 'bg-red-500' : 'bg-emerald-500'
            }`}>
              {studentPoints.poin_pelanggaran > 0 ? 'Dalam Evaluasi' : 'Aman'}
            </div>
          </div>
          <div className="text-center md:text-left min-w-0 flex-1 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 mb-1.5">
                Selamat Datang, Bapak/Ibu Wali Murid!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
                Anda masuk sebagai <strong className="text-slate-800">Orang Tua/Wali</strong> dari <strong className="text-slate-800">{studentPoints.name}</strong>. Akumulasi poin pelanggaran anak Anda saat ini adalah <strong className="text-slate-800">{studentPoints.poin_pelanggaran || 0} dari maksimal 100 poin</strong>. Status kesiswaan berkala siswa adalah <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                  studentPoints.poin_pelanggaran > 0 ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'
                }`}>{studentPoints.status || 'Bebas Pelanggaran'}</span>. Pantau terus kedisiplinan dan penghargaan anak Anda.
              </p>
            </div>
            <button
              onClick={handlePrintReport}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak Laporan Poin
            </button>
          </div>
        </div>

        {/* ====== Warning Stage Banner (Only if violationPoints > 0) ====== */}
        {violationPoints > 0 && (
          <div className="sticky top-0 sm:top-[72px] z-30 bg-red-50/95 backdrop-blur-md border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-4 shadow-md animate-fadeIn">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div className="space-y-1.5 flex-1 min-w-0 font-medium">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-extrabold text-red-900 uppercase tracking-wide">
                  Pemberitahuan Tahap Pembinaan: {langkahPembinaan.tahap}
                </h4>
                <span className="px-2.5 py-0.5 bg-red-200 text-red-800 text-[9px] font-extrabold rounded-md uppercase tracking-wider">
                  Akumulasi Pelanggaran: {violationPoints} Poin
                </span>
              </div>
              <p className="text-xs text-red-700 leading-relaxed font-semibold">
                Berdasarkan akumulasi pelanggaran tata tertib sekolah, anak Anda saat ini berada dalam pembinaan oleh: <strong className="text-red-900">{langkahPembinaan.pembina}</strong>.
              </p>
              <div className="bg-white/80 border border-red-100/50 rounded-xl p-3 mt-2">
                <p className="text-[10px] font-bold text-red-800 uppercase tracking-wider mb-1.5">Tindakan Pembinaan:</p>
                <p className="text-xs text-red-700 whitespace-pre-line leading-relaxed">
                  {langkahPembinaan.tindakan}
                </p>
              </div>
            </div>
          </div>
        )}



        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              studentPoints.poin_pelanggaran > 0 ? 'bg-red-500/10 text-red-600' : 'bg-slate-500/10 text-slate-600'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Poin Pelanggaran</p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{studentPoints.poin_pelanggaran || 0} Poin</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Poin Penghargaan</p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{studentPoints.poin_penghargaan || 0} Poin</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              studentPoints.poin_pelanggaran > 0 ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Status Kesiswaan</p>
              <h3 className="text-sm font-extrabold text-slate-950 mt-1">{studentPoints.status || 'Bebas Pelanggaran'}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* ====== Riwayat Poin ====== */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">
                  Riwayat Aktivitas Poin Anak
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-full uppercase">
                  Real-Time
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold tracking-wider uppercase">
                      <th className="py-4 px-6">Tanggal</th>
                      <th className="py-4 px-6">Kategori</th>
                      <th className="py-4 px-6">Keterangan Aktivitas</th>
                      <th className="py-4 px-6 text-right">Poin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pointActivities.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">
                          {act.tanggal}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-2.5 py-0.5 rounded font-bold uppercase text-[9px] ${
                            act.kategori === 'Penghargaan' ? 'bg-emerald-50 text-emerald-600' :
                            act.kategori === 'Pelanggaran Ringan' ? 'bg-yellow-50 text-yellow-600' :
                            act.kategori === 'Pelanggaran Sedang' ? 'bg-orange-50 text-orange-600' :
                            'bg-red-50 text-red-600'
                          }`}>
                            {act.kategori}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-700 font-medium max-w-xs md:max-w-md truncate">
                          {act.keterangan}
                        </td>
                        <td className={`py-4 px-6 text-right font-extrabold font-mono text-sm ${
                          act.type === 'positive' ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {act.poin}
                        </td>
                      </tr>
                    ))}
                    {pointActivities.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-slate-400">
                          Tidak ada riwayat aktivitas poin.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ====== Hubungi Guru BK & Riwayat Pesan ====== */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase mb-1">
                  Konsultasi dengan Guru BK / Wali Kelas
                </h3>
                <p className="text-xs text-slate-500">
                  Kirimkan pertanyaan atau permohonan penjelasan terkait perkembangan karakter anak Anda. Guru BK akan membalas secara langsung.
                </p>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pesan Baru</label>
                  <textarea
                    rows="3"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tulis pesan Anda di sini (contoh: Mohon konfirmasi mengenai rincian keterlambatan Lucas...)"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-300 resize-none"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0B1528] hover:bg-[#12233f] text-white text-xs font-bold uppercase rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2"
                  >
                    Kirim Pesan
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
              </form>

              {sentMessages.length > 0 && (
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Riwayat Konsultasi</h4>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {sentMessages.map((msg) => (
                      <div key={msg.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-bold">{msg.tanggal}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            msg.dibalas ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                          }`}>
                            {msg.dibalas ? 'Dibalas' : 'Menunggu Balasan'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-700">
                          <p className="font-bold text-slate-900 mb-1">Anda:</p>
                          <p className="leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">{msg.pesan}</p>
                        </div>
                        {msg.dibalas && (
                          <div className="text-xs text-slate-700 pl-4 border-l-2 border-primary/50 space-y-1">
                            <p className="font-bold text-primary">Balasan Guru BK (Ana Mukarromah, S.Si., M.Pd):</p>
                            <p className="leading-relaxed bg-primary/5 p-2.5 rounded-lg border border-primary/10 italic text-slate-800">"{msg.balasan}"</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* ====== NOTIFIKASI WIDGET ====== */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">
                    Notifikasi Orang Tua
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-[9px] font-extrabold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] text-primary font-bold hover:underline"
                  >
                    Tandai Semua Dibaca
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {notifications.map((notif) => {
                  let alertColor = 'bg-blue-50 border-blue-200 text-blue-800';
                  if (notif.tipe === 'warning') alertColor = 'bg-red-50/70 border-red-100 text-red-800';
                  if (notif.tipe === 'success') alertColor = 'bg-green-50/70 border-green-100 text-green-800';

                  return (
                    <div
                      key={notif.id}
                      className={`border rounded-xl p-3.5 relative transition-all duration-200 flex flex-col gap-1.5 ${alertColor} ${
                        notif.dibaca ? 'opacity-55' : 'opacity-100 font-medium'
                      }`}
                    >
                      <p className="text-xs leading-normal pr-5">{notif.pesan}</p>
                      <div className="flex items-center justify-between mt-1 border-t border-black/5 pt-2">
                        <span className="text-[9px] text-slate-400 font-semibold">{notif.waktu}</span>
                        <div className="flex items-center gap-2.5">
                          {!notif.dibaca && (
                            <button
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="text-[9px] text-primary hover:text-primary-dark font-extrabold uppercase"
                            >
                              Baca
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notif.id)}
                            className="text-[9px] text-slate-400 hover:text-red-600 font-bold"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {notifications.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    <svg className="w-8 h-8 mx-auto text-slate-200 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.041 9.041 0 01-9.717-.373 9.04 9.04 0 01-3.69-6.398 9.04 9.04 0 0110.963-9.529 9.041 9.041 0 018.775 6.333M21 21l-4.35-4.35M19 10.5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z" />
                    </svg>
                    Tidak ada notifikasi baru
                  </div>
                )}
              </div>
            </div>

            {/* ====== AKSI WALI MURID WIDGET ====== */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase border-b border-slate-100 pb-3">
                Aksi Wali Murid
              </h3>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={confirmedReview ? null : () => setIsConfirmModalOpen(true)}
                  disabled={confirmedReview}
                  className={`w-full text-center py-2.5 px-4 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
                    confirmedReview
                      ? 'bg-green-600/10 text-green-600 border border-green-200 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-dark text-white active:scale-95'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {confirmedReview ? 'Poin Sudah Dikonfirmasi' : 'Konfirmasi Tinjau Poin'}
                </button>

                <button
                  onClick={() => setShowBkContact(!showBkContact)}
                  className="w-full text-center py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-200/60 active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.011 19.5H7.002a2.003 2.003 0 01-2-2V7.005a2.003 2.003 0 012-2h10.009a2.003 2.003 0 012 2v10.495a2.003 2.003 0 01-2 2zm-10-14v14m10-14v14" />
                  </svg>
                  Kontak Darurat BK
                </button>
              </div>

              {showBkContact && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs space-y-3 animate-slideDown">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0 font-bold">
                      A
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Ana Mukarromah, S.Si., M.Pd</p>
                      <p className="text-[10px] text-slate-400">Wakasek Kesiswaan</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 border-t border-slate-200/60 pt-2.5 text-slate-600">
                    <p><strong>WhatsApp:</strong> <span className="text-primary font-bold">+62 812-3456-7890</span></p>
                    <p><strong>Email:</strong> ana.mukarromah@sman12tangsel.sch.id</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ====== Buku Saku Tata Tertib & Langkah Pembinaan SMAN 12 ====== */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">
              Buku Saku Tata Tertib & Panduan Pembinaan
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Panduan resmi skor pelanggaran dan tahapan panggilan pembinaan bagi peserta didik SMAN 12 Tangerang Selatan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Langkah Pembinaan */}
            <div className="lg:col-span-1 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">
                5 Tahapan Pembinaan
              </h4>
              <div className="space-y-3 font-medium">
                {[
                  { range: "0 - 20 Poin", name: "Panggilan I", pembina: "Guru, Wali Kelas", desc: "Teguran langsung oleh guru, pencatatan di Kartu Siswa oleh piket." },
                  { range: "25 - 40 Poin", name: "Panggilan II", pembina: "Wali Kelas, BK", desc: "Pembinaan Wali Kelas & BK, Panggilan Orang Tua secara lisan, Surat Peringatan 1." },
                  { range: "45 - 60 Poin", name: "Panggilan III", pembina: "BK, Wali Kelas", desc: "Pembinaan BK & Wali Kelas, Home Visit, Surat Pernyataan bermaterai, Surat Peringatan 2." },
                  { range: "65 - 95 Poin", name: "Panggilan IV", pembina: "BK, Wakasek Kesiswaan", desc: "Panggilan Resmi Orang Tua tertulis, Surat Pernyataan bermaterai, Surat Peringatan 3." },
                  { range: "100 Poin", name: "Panggilan Terakhir", pembina: "Kepala Sekolah & Tim BK", desc: "Panggilan Resmi Orang Tua, Gelar perkara, Dikembalikan ke Orang Tua (Dikeluarkan)." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] bg-[#0B1528] text-primary px-2 py-0.5 rounded font-extrabold">{item.range}</span>
                      <span className="text-xs font-extrabold text-slate-800">{item.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold">Pembina: <strong>{item.pembina}</strong></p>
                    <p className="text-[11px] text-slate-600 leading-normal mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Daftar Aturan Tata Tertib (Searchable Table) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h4 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">
                  Daftar Poin Pelanggaran & Penghargaan
                </h4>
                <input
                  type="text"
                  placeholder="Cari Aturan / Pelanggaran..."
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-300 w-full sm:w-56"
                  onChange={(e) => {
                    const query = e.target.value.toLowerCase();
                    const rows = document.querySelectorAll(".rule-row");
                    rows.forEach(row => {
                      const text = row.textContent.toLowerCase();
                      row.style.display = text.includes(query) ? "" : "none";
                    });
                  }}
                />
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden max-h-[480px] overflow-y-auto pr-1">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-4">Kode</th>
                      <th className="py-2.5 px-4">Nama Pelanggaran / Prestasi</th>
                      <th className="py-2.5 px-4">Kategori</th>
                      <th className="py-2.5 px-4 text-right">Poin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {pointRules.map((rule) => (
                      <tr key={rule.id} className="rule-row hover:bg-slate-50/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{rule.kode}</td>
                        <td className="py-3 px-4 leading-normal">{rule.nama}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded font-extrabold text-[8px] uppercase tracking-wide ${
                            rule.kategori === 'Penghargaan' ? 'bg-emerald-50 text-emerald-600' :
                            rule.kategori === 'Pelanggaran Ringan' ? 'bg-yellow-50 text-yellow-600' :
                            rule.kategori === 'Pelanggaran Sedang' ? 'bg-orange-50 text-orange-600' :
                            'bg-red-50 text-red-600'
                          }`}>
                            {rule.kategori}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-right font-mono font-extrabold text-sm ${
                          rule.tipe === 'positive' ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {rule.tipe === 'positive' ? `+${rule.poin}` : `-${rule.poin}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ====== Confirm Modal ====== */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          setConfirmedReview(true);
          addToast(`Terima kasih, konfirmasi peninjauan poin Anda telah tercatat dan dikirim ke Guru BK kelas ${studentPoints.kelas}.`, 'success');
        }}
        title="Konfirmasi Peninjauan Poin"
        message={`Apakah Anda yakin ingin mengirim konfirmasi peninjauan status ${studentPoints.status} dengan ${studentPoints.poin_pelanggaran} poin pelanggaran milik ${studentPoints.name} ke Guru BK?`}
        confirmText="Konfirmasi"
        cancelText="Batal"
        type="info"
      />

      {/* ====== Floating Toasts ====== */}
      <div className="fixed top-6 right-6 z-55 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#0B1528] text-white border border-slate-700/50 rounded-xl shadow-2xl p-4 flex items-start gap-3 animate-slideInRight max-w-sm"
          >
            <div className="bg-[#F5921B]/10 text-[#F5921B] p-1.5 rounded-lg shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 text-xs">
              <p className="font-extrabold tracking-wide uppercase text-slate-200">Notifikasi</p>
              <p className="text-slate-400 mt-1 leading-relaxed font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-slate-500 hover:text-white transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrangTuaDashboardPage;
