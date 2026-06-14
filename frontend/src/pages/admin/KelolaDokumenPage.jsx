import { useState, useEffect } from 'react';
import { localStore } from '@services/localStore';

const KelolaDokumenPage = () => {
  const [documents, setDocuments] = useState([]);
  const [formDoc, setFormDoc] = useState({
    judul: '',
    deskripsi: '',
    tipe: 'lainnya',
    file: null,
    fileName: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const docs = localStore.getDokumen();
    setDocuments(docs || []);
  };

  const handleInputChange = (e) => {
    setFormDoc({ ...formDoc, [e.target.name]: e.target.value });
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        setErrorMsg('Ukuran file maksimal adalah 1.5 MB (keterbatasan penyimpanan lokal).');
        return;
      }
      setErrorMsg('');
      try {
        const base64 = await fileToBase64(file);
        setFormDoc({
          ...formDoc,
          file: base64,
          fileName: file.name,
          ukuran_file: file.size
        });
      } catch (err) {
        console.error('Membaca file gagal:', err);
        setErrorMsg('Gagal membaca file.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formDoc.judul.trim()) {
      setErrorMsg('Judul dokumen wajib diisi!');
      return;
    }

    if (!editingId && !formDoc.file) {
      setErrorMsg('File dokumen wajib diunggah!');
      return;
    }

    const payload = {
      judul: formDoc.judul,
      deskripsi: formDoc.deskripsi,
      tipe: formDoc.tipe
    };

    if (formDoc.file) {
      payload.file_path = formDoc.file;
      payload.ukuran_file = formDoc.ukuran_file;
    }

    let updatedList = [...documents];
    if (editingId !== null) {
      payload.id = editingId;
      updatedList = updatedList.map((item) =>
        item.id === editingId
          ? { 
              ...item, 
              ...payload, 
              file_path: payload.file_path || item.file_path, 
              ukuran_file: payload.ukuran_file !== undefined ? payload.ukuran_file : item.ukuran_file 
            }
          : item
      );
      setEditingId(null);
      showToast('✔️ Dokumen berhasil diperbarui!');
    } else {
      const newId = updatedList.length > 0 ? Math.max(...updatedList.map(o => o.id)) + 1 : 1;
      updatedList.unshift({
        id: newId,
        ...payload,
        created_at: new Date().toISOString().split("T")[0]
      });
      showToast('✔️ Dokumen baru berhasil ditambahkan!');
    }

    try {
      localStore.saveDokumen(updatedList);
      setDocuments(updatedList);
      closeModal();
    } catch (err) {
      console.error('Simpan dokumen gagal:', err);
      setErrorMsg('Gagal menyimpan dokumen. Ukuran berkas terlalu besar untuk kapasitas penyimpanan lokal browser (maks total 5MB). Silakan gunakan file di bawah 1.5MB.');
    }
  };

  const handleEdit = (item) => {
    setFormDoc({
      judul: item.judul,
      deskripsi: item.deskripsi || '',
      tipe: item.tipe || 'lainnya',
      file: null,
      fileName: 'Berkas Tersimpan (unggah baru untuk mengganti)'
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      const updatedList = documents.filter((item) => item.id !== id);
      localStore.saveDokumen(updatedList);
      setDocuments(updatedList);
      showToast('✔️ Dokumen berhasil dihapus.');
      if (editingId === id) {
        closeModal();
      }
    }
  };

  const openUploadModal = () => {
    setEditingId(null);
    setFormDoc({
      judul: '',
      deskripsi: '',
      tipe: 'lainnya',
      file: null,
      fileName: ''
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setFormDoc({
      judul: '',
      deskripsi: '',
      tipe: 'lainnya',
      file: null,
      fileName: ''
    });
    setErrorMsg('');
  };

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

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
      case 'surat':
        return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'pengumuman':
        return 'bg-purple-50 text-purple-700 border border-purple-100';
      case 'formulir':
        return 'bg-amber-50 text-amber-700 border border-amber-100';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-100';
    }
  };

  const getTipeName = (tipe) => {
    switch (tipe) {
      case 'surat': return 'Surat Edaran';
      case 'pengumuman': return 'Pengumuman';
      case 'formulir': return 'Formulir';
      default: return 'Lainnya';
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

  const getStats = () => {
    let surat = 0, pengumuman = 0, formulir = 0, lainnya = 0;
    documents.forEach(item => {
      if (item.tipe === 'surat') surat++;
      else if (item.tipe === 'pengumuman') pengumuman++;
      else if (item.tipe === 'formulir') formulir++;
      else lainnya++;
    });
    return { surat, pengumuman, formulir, lainnya, total: documents.length };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* ====== Breadcrumb ====== */}
      <div className="flex items-center gap-2 text-xs text-dark-400">
        <span className="text-primary font-medium">Admin Panel</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-primary font-medium">Kelola Konten</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-bold text-dark-800">Manajemen Dokumen</span>
      </div>

      {/* ====== Page Header ====== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Manajemen Dokumen Web</h1>
          <p className="text-xs text-dark-400 mt-1">Unggah, ubah, dan susun berkas-berkas kurikulum, formulir, dan surat resmi sekolah</p>
        </div>
        <button
          onClick={openUploadModal}
          className="px-4 py-2.5 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-dark hover:to-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Upload Dokumen Baru
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all duration-300">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {successMsg}
        </div>
      )}

      {/* ====== Stats Grid ====== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-dark-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-primary flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-dark-400 uppercase tracking-wider">Total Dokumen</p>
            <p className="text-lg font-extrabold text-dark-800 mt-0.5">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-dark-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-dark-400 uppercase tracking-wider">Surat Edaran</p>
            <p className="text-lg font-extrabold text-dark-800 mt-0.5">{stats.surat}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-dark-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-dark-400 uppercase tracking-wider">Pengumuman</p>
            <p className="text-lg font-extrabold text-dark-800 mt-0.5">{stats.pengumuman}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-dark-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-dark-400 uppercase tracking-wider">Formulir</p>
            <p className="text-lg font-extrabold text-dark-800 mt-0.5">{stats.formulir}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-dark-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-dark-400 uppercase tracking-wider">Berkas Lainnya</p>
            <p className="text-lg font-extrabold text-dark-800 mt-0.5">{stats.lainnya}</p>
          </div>
        </div>
      </div>

      {/* ====== Main Content Table Area ====== */}
      <div className="bg-white rounded-2xl border border-dark-100 shadow-sm overflow-hidden">
        {/* Table Filters & Search */}
        <div className="p-5 border-b border-dark-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tab Categories */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            {['Semua', 'surat', 'pengumuman', 'formulir', 'lainnya'].map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  activeTab === type
                    ? 'bg-white text-dark-850 shadow-sm'
                    : 'text-dark-400 hover:text-dark-600'
                }`}
              >
                {type === 'Semua' ? 'Semua' : getTipeName(type)}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Cari judul atau keterangan berkas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Table data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-dark-100 text-[10px] font-bold text-dark-500 bg-slate-50 uppercase tracking-wider">
                <th className="py-3 px-6">Nama Dokumen</th>
                <th className="py-3 px-6">Tipe Berkas</th>
                <th className="py-3 px-6">Ukuran File</th>
                <th className="py-3 px-6">Tanggal Unggah</th>
                <th className="py-3 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-50">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-dark-400 italic">
                    Belum ada berkas dokumen yang diunggah.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-3 max-w-sm sm:max-w-md">
                        <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 font-mono font-extrabold text-[10px]">
                          PDF
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-dark-850 text-xs leading-snug">{item.judul}</p>
                          {item.deskripsi && (
                            <p className="text-[10px] text-dark-400 mt-1 line-clamp-1">{item.deskripsi}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold capitalize ${getTipeBadge(item.tipe)}`}>
                        {getTipeName(item.tipe)}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap font-mono text-dark-600 font-semibold">
                      {formatBytes(item.ukuran_file)}
                    </td>
                    <td className="py-4 px-6 text-dark-500 whitespace-nowrap">
                      {item.created_at}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded text-[10px] font-bold transition-all"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-[10px] font-bold transition-all"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== Modal Upload / Edit ====== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 transform transition-all duration-300">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-primary to-orange-500 text-white flex items-center justify-between">
              <h3 className="text-sm font-extrabold tracking-wide uppercase">
                {editingId !== null ? '✏️ Edit Dokumen' : '📁 Upload Dokumen Baru'}
              </h3>
              <button
                onClick={closeModal}
                className="w-6 h-6 text-white hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-dark-700 mb-1.5">Judul Dokumen <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="judul"
                  value={formDoc.judul}
                  onChange={handleInputChange}
                  placeholder="Contoh: Kalender Akademik 2026/2027"
                  required
                  className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-700 mb-1.5">Kategori / Tipe Dokumen</label>
                <select
                  name="tipe"
                  value={formDoc.tipe}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white font-medium"
                >
                  <option value="surat">Surat Edaran</option>
                  <option value="pengumuman">Pengumuman Resmi</option>
                  <option value="formulir">Formulir Cetak</option>
                  <option value="lainnya">Lainnya / Umum</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-700 mb-1.5">Deskripsi / Keterangan</label>
                <textarea
                  name="deskripsi"
                  value={formDoc.deskripsi}
                  onChange={handleInputChange}
                  placeholder="Berikan penjelasan singkat mengenai dokumen ini..."
                  rows={3}
                  className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-700 mb-1.5">Berkas File <span className="text-red-500">{editingId ? '' : '*'}</span></label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-primary rounded-xl cursor-pointer bg-slate-50/40 p-5 transition-all text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <svg className="w-8 h-8 text-slate-350 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-xs font-bold text-dark-700">Pilih Berkas</span>
                  <span className="text-[10px] text-dark-400 mt-1 max-w-[280px] truncate leading-normal">
                    {formDoc.fileName || 'Seret & lepas atau klik untuk memilih file'}
                  </span>
                </label>
                <p className="text-[9px] text-dark-300 mt-1">Ekstensi yang didukung: PDF, DOC, DOCX, JPG, PNG (Maks 1.5MB untuk penyimpanan lokal)</p>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-2 pt-4 border-t border-slate-100 mt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-dark hover:to-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                >
                  {editingId !== null ? 'Simpan Perubahan' : 'Upload Berkas'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-dark-700 text-xs font-bold rounded-xl transition-all active:scale-95"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaDokumenPage;
