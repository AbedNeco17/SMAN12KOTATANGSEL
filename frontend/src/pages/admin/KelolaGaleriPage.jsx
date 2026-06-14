import { useState, useEffect } from 'react';
import { localStore } from '@services/localStore';
import ConfirmModal from '@components/ui/ConfirmModal';

const KelolaGaleriPage = () => {
  const [galeriList, setGaleriList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Akademik');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setGaleriList(localStore.getGaleri());
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      try {
        const base64 = await fileToBase64(file);
        setImagePreview(base64);
      } catch (err) {
        console.error('File preview conversion failed', err);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');

    if (!judul.trim()) {
      setError('Judul foto harus diisi.');
      return;
    }
    if (!imagePreview) {
      setError('Pilih file gambar untuk diunggah.');
      return;
    }

    try {
      const payload = {
        judul,
        kategori,
        gambar: imagePreview
      };

      localStore.saveGaleri(payload);
      loadData();
      
      // Reset form & close modal
      setJudul('');
      setKategori('Akademik');
      setImageFile(null);
      setImagePreview(null);
      setIsModalOpen(false);
    } catch (err) {
      setError('Terjadi kesalahan saat memproses gambar.');
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  return (
    <div>
      {/* ====== Page Header ====== */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Kelola Galeri</h1>
          <p className="text-xs text-dark-400 mt-1">Kelola album foto kegiatan, fasilitas, dan prestasi SMAN 12</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#F5921B] hover:bg-[#E8850F] text-white text-xs font-bold rounded-lg transition-all shadow-sm"
        >
          + Upload Foto
        </button>
      </div>

      {/* ====== Gallery Grid ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Upload Trigger Card */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="aspect-[4/3] bg-white rounded-xl border-2 border-dashed border-dark-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#F5921B] hover:bg-orange-50/10 transition-all shadow-sm"
        >
          <svg className="w-8 h-8 text-dark-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-dark-600 text-xs font-bold">Upload Foto Baru</span>
        </div>

        {/* Dynamic Image Cards */}
        {galeriList.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-dark-100 shadow-sm overflow-hidden group relative flex flex-col justify-between">
            <div className="aspect-[4/3] w-full bg-dark-50 overflow-hidden relative">
              <img 
                src={item.gambar} 
                alt={item.judul} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-dark-800/80 backdrop-blur-sm text-white text-[9px] font-extrabold uppercase rounded tracking-wider">
                {item.kategori}
              </span>
              <button 
                onClick={() => handleDelete(item.id)}
                className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 hover:bg-red-600 text-dark-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
                title="Hapus Foto"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div className="p-3 border-t border-dark-50 bg-white">
              <h3 className="text-xs font-bold text-dark-800 line-clamp-1" title={item.judul}>{item.judul}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ====== Upload Modal ====== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1528]/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-scaleIn">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-sm text-dark-800">Upload Foto Galeri</h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setError('');
                }}
                className="p-1 text-dark-400 hover:text-dark-800 rounded-lg hover:bg-dark-50 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-5 space-y-4">
              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-dark-700 mb-1.5">Judul Foto</label>
                <input 
                  type="text"
                  placeholder="Masukkan judul kegiatan/foto..."
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F5921B] focus:border-[#F5921B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-700 mb-1.5">Kategori</label>
                <select 
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F5921B] focus:border-[#F5921B]"
                >
                  <option value="Akademik">Akademik</option>
                  <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                  <option value="Fasilitas">Fasilitas</option>
                  <option value="Prestasi">Prestasi</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-700 mb-1.5">File Gambar</label>
                <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50 cursor-pointer hover:border-[#F5921B] transition-colors relative h-40">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg" 
                    />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-dark-300 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-dark-500 font-medium">Klik atau drop file gambar di sini</span>
                      <span className="text-[10px] text-dark-300 mt-1">Mendukung JPG, PNG, WEBP</span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-dark-50 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError('');
                  }}
                  className="px-4 py-2 border border-gray-200 text-dark-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F5921B] hover:bg-[#E8850F] text-white text-xs font-bold rounded-lg transition"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ====== Delete Confirmation Modal ====== */}
      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            localStore.deleteGaleri(deleteId);
            loadData();
          }
        }}
        title="Hapus Foto Galeri"
        message="Apakah Anda yakin ingin menghapus foto ini dari galeri sekolah? Tindakan ini permanen."
        confirmText="Hapus"
      />
    </div>
  );
};

export default KelolaGaleriPage;
