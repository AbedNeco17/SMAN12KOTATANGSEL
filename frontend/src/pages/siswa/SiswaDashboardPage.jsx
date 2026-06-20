import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { localStore } from '@services/localStore';

const SiswaDashboardPage = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({ name: 'Siswa SMAN 12', nisn: '0012345678', kelas: 'XII MIPA 2', role: 'siswa' });
  const [studentPoints, setStudentPoints] = useState({ poin_pelanggaran: 0, poin_penghargaan: 0, status: 'Bebas Pelanggaran' });
  const [pointActivities, setPointActivities] = useState([]);
  const [violationPoints, setViolationPoints] = useState(0);
  const [langkahPembinaan, setLangkahPembinaan] = useState({ tahap: 'Bebas Pelanggaran', pembina: '-', tindakan: '' });
  const [pointRules, setPointRules] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('siswaToken') || sessionStorage.getItem('siswaToken');
    const savedProfile = localStorage.getItem('siswaProfile') || sessionStorage.getItem('siswaProfile');

    if (!token) {
      navigate('/kesiswaan/login/siswa');
    } else if (savedProfile) {
      const prof = JSON.parse(savedProfile);
      setStudent(prof);
      
      const sData = localStore.getSiswaByNisn(prof.nisn);
      if (sData) {
        setStudentPoints(sData);
      }
      
      const history = localStore.getRiwayatPoin(prof.nisn);
      setPointActivities(history);

      const netViolation = localStore.getNetViolationPoints(prof.nisn);
      setViolationPoints(netViolation);
      setLangkahPembinaan(localStore.getLangkahPembinaan(netViolation));
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
            <td style="width: 35%;">: ${student.name}</td>
            <td style="width: 15%; font-weight: bold;">Tahun Ajaran</td>
            <td style="width: 35%;">: 2025/2026</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">NISN</td>
            <td>: ${student.nisn}</td>
            <td style="font-weight: bold;">Kelas</td>
            <td>: ${student.kelas}</td>
          </tr>
        </table>

        <div class="summary-container">
          <div class="summary-card">
            <div style="font-size: 9px; text-transform: uppercase; color: #000000; font-weight: bold;">Sisa Poin Karakter</div>
            <div class="summary-val" style="color: #000000;">${Math.max(0, Math.min(100, 100 - vPoints + aPoints))} / 100</div>
          </div>
          <div class="summary-card">
            <div style="font-size: 9px; text-transform: uppercase; color: #000000; font-weight: bold;">Poin Pelanggaran</div>
            <div class="summary-val" style="color: #000000;">${vPoints} Pts</div>
          </div>
          <div class="summary-card">
            <div style="font-size: 9px; text-transform: uppercase; color: #000000; font-weight: bold;">Poin Penghargaan</div>
            <div class="summary-val" style="color: #000000;">+${aPoints} Pts</div>
          </div>
          <div class="summary-card">
            <div style="font-size: 9px; text-transform: uppercase; color: #000000; font-weight: bold;">Status Kesiswaan</div>
            <div class="summary-val" style="color: #000000; font-size: 11px; text-transform: uppercase; margin-top: 10px;">${currentStatus}</div>
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
            <div style="font-weight: bold; text-decoration: underline;">${student.name}</div>
            <div>NISN: ${student.nisn}</div>
          </div>
          <div class="signature-col">
            <div>Orang Tua / Wali,</div>
            <div class="signature-space"></div>
            <div style="font-weight: bold; text-decoration: underline; height: 18px;"></div>
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

  const sisaPoin = Math.max(0, Math.min(100, 100 - (studentPoints.poin_pelanggaran || 0) + (studentPoints.poin_penghargaan || 0)));

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
              <p className="text-xs font-bold text-white">{student.name}</p>
              <p className="text-[10px] text-slate-400">
                Siswa | NISN: {student.nisn} | {student.kelas}
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
            sisaPoin === 100 ? 'border-emerald-500/30 bg-emerald-50/50' :
            sisaPoin >= 80 ? 'border-blue-500/30 bg-blue-50/50' :
            sisaPoin >= 60 ? 'border-yellow-500/30 bg-yellow-50/50' :
            sisaPoin >= 40 ? 'border-orange-500/30 bg-orange-50/50' :
            sisaPoin >= 5 ? 'border-red-500/30 bg-red-50/50' : 'border-rose-950/30 bg-rose-950/10'
          }`}>
            <span className={`text-3xl font-extrabold leading-none ${
              sisaPoin === 100 ? 'text-emerald-600' :
              sisaPoin >= 80 ? 'text-blue-600' :
              sisaPoin >= 60 ? 'text-yellow-600' :
              sisaPoin >= 40 ? 'text-orange-600' :
              sisaPoin >= 5 ? 'text-red-600' : 'text-rose-950'
            }`}>
              {sisaPoin}
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1 text-center px-2">Poin Karakter</span>
            <div className={`absolute -bottom-1 px-2.5 py-0.5 text-white rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm whitespace-nowrap ${
              sisaPoin === 100 ? 'bg-emerald-500' :
              sisaPoin >= 80 ? 'bg-blue-500' :
              sisaPoin >= 60 ? 'bg-yellow-500' :
              sisaPoin >= 40 ? 'bg-orange-500' :
              sisaPoin >= 5 ? 'bg-red-500' : 'bg-rose-950'
            }`}>
              {sisaPoin === 100 ? 'Aman' : studentPoints.status || 'Evaluasi'}
            </div>
          </div>
          <div className="text-center md:text-left min-w-0 flex-1 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 mb-1.5">
                Halo, {student.name}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
                Sisa Poin Karakter Anda saat ini adalah <strong className="text-slate-800">{sisaPoin} dari 100 poin</strong> (Akumulasi Pelanggaran: {studentPoints.poin_pelanggaran || 0} Pts, Penghargaan: +{studentPoints.poin_penghargaan || 0} Pts). Status kesiswaan Anda saat ini adalah <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                  sisaPoin === 100 ? 'bg-emerald-500/10 text-emerald-600' :
                  sisaPoin >= 80 ? 'bg-blue-500/10 text-blue-600' :
                  sisaPoin >= 60 ? 'bg-yellow-500/10 text-yellow-600' :
                  sisaPoin >= 40 ? 'bg-orange-500/10 text-orange-600' :
                  sisaPoin >= 5 ? 'bg-red-500/10 text-red-600' : 'bg-rose-950/10 text-rose-950'
                }`}>{studentPoints.status || 'Bebas Pelanggaran'}</span>. Hindari pelanggaran dan kumpulkan penghargaan untuk menambah poin kembali!
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
                Berdasarkan akumulasi pelanggaran tata tertib sekolah, Anda saat ini berada dalam pembinaan oleh: <strong className="text-red-900">{langkahPembinaan.pembina}</strong>.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              sisaPoin === 100 ? 'bg-emerald-500/10 text-emerald-600' :
              sisaPoin >= 80 ? 'bg-blue-500/10 text-blue-600' :
              sisaPoin >= 60 ? 'bg-yellow-500/10 text-yellow-600' :
              sisaPoin >= 40 ? 'bg-orange-500/10 text-orange-600' : 'bg-red-500/10 text-red-600'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Poin Karakter (Sisa)</p>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">{sisaPoin} Poin</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              studentPoints.poin_pelanggaran > 0 ? 'bg-red-500/10 text-red-600' : 'bg-slate-500/10 text-slate-600'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Poin Pelanggaran</p>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">{studentPoints.poin_pelanggaran || 0} Pts</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Poin Penghargaan</p>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">+{studentPoints.poin_penghargaan || 0} Pts</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              sisaPoin === 100 ? 'bg-emerald-500/10 text-emerald-600' :
              sisaPoin >= 80 ? 'bg-blue-500/10 text-blue-600' :
              sisaPoin >= 60 ? 'bg-yellow-500/10 text-yellow-600' :
              sisaPoin >= 40 ? 'bg-orange-500/10 text-orange-600' : 'bg-red-500/10 text-red-600'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Status Kesiswaan</p>
              <h3 className="text-xs font-extrabold text-slate-955 mt-1.5 truncate">{studentPoints.status || 'Bebas Pelanggaran'}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">
                  Riwayat Aktivitas Poin
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
          </div>

          <div className="space-y-6">
            {/* ====== SISWA / STUDENT WIDGETS ====== */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase border-b border-slate-100 pb-3">
                Sisa Poin Karakter
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Poin Saat Ini</span>
                    <span className="font-bold text-slate-800">{sisaPoin} / 100 Poin</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${
                      sisaPoin >= 80 ? 'bg-emerald-500' :
                      sisaPoin >= 60 ? 'bg-yellow-500' :
                      sisaPoin >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`} style={{ width: `${sisaPoin}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                    {sisaPoin <= 0 ? (
                      <span className="text-red-600 font-bold">Batas toleransi poin telah habis (0 Poin). Harap segera melapor ke BK.</span>
                    ) : (
                      <>
                        Anda menyisakan <strong className="text-slate-700">{sisaPoin} Poin</strong> karakter sebelum tindakan Panggilan Terakhir dilakukan.
                      </>
                    )}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <p className="font-bold text-slate-700 mb-1.5">Checklist Evaluasi:</p>
                  <ul className="space-y-1.5 text-slate-500 text-[11px]">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500 font-extrabold">✓</span> Hadir Tepat Waktu (Disiplin)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500 font-extrabold">✓</span> Aktif Kegiatan Ekskul (Prestasi)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-300 font-extrabold">○</span> Bebas Pelanggaran 30 Hari Ke Depan
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0B1528] to-[#12233f] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <span className="px-2 py-0.5 bg-primary/20 border border-primary/30 text-primary text-[9px] font-extrabold tracking-wider rounded uppercase block w-max mb-3">
                Tips Karakter
              </span>
              <h4 className="text-xs font-bold mb-1.5 text-primary">Kembangkan Disiplin Diri</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                "Kedisiplinan bukanlah pembatasan kebebasan, melainkan latihan konsistensi untuk membentuk integritas masa depan Anda."
              </p>
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
                  { range: "80 - 99 Poin", name: "Panggilan I", pembina: "Guru, Wali Kelas", desc: "Teguran langsung oleh guru, pencatatan di Kartu Siswa oleh piket." },
                  { range: "60 - 79 Poin", name: "Panggilan II", pembina: "Wali Kelas, BK", desc: "Pembinaan Wali Kelas & BK, Panggilan Orang Tua secara lisan, Surat Peringatan 1." },
                  { range: "40 - 59 Poin", name: "Panggilan III", pembina: "BK, Wali Kelas", desc: "Pembinaan BK & Wali Kelas, Home Visit, Surat Pernyataan bermaterai, Surat Peringatan 2." },
                  { range: "5 - 39 Poin", name: "Panggilan IV", pembina: "BK, Wakasek Kesiswaan", desc: "Panggilan Resmi Orang Tua tertulis, Surat Pernyataan bermaterai, Surat Peringatan 3." },
                  { range: "< 5 Poin", name: "Panggilan Terakhir", pembina: "Kepala Sekolah & Tim BK", desc: "Panggilan Resmi Orang Tua, Gelar perkara, Dikembalikan ke Orang Tua (Dikeluarkan)." }
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
    </div>
  );
};

export default SiswaDashboardPage;
