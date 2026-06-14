import { useState, useEffect } from 'react';
import { localStore } from '@services/localStore';

const HubungiKamiPage = () => {
  const [form, setForm] = useState({
    nama: '',
    email: '',
    subjek: '',
    pesan: '',
  });
  const [settings, setSettings] = useState({
    alamat: 'Jl. Pendidikan No. 12, Ciputat, Tangerang Selatan, Banten 15411',
    telepon: '(021) 7654321',
    email: 'info@sman12tangsel.sch.id'
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const active = localStore.getPengaturan();
    if (active) {
      setSettings(active);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!form.nama.trim() || !form.email.trim() || !form.subjek || !form.pesan.trim()) {
      setError('Harap lengkapi semua kolom formulir.');
      return;
    }

    try {
      localStore.savePesan(form);
      setSuccess('Pesan Anda berhasil dikirim! Terima kasih atas masukan Anda.');
      setForm({
        nama: '',
        email: '',
        subjek: '',
        pesan: '',
      });
    } catch (err) {
      setError('Gagal mengirimkan pesan. Silakan coba kembali.');
    }
  };

  return (
    <div>
      {/* ==========================================
          HEADER — "Hubungi Kami" centered
          ========================================== */}
      <section className="bg-[#F8F9FB] py-10 md:py-14">
        <div className="container-main text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-primary italic mb-2">
            Hubungi Kami
          </h1>
          <p className="text-xs md:text-sm text-dark-400 max-w-lg mx-auto leading-relaxed">
            Kami siap melayani pertanyaan, kritik, dan saran dari Anda. Silakan hubungi kami melalui formulir di
            bawah ini atau kunjungi lokasi kami.
          </p>
        </div>
      </section>

      {/* ==========================================
          MAIN CONTENT — Contact Info + Form
          ========================================== */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 lg:gap-8">

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-dark-800 mb-1">Alamat Utama</h3>
                    <p className="text-xs text-dark-400 leading-relaxed">
                      {settings.alamat}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-dark-800 mb-1">Kontak Cepat</h3>
                    <p className="text-xs text-dark-400 leading-relaxed">
                      Telepon: {settings.telepon}
                      <br />
                      Email: {settings.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-dark-800 mb-3">Media Sosial</h3>
                <div className="flex items-center gap-2.5">
                  <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-dark-400 hover:bg-primary hover:text-white transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-dark-400 hover:bg-primary hover:text-white transition-colors">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-dark-400 hover:bg-green-500 hover:text-white transition-colors">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-dark-800 mb-4">Kirim Pesan</h2>

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

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-dark-500 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      name="nama"
                      value={form.nama}
                      onChange={handleChange}
                      placeholder="Masukkan nama Anda"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white
                                 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition
                                 placeholder:text-dark-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-dark-500 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="email@contoh.com"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white
                                 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition
                                 placeholder:text-dark-200"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-dark-500 mb-1">Subjek</label>
                  <select
                    name="subjek"
                    value={form.subjek}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white
                               focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition
                               text-dark-400"
                  >
                    <option value="">Pilih Subjek...</option>
                    <option value="umum">Pertanyaan Umum</option>
                    <option value="akademik">Akademik</option>
                    <option value="saran">Saran & Kritik</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-medium text-dark-500 mb-1">Pesan</label>
                  <textarea
                    name="pesan"
                    value={form.pesan}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tuliskan pesan Anda disini ..."
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white
                               focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition resize-y
                               placeholder:text-dark-200"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-md
                             hover:bg-primary-dark active:scale-[0.98] transition-all duration-200"
                >
                  Kirim Pesan
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          MAP SECTION — Placeholder matching design
          ========================================== */}
      <section className="py-6 md:py-10 bg-white">
        <div className="container-main">
          <div className="relative rounded-xl overflow-hidden bg-[#C8E6C9] h-[280px] md:h-[340px]">
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="mapGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#2E7D32" strokeWidth="0.5" />
                  </pattern>
                  <pattern id="mapGridSmall" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                    <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#2E7D32" strokeWidth="0.2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mapGridSmall)" />
                <rect width="100%" height="100%" fill="url(#mapGrid)" />
                <line x1="0" y1="30%" x2="100%" y2="70%" stroke="#4CAF50" strokeWidth="2" opacity="0.3" />
                <line x1="20%" y1="0" x2="80%" y2="100%" stroke="#4CAF50" strokeWidth="2" opacity="0.3" />
                <line x1="40%" y1="0" x2="60%" y2="100%" stroke="#4CAF50" strokeWidth="1.5" opacity="0.2" />
              </svg>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="relative mb-2">
                <svg className="w-8 h-8 text-red-500 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 7.38 8.5 15.5 8.5 15.5s8.5-8.12 8.5-15.5C20.5 3.81 16.69 0 12 0zm0 13a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" />
                </svg>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm text-center">
                <p className="text-sm font-bold text-dark-800">Peta Lokasi SMAN 12</p>
                <p className="text-[11px] text-dark-400">Tangerang Selatan, Banten</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HubungiKamiPage;
