import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { localStore } from '@services/localStore';

const TambahKontenPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    judul: '',
    kategori: 'berita',
    tag: '',
    konten: '',
    thumbnail: null,
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [status, setStatus] = useState('Draft');
  const [visibilitas, setVisibilitas] = useState('Publik');
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const existing = localStore.getBeritaById(id);
      if (existing) {
        setForm({
          id: existing.id,
          judul: existing.judul,
          kategori: existing.kategori,
          tag: existing.tags || '',
          konten: existing.konten,
          thumbnail: existing.thumbnail,
        });
        setThumbnailPreview(existing.thumbnail);
        setStatus(existing.status === 'published' ? 'Published' : 'Draft');
      }
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      try {
        const base64 = await fileToBase64(file);
        setForm({ ...form, thumbnail: base64 });
        setThumbnailPreview(base64);
      } catch (err) {
        console.error('File reading failed', err);
      }
    }
  };

  const handleSave = (statusText) => {
    setError('');
    if (!form.judul.trim()) {
      setError('Judul konten harus diisi.');
      return;
    }
    if (!form.konten.trim()) {
      setError('Konten utama harus diisi.');
      return;
    }

    const payload = {
      judul: form.judul,
      kategori: form.kategori,
      tags: form.tag,
      konten: form.konten,
      thumbnail: form.thumbnail,
      status: statusText
    };

    if (id) {
      payload.id = parseInt(id);
    }

    localStore.saveBerita(payload);

    if (form.kategori === 'pengumuman') {
      localStore.savePengumuman({
        id: id ? parseInt(id) : undefined,
        judul: form.judul,
        status: statusText === 'published' ? 'STATUS: DILAKSANAKAN' : 'PENGUMUMAN SEBENTAR...',
        statusType: statusText === 'published' ? 'published' : 'upcoming'
      });
    }

    navigate('/admin/data-berita');
  };

  return (
    <div>
      {/* ====== Breadcrumb ====== */}
      <div className="flex items-center gap-2 text-xs text-dark-400 mb-4">
        <span className="text-primary font-medium">Admin Panel</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-primary font-medium">kelola Konten</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-bold text-dark-800">{id ? 'Edit Konten' : 'Tambah Baru'}</span>
      </div>

      {/* ====== Page Title ====== */}
      <h1 className="text-xl md:text-2xl font-extrabold text-dark-800 mb-0.5">
        {id ? 'Edit Konten Sekolah' : 'Tambahkan Konten Baru'}
      </h1>
      <p className="text-xs text-dark-400 mb-6">
        {id ? 'Perbarui konten berita atau pengumuman sekolah' : 'Buat dan publikasikan berita atau pengumuman sekolah terbaru'}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* ====== Two-Column Layout ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

        {/* ====== LEFT COLUMN ====== */}
        <div className="space-y-4">
          {/* Card 1 — Judul + Kategori + Tag */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="mb-4">
              <label className="block text-xs font-bold text-primary mb-1.5">Judul Konten</label>
              <input
                type="text"
                name="judul"
                value={form.judul}
                onChange={handleChange}
                placeholder="Masukan judul yang menarik..."
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white
                           focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition
                           placeholder:text-dark-200"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-primary mb-1.5">Kategori</label>
              <select
                name="kategori"
                value={form.kategori}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white
                           focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
              >
                <option value="berita">Berita</option>
                <option value="pengumuman">Pengumuman</option>
                <option value="kegiatan">Kegiatan</option>
                <option value="prestasi">Prestasi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1.5">Tag</label>
              <input
                type="text"
                name="tag"
                value={form.tag}
                onChange={handleChange}
                placeholder="Gunakan koma sebagai pemisah"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white
                           focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition
                           placeholder:text-dark-200"
              />
            </div>
          </div>

          {/* Card 2 — Konten Utama */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-primary mb-1.5">Konten Utama</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg overflow-hidden">
              <textarea
                name="konten"
                value={form.konten}
                onChange={handleChange}
                rows={10}
                placeholder="Tulid isi konten di sini..."
                className="w-full px-4 py-3 text-sm bg-transparent border-none
                           focus:outline-none focus:ring-0 resize-y
                           placeholder:text-dark-200"
              />
            </div>

            <button
              type="button"
              onClick={() => handleSave(status === 'Published' ? 'published' : 'draft')}
              className="w-full mt-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg
                         hover:bg-primary-dark active:scale-[0.98] transition-all"
            >
              Konfirmasi
            </button>
          </div>
        </div>

        {/* ====== RIGHT COLUMN ====== */}
        <div className="space-y-4">
          {/* Card 1 — Gambar Utama */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-primary">Gambar Utama</label>
            </div>

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-primary transition bg-gray-50/30">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <>
                  <svg className="w-8 h-8 text-gray-300 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-xs text-dark-300">Upload Gambar / file</span>
                </>
              )}
            </label>
          </div>

          {/* Card 2 — Pengaturan Publikasi */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-primary mb-3">Pengaturan Publikasi</h3>

            <div className="space-y-2.5 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-dark-500">Status</span>
                <span className="text-xs font-bold text-primary">{status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-dark-500">Visibilitas</span>
                <span className="text-xs font-bold text-dark-800">{visibilitas}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setStatus('Draft');
                handleSave('draft');
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-dark-800 text-sm font-bold rounded-lg
                         active:scale-[0.98] transition-all mb-3 border border-slate-200"
            >
              Simpan Draft
            </button>
          </div>

          {/* PUBLIKASI SEKARANG */}
          <button
            type="button"
            onClick={() => {
              setStatus('Published');
              handleSave('published');
            }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white text-sm font-extrabold uppercase tracking-wide rounded-xl
                       hover:bg-primary-dark active:scale-[0.98] transition-all shadow-md"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            PUBLIKASI SEKARANG
          </button>
        </div>
      </div>
    </div>
  );
};

export default TambahKontenPage;
