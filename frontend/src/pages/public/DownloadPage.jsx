import { useState, useEffect } from 'react';
import { localStore } from '@services/localStore';

const categories = [
  { value: 'Semua', label: 'Semua Dokumen' },
  { value: 'surat', label: 'Surat Edaran' },
  { value: 'pengumuman', label: 'Pengumuman' },
  { value: 'formulir', label: 'Formulir' },
  { value: 'lainnya', label: 'Lainnya' }
];

const DownloadPage = () => {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');

  useEffect(() => {
    const docs = localStore.getDokumen();
    setDocuments(docs || []);
  }, []);

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleDownload = (doc) => {
    try {
      if (doc.file_path.startsWith('data:')) {
        // base64 download
        const link = document.createElement('a');
        link.href = doc.file_path;
        let ext = '.pdf';
        if (doc.file_path.includes('image/png')) ext = '.png';
        else if (doc.file_path.includes('image/jpeg')) ext = '.jpg';
        else if (doc.file_path.includes('application/vnd.openxmlformats-officedocument')) ext = '.docx';
        else if (doc.file_path.includes('application/msword')) ext = '.doc';
        
        link.download = doc.judul.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ext;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // real path
        window.open(doc.file_path, '_blank');
      }
    } catch (e) {
      console.error('Download error:', e);
      // Fallback
      alert('Mengunduh file... (File dummy dibuka)');
    }
  };

  const getFileIcon = (tipe) => {
    switch (tipe) {
      case 'surat':
        return (
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'pengumuman':
        return (
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
      case 'formulir':
        return (
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        );
    }
  };

  const filteredDocs = documents.filter((item) => {
    const matchesSearch = item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.deskripsi && item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'Semua') {
      return matchesSearch;
    }
    return matchesSearch && item.tipe === activeTab;
  });

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 md:py-14">
      <div className="container-main max-w-5xl">
        
        {/* ==========================================
            HEADER — Premium Hero Title & Description
            ========================================== */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
              Informasi Publik
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight">
            Pusat Unduhan Dokumen
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed mt-2.5">
            Akses dan unduh berkas resmi kurikulum, formulir kesiswaan, surat edaran, dan dokumen pengumuman resmi SMAN 12 Tangerang Selatan.
          </p>
        </div>

        {/* ==========================================
            SEARCH & FILTER CONTROLS
            ========================================== */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100/80 mb-8 space-y-5">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari judul berkas atau keterangan dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition"
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 border-t border-slate-50 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveTab(cat.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                  ${activeTab === cat.value
                    ? 'bg-gradient-to-r from-primary to-orange-500 text-white border-primary shadow-[0_2.5px_8px_rgba(245,146,27,0.25)]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary hover:bg-orange-50/10'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ==========================================
            DOCUMENTS LISTING
            ========================================== */}
        <div className="space-y-4">
          {filteredDocs.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 shadow-sm">
              <svg className="w-16 h-16 text-slate-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-base font-bold text-slate-700">Berkas Tidak Ditemukan</h3>
              <p className="text-xs text-slate-400 mt-1">Silakan coba cari dengan kata kunci lain atau pilih kategori yang berbeda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-4"
                >
                  {getFileIcon(doc.tipe)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono bg-slate-100 text-slate-500">
                        {doc.tipe === 'surat' ? 'Surat Edaran' : doc.tipe === 'formulir' ? 'Formulir' : doc.tipe === 'pengumuman' ? 'Pengumuman' : 'Lainnya'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{doc.created_at}</span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-800 leading-snug mt-1.5 hover:text-primary transition-colors cursor-pointer" onClick={() => handleDownload(doc)}>
                      {doc.judul}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                      {doc.deskripsi || 'Tidak ada keterangan tambahan.'}
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-50 mt-4 pt-3.5">
                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        Ukuran: {formatBytes(doc.ukuran_file)}
                      </span>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="inline-flex items-center gap-1 text-[11px] font-extrabold text-primary hover:text-primary-dark uppercase tracking-wider transition-colors"
                      >
                        <span>Unduh Berkas</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
