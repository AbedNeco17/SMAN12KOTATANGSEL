import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BeritaCard from '@components/ui/BeritaCard';
import { localStore } from '@services/localStore';
import trophyPng from '@assets/trophy.png';

const ITEMS_PER_PAGE = 6;

const HomePage = () => {
  const [beritaList, setBeritaList] = useState([]);
  const [prestasiSiswa, setPrestasiSiswa] = useState([]);
  const [settings, setSettings] = useState({
    namaSekolah: 'SMAN 12 KOTA TANGERANG SELATAN',
    tagline: "I AM THE BEST, YOU'RE THE BEST WE ARE THE BEST, DUBES IS THE BEST",
    kepalaSekolah: 'Rokhmat Hidayat, S.Pd., MM',
    sambutanKepalaSekolah: []
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Load dynamic settings
    const activeSettings = localStore.getPengaturan();
    if (activeSettings) {
      setSettings(activeSettings);
    }

    // Load news list (filter only published items)
    const allBerita = localStore.getBerita();
    const published = allBerita.filter(b => b.status === 'published');
    setBeritaList(published);

    // Load student achievements
    const activePrestasi = localStore.getPrestasiSiswa();
    if (activePrestasi) {
      setPrestasiSiswa(activePrestasi);
    }
  }, []);

  const totalPages = Math.ceil(beritaList.length / ITEMS_PER_PAGE) || 1;
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleBerita = beritaList.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const goPage = (dir) => {
    setCurrentPage((p) => Math.max(1, Math.min(totalPages, p + dir)));
  };

  return (
    <div>
      {/* ==========================================
          HERO SECTION — Background image + overlay
          ========================================== */}
      <section className="relative min-h-[420px] sm:min-h-[480px] md:min-h-[520px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, #2E7D32 0%, #4CAF50 30%, #81C784 50%, #A5D6A7 70%, #C8E6C9 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 text-center px-4 py-12 md:py-16">
          <h1 className="text-white font-extrabold leading-[1.08] mb-3
                         text-3xl sm:text-4xl md:text-5xl lg:text-[54px]
                         drop-shadow-lg uppercase">
            {settings.namaSekolah}
          </h1>

          <p className="text-white/90 text-[11px] sm:text-xs md:text-sm tracking-[0.15em] uppercase mb-6 max-w-xl mx-auto drop-shadow">
            {settings.tagline}
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/visi-misi"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-md
                         hover:bg-primary-dark active:scale-[0.98] transition-all duration-200 shadow-md"
            >
              Visi & Misi
            </Link>
            <Link
              to="/galeri"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-white/90 text-dark-800 text-sm font-semibold rounded-md
                         hover:bg-white active:scale-[0.98] transition-all duration-200 shadow-md border border-white/50"
            >
              Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          SAMBUTAN KEPALA SEKOLAH SECTION
          ========================================== */}
      <section id="sambutan-kepsek" className="py-12 md:py-16 bg-slate-50/50">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center mb-4 border-2 border-primary/20 shadow-sm">
                {settings.fotoKepalaSekolah ? (
                  <img
                    src={settings.fotoKepalaSekolah}
                    alt="Foto Kepala Sekolah"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                )}
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                {settings.kepalaSekolah}
              </h3>
              <p className="text-[10px] font-bold text-primary tracking-wider uppercase mt-1">
                Kepala Sekolah
              </p>
              <div className="w-12 h-[2px] bg-primary/20 my-3 rounded-full" />
              <p className="text-[10px] text-slate-400 leading-normal">
                {settings.namaSekolah}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase block mb-1">
                  Sambutan Kepala Sekolah
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  Selamat Datang di SMAN 12 Kota Tangerang Selatan
                </h2>
              </div>
              
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-4 text-justify">
                <p className="font-semibold text-slate-800">
                  Assalamu'alaikum Warahmatullahi Wabarakatuh,
                  <br />
                  Salam Sejahtera bagi kita semua.
                </p>
                {settings.sambutanKepalaSekolah && settings.sambutanKepalaSekolah.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
                <p className="font-semibold text-slate-800 pt-2">
                  Wassalamu'alaikum Warahmatullahi Wabarakatuh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          PRESTASI SISWA SECTION — 4 student cards
          ========================================== */}
      <section id="prestasi-siswa" className="py-12 md:py-16 bg-white border-t border-slate-100">
        <div className="container-main">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase block mb-1">
              Prestasi Unggulan
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Prestasi Siswa SMAN 12
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mt-2">
              Apresiasi atas rekam jejak, pencapaian gemilang, dan dedikasi luar biasa para siswa di berbagai bidang.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {prestasiSiswa.map((siswa) => (
              <div
                key={siswa.nama}
                className="relative bg-slate-50/50 rounded-2xl p-5 pt-6 border border-slate-100 shadow-sm text-center hover:shadow-md hover:border-slate-200/60 transition-all duration-300"
              >
                <span className={`absolute top-3.5 right-3.5 px-2 py-0.5 rounded text-[9px] font-bold text-white ${siswa.badgeColor}`}>
                  {siswa.badge}
                </span>

                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 mx-auto mb-3.5 flex items-center justify-center shadow-sm bg-amber-50/15 p-1.5">
                  <img
                    src={trophyPng}
                    alt="Piala"
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 mb-1 leading-snug">{siswa.nama}</h3>
                <p className="text-[10px] sm:text-[11px] text-primary font-bold mb-1 leading-snug">
                  {siswa.prestasi}
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold">{siswa.level}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          BERITA & PENGUMUMAN SECTION
          ========================================== */}
      <section className="py-10 md:py-14 bg-slate-50/30 border-t border-slate-100">
        <div className="container-main">
          <div className="flex items-start justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-primary mb-1.5">
                Berita & Pengumuman
              </h2>
              <p className="text-dark-400 text-xs md:text-sm max-w-md leading-relaxed">
                Informasi terkini mengenai kegiatan sekolah, pengumuman resmi
                dan artikel edukatif lainnya
              </p>
            </div>
            <Link
              to="/berita"
              className="hidden sm:flex items-center gap-1 text-primary text-xs md:text-sm font-medium hover:text-primary-dark transition-colors whitespace-nowrap mt-1"
            >
              Lihat Semua Berita
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {visibleBerita.map((item) => (
              <BeritaCard 
                key={item.id} 
                id={item.id} 
                judul={item.judul}
                deskripsi={item.deskripsi}
                thumbnail={item.thumbnail}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => goPage(-1)}
              disabled={currentPage <= 1}
              className="w-8 h-8 flex items-center justify-center rounded bg-dark-800 text-white disabled:opacity-30 hover:bg-dark-700 transition-colors"
              aria-label="Previous page"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="text-sm font-semibold text-dark-800 min-w-[24px] text-center">
              {currentPage}
            </span>

            <button
              onClick={() => goPage(1)}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded bg-dark-800 text-white disabled:opacity-30 hover:bg-dark-700 transition-colors"
              aria-label="Next page"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="sm:hidden mt-4 text-center">
            <Link
              to="/berita"
              className="text-primary text-sm font-medium hover:text-primary-dark"
            >
              Lihat Semua Berita →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
