import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { localStore } from '@services/localStore';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    berita: 0,
    pengumuman: 0,
    galeri: 0,
    dokumen: 0,
    prestasi: 0
  });
  const [recentBerita, setRecentBerita] = useState([]);
  const [recentDokumen, setRecentDokumen] = useState([]);
  const [schoolProfile, setSchoolProfile] = useState(null);

  useEffect(() => {
    // Load lists
    const beritaList = localStore.getBerita() || [];
    const pengumumanList = localStore.getPengumuman() || [];
    const galeriList = localStore.getGaleri() || [];
    const dokumenList = localStore.getDokumen() || [];
    const prestasiList = localStore.getPrestasiSiswa() || [];
    const profile = localStore.getPengaturan();

    setStats({
      berita: beritaList.filter(b => b.kategori === 'berita').length,
      pengumuman: pengumumanList.length,
      galeri: galeriList.length,
      dokumen: dokumenList.length,
      prestasi: prestasiList.length
    });

    // Take top 4 recent news
    setRecentBerita(beritaList.slice(0, 4));

    // Take top 4 recent documents
    setRecentDokumen(dokumenList.slice(0, 4));

    if (profile) {
      setSchoolProfile(profile);
    }
  }, []);

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const getTipeBadge = (tipe) => {
    switch (tipe) {
      case 'surat': return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'pengumuman': return 'bg-purple-50 text-purple-700 border border-purple-100';
      case 'formulir': return 'bg-amber-50 text-amber-700 border border-amber-100';
      default: return 'bg-slate-50 text-slate-700 border border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* ====== Page Header ====== */}
      <div>
        <h1 className="text-2xl font-bold text-dark-800">Dashboard Portal Admin</h1>
        <p className="text-xs text-dark-400 mt-1">Selamat datang kembali! Pantau dan atur konten informasi website SMAN 12</p>
      </div>

      {/* ====== Stats Cards Grid ====== */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Berita */}
        <div className="bg-white rounded-2xl p-5 border border-dark-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-wider">Artikel Berita</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-primary flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-dark-800 leading-tight">{stats.berita}</p>
            <Link to="/admin/data-berita" className="text-[10px] font-bold text-primary hover:underline mt-1 block">Lihat Berita &rarr;</Link>
          </div>
        </div>

        {/* Card 2: Pengumuman */}
        <div className="bg-white rounded-2xl p-5 border border-dark-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-wider">Pengumuman</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-dark-800 leading-tight">{stats.pengumuman}</p>
            <Link to="/admin/data-berita" className="text-[10px] font-bold text-purple-600 hover:underline mt-1 block">Kelola Pengumuman &rarr;</Link>
          </div>
        </div>

        {/* Card 3: Galeri */}
        <div className="bg-white rounded-2xl p-5 border border-dark-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-wider">Galeri Foto</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-dark-800 leading-tight">{stats.galeri}</p>
            <Link to="/admin/galeri" className="text-[10px] font-bold text-blue-600 hover:underline mt-1 block">Buka Galeri &rarr;</Link>
          </div>
        </div>

        {/* Card 4: Dokumen */}
        <div className="bg-white rounded-2xl p-5 border border-dark-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-wider">Unduhan Dokumen</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-dark-800 leading-tight">{stats.dokumen}</p>
            <Link to="/admin/dokumen" className="text-[10px] font-bold text-amber-600 hover:underline mt-1 block">Atur Dokumen &rarr;</Link>
          </div>
        </div>

        {/* Card 5: Prestasi */}
        <div className="bg-white rounded-2xl p-5 border border-dark-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-wider">Prestasi Siswa</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-dark-800 leading-tight">{stats.prestasi}</p>
            <Link to="/admin/prestasi" className="text-[10px] font-bold text-cyan-600 hover:underline mt-1 block">Manajemen Prestasi &rarr;</Link>
          </div>
        </div>
      </div>

      {/* ====== Quick Actions Grid ====== */}
      <div className="bg-white rounded-2xl p-5 border border-dark-100 shadow-sm">
        <h2 className="text-xs font-bold text-dark-800 uppercase tracking-wider mb-4">Akses Cepat (Quick Actions)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button onClick={() => navigate('/admin/tambah-konten')} className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-orange-50/40 rounded-xl border border-slate-100 hover:border-primary/25 text-left transition-all active:scale-[0.98]">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-primary flex items-center justify-center font-bold text-xs shrink-0">+</div>
            <div>
              <p className="text-xs font-bold text-dark-800">Tulis Berita Baru</p>
              <p className="text-[9px] text-dark-400">Post berita / kegiatan baru</p>
            </div>
          </button>

          <button onClick={() => navigate('/admin/prestasi')} className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-cyan-50/40 rounded-xl border border-slate-100 hover:border-cyan-500/25 text-left transition-all active:scale-[0.98]">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xs shrink-0">+</div>
            <div>
              <p className="text-xs font-bold text-dark-800">Input Prestasi Siswa</p>
              <p className="text-[9px] text-dark-400">Catat prestasi baru siswa</p>
            </div>
          </button>

          <button onClick={() => navigate('/admin/dokumen')} className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-amber-50/40 rounded-xl border border-slate-100 hover:border-amber-500/25 text-left transition-all active:scale-[0.98]">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">↑</div>
            <div>
              <p className="text-xs font-bold text-dark-800">Upload Berkas File</p>
              <p className="text-[9px] text-dark-400">Unggah formulir / keputusan</p>
            </div>
          </button>

          <button onClick={() => navigate('/admin/pengaturan')} className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 text-left transition-all active:scale-[0.98]">
            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">⚙️</div>
            <div>
              <p className="text-xs font-bold text-dark-800">Ubah Profil Sekolah</p>
              <p className="text-[9px] text-dark-400">Metadata & sambutan kepsek</p>
            </div>
          </button>
        </div>
      </div>

      {/* ====== Recent Content Split Panel ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent News list */}
        <div className="bg-white rounded-2xl p-5 border border-dark-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-dark-800 uppercase tracking-wider border-b border-dark-50 pb-2.5 mb-3.5">Artikel Berita Terbaru</h2>
            <div className="space-y-3">
              {recentBerita.length === 0 ? (
                <p className="text-xs text-dark-400 italic py-4">Belum ada berita yang diterbitkan.</p>
              ) : (
                recentBerita.map(b => (
                  <div key={b.id} className="flex items-center gap-3 p-2 bg-slate-50/50 rounded-xl border border-slate-100">
                    {b.thumbnail ? (
                      <img src={b.thumbnail} alt="" className="w-12 h-9 object-cover rounded border border-slate-100 shrink-0" />
                    ) : (
                      <div className="w-12 h-9 bg-slate-200 rounded shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-dark-800 truncate" title={b.judul}>{b.judul}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] px-1.5 py-0.5 bg-orange-100 text-primary font-bold rounded uppercase">{b.kategori}</span>
                        <span className="text-[9px] text-dark-400">{b.created_at}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <Link to="/admin/data-berita" className="text-xs text-primary font-bold hover:underline mt-4 block text-center border-t border-dark-50 pt-3.5">Lihat Semua Konten &rarr;</Link>
        </div>

        {/* Right Column: Recent Documents list */}
        <div className="bg-white rounded-2xl p-5 border border-dark-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-dark-800 uppercase tracking-wider border-b border-dark-50 pb-2.5 mb-3.5">Dokumen Sekolah Terbaru</h2>
            <div className="space-y-3">
              {recentDokumen.length === 0 ? (
                <p className="text-xs text-dark-400 italic py-4">Belum ada dokumen yang diupload.</p>
              ) : (
                recentDokumen.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between gap-3 p-2.5 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-dark-850 truncate">{doc.judul}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[8px] px-1.5 py-0.5 font-bold rounded capitalize border ${getTipeBadge(doc.tipe)}`}>
                          {doc.tipe}
                        </span>
                        <span className="text-[9px] text-dark-400 font-mono">{formatBytes(doc.ukuran_file)}</span>
                      </div>
                    </div>
                    <button onClick={() => window.open(doc.file_path, '_blank')} className="text-[10px] font-bold text-primary hover:underline uppercase shrink-0">Unduh</button>
                  </div>
                ))
              )}
            </div>
          </div>
          <Link to="/admin/dokumen" className="text-xs text-primary font-bold hover:underline mt-4 block text-center border-t border-dark-50 pt-3.5">Atur Semua Dokumen &rarr;</Link>
        </div>
      </div>

      {/* ====== School Profile Overview ====== */}
      {schoolProfile && (
        <div className="bg-white rounded-2xl p-5 border border-dark-100 shadow-sm">
          <h2 className="text-xs font-bold text-dark-800 uppercase tracking-wider border-b border-dark-50 pb-2.5 mb-4">Profil Instansi Aktif</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 col-span-2">
              {schoolProfile.fotoKepalaSekolah ? (
                <img src={schoolProfile.fotoKepalaSekolah} alt="Foto Kepsek" className="w-16 h-20 object-cover rounded-lg border border-slate-200 shadow-sm" />
              ) : (
                <div className="w-16 h-20 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0">No Photo</div>
              )}
              <div>
                <p className="text-sm font-bold text-dark-800">{schoolProfile.kepalaSekolah}</p>
                <p className="text-[10px] text-dark-400 font-medium">NIP. {schoolProfile.nipKepalaSekolah || '-'}</p>
                <p className="text-xs text-dark-600 mt-2 font-medium">Kepala Sekolah {schoolProfile.namaSekolah}</p>
                <p className="text-[10px] text-dark-400 leading-normal mt-0.5">{schoolProfile.alamat}</p>
              </div>
            </div>
            <div className="border-l border-dark-50 pl-6 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-dark-400">Email:</span>
                <span className="font-semibold text-dark-800">{schoolProfile.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Telepon:</span>
                <span className="font-semibold text-dark-800">{schoolProfile.telepon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Tagline:</span>
                <span className="font-bold text-primary text-right leading-tight max-w-[150px] truncate" title={schoolProfile.tagline}>"{schoolProfile.tagline}"</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
