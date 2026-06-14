import { useState, useEffect } from 'react';
import { localStore } from '@services/localStore';

const PengaturanPage = () => {
  const [config, setConfig] = useState({
    namaSekolah: '',
    tagline: '',
    alamat: '',
    telepon: '',
    email: '',
    kepalaSekolah: '',
    nipKepalaSekolah: '',
    fotoKepalaSekolah: '',
    sambutanRaw: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    const data = localStore.getPengaturan();
    if (data) {
      setConfig({
        namaSekolah: data.namaSekolah || '',
        tagline: data.tagline || '',
        alamat: data.alamat || '',
        telepon: data.telepon || '',
        email: data.email || '',
        kepalaSekolah: data.kepalaSekolah || '',
        nipKepalaSekolah: data.nipKepalaSekolah || '',
        fotoKepalaSekolah: data.fotoKepalaSekolah || '',
        sambutanRaw: Array.isArray(data.sambutanKepalaSekolah) 
          ? data.sambutanKepalaSekolah.join('\n\n') 
          : (data.sambutanKepalaSekolah || '')
      });
    }

  }, []);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const compressImage = (file, maxWidth = 300, maxHeight = 300, quality = 0.75) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran foto maksimal adalah 10 MB.');
        return;
      }
      try {
        const base64 = await compressImage(file, 300, 300, 0.75);
        setConfig(prev => ({ ...prev, fotoKepalaSekolah: base64 }));
      } catch (err) {
        console.error('Membaca file gagal:', err);
        alert('Gagal membaca berkas gambar.');
      }
    }
  };


  const handleSave = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!config.namaSekolah.trim()) {
      setError('Nama Sekolah harus diisi.');
      return;
    }

    const paragraphs = config.sambutanRaw
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const payload = {
      namaSekolah: config.namaSekolah,
      tagline: config.tagline,
      alamat: config.alamat,
      telepon: config.telepon,
      email: config.email,
      kepalaSekolah: config.kepalaSekolah,
      nipKepalaSekolah: config.nipKepalaSekolah,
      fotoKepalaSekolah: config.fotoKepalaSekolah,
      sambutanKepalaSekolah: paragraphs
    };

    try {
      localStore.savePengaturan(payload);
      setSuccess('Pengaturan berhasil diperbarui!');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Gagal menyimpan pengaturan.');
    }
  };

  return (
    <div>
      {/* ====== Page Header ====== */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-800">Pengaturan Sekolah</h1>
        <p className="text-xs text-dark-400 mt-1">Ubah metadata sekolah, kontak, dan sambutan kepala sekolah</p>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-lg">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* ====== Card 1: Informasi Umum ====== */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-dark-100 space-y-4">
          <h2 className="text-sm font-extrabold text-[#F5921B] border-b border-dark-50 pb-2">Informasi Umum Sekolah</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark-700 mb-1.5">Nama Sekolah</label>
              <input
                type="text"
                name="namaSekolah"
                value={config.namaSekolah}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-dark-700 mb-1.5">Tagline / Moto</label>
              <input
                type="text"
                name="tagline"
                value={config.tagline}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark-700 mb-1.5">Alamat Lengkap</label>
            <textarea
              name="alamat"
              rows={2}
              value={config.alamat}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark-700 mb-1.5">Nomor Telepon</label>
              <input
                type="text"
                name="telepon"
                value={config.telepon}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-dark-700 mb-1.5">Email Sekolah</label>
              <input
                type="email"
                name="email"
                value={config.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* ====== Card 2: Profil Kepala Sekolah ====== */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-dark-100 space-y-4">
          <h2 className="text-sm font-extrabold text-[#F5921B] border-b border-dark-50 pb-2">Profil Kepala Sekolah</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-dark-700 mb-1.5">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  name="kepalaSekolah"
                  value={config.kepalaSekolah}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-dark-700 mb-1.5">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  name="nipKepalaSekolah"
                  value={config.nipKepalaSekolah}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Foto Kepala Sekolah Upload */}
            <div className="flex flex-col items-center">
              <span className="block text-xs font-bold text-dark-700 mb-1.5 w-full text-center">Foto Kepala Sekolah</span>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-primary transition bg-gray-50/30 overflow-hidden relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFotoChange} 
                />
                {config.fotoKepalaSekolah ? (
                  <img src={config.fotoKepalaSekolah} alt="Foto Kepala Sekolah" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[10px] text-dark-400 font-bold">Upload Foto</span>
                  </>
                )}
              </label>
              {config.fotoKepalaSekolah && (
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, fotoKepalaSekolah: '' })}
                  className="text-[10px] text-red-500 hover:text-red-700 font-bold mt-1.5"
                >
                  Hapus Foto
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ====== Card 3: Sambutan Kepala Sekolah ====== */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-dark-100 space-y-4">
          <h2 className="text-sm font-extrabold text-[#F5921B] border-b border-dark-50 pb-2">Sambutan Kepala Sekolah</h2>
          <div>
            <label className="block text-xs font-bold text-dark-700 mb-1.5">Teks Sambutan</label>
            <p className="text-[10px] text-dark-400 mb-2">Pisahkan setiap paragraf dengan menekan tombol Enter (beri jarak satu baris kosong).</p>
            <textarea
              name="sambutanRaw"
              rows={8}
              value={config.sambutanRaw}
              onChange={handleChange}
              className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary resize-y font-sans"
              placeholder="Tulis paragraf sambutan di sini..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#F5921B] hover:bg-[#E8850F] text-white text-xs font-bold rounded-lg transition-all shadow-md active:scale-95"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>

    </div>
  );
};

export default PengaturanPage;
