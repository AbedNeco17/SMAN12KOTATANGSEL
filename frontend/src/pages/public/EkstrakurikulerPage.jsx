import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { localStore } from '@services/localStore';
import trophyPng from '@assets/trophy.png';

const ekstrakurikuler = [
  {
    nama: 'Pramuka',
    kategori: 'Karakter',
    deskripsi: 'Membangun karakter disiplin, kemandirian, dan kepemimpinan melalui kegiatan kepramukaan yang menyenangkan.',
    icon: (
      <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    )
  },
  {
    nama: 'Basket',
    kategori: 'Olahraga',
    deskripsi: 'Mengembangkan bakat olahraga bola basket, kerjasama tim, dan sportivitas dalam kompetisi antar sekolah.',
    icon: (
      <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.2 6.2c2.4 2.4 2.4 6.2 0 8.5M17.8 6.2c-2.4 2.4-2.4 6.2 0 8.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M2 12h20" />
      </svg>
    )
  },
  {
    nama: 'Futsal',
    kategori: 'Olahraga',
    deskripsi: 'Meningkatkan kemampuan fisik, taktik, dan semangat pantang menyerah melalui olahraga futsal.',
    icon: (
      <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20" />
      </svg>
    )
  },
  {
    nama: 'PMR',
    kategori: 'Sosial',
    deskripsi: 'Palang Merah Remaja melatih kesiapsiagaan, pertolongan pertama, dan kepedulian sosial terhadap sesama.',
    icon: (
      <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    )
  },
  {
    nama: 'Seni Musik',
    kategori: 'Seni',
    deskripsi: 'Wadah kreativitas bagi siswa yang memiliki minat dalam bermain alat musik dan bernyanyi.',
    icon: (
      <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 10l12-3" />
        <circle cx="6" cy="19" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    )
  },
  {
    nama: 'KIR',
    kategori: 'Sains',
    deskripsi: 'Kelompok Ilmiah Remaja mendorong siswa untuk meneliti, berinovasi, dan berpikir kritis dalam bidang sains.',
    icon: (
      <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3h4.5M12 3v9M7.05 18.75h9.9M9.75 9h4.5M16.5 19.5a1.5 1.5 0 001.35-2.25L14.4 7.5V4.5h-4.8v3L6.15 17.25A1.5 1.5 0 007.5 19.5h9z" />
      </svg>
    )
  },
];

const sistemPointFeatures = [
  {
    title: 'Monitoring Point',
    desc: 'Pantau total point kedisiplinan secara real-time.',
  },
  {
    title: 'Riwayat',
    desc: 'Catatan pelanggaran dan prestasi tercatat rapi.',
  },
  {
    title: 'Pembinaan',
    desc: 'Jadwal dan status pembinaan konseling siswa.',
  },
  {
    title: 'Rekap Disiplin',
    desc: 'Laporan akumulatif untuk evaluasi akhir semester.',
  },
];

const getCategoryStyles = (kategori) => {
  switch (kategori) {
    case 'Karakter':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200/60',
        iconBg: 'bg-amber-50 text-amber-600',
        accentBg: 'bg-amber-500',
        hoverBorder: 'hover:border-amber-300'
      };
    case 'Olahraga':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200/60',
        iconBg: 'bg-orange-50 text-orange-500',
        accentBg: 'bg-orange-500',
        hoverBorder: 'hover:border-orange-300'
      };
    case 'Sosial':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200/60',
        iconBg: 'bg-rose-50 text-rose-500',
        accentBg: 'bg-rose-500',
        hoverBorder: 'hover:border-rose-300'
      };
    case 'Seni':
      return {
        bg: 'bg-violet-50',
        text: 'text-violet-700',
        border: 'border-violet-200/60',
        iconBg: 'bg-violet-50 text-violet-600',
        accentBg: 'bg-violet-600',
        hoverBorder: 'hover:border-violet-300'
      };
    case 'Sains':
      return {
        bg: 'bg-cyan-50',
        text: 'text-cyan-700',
        border: 'border-cyan-200/60',
        iconBg: 'bg-cyan-50 text-cyan-600',
        accentBg: 'bg-cyan-600',
        hoverBorder: 'hover:border-cyan-300'
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200/60',
        iconBg: 'bg-slate-50 text-slate-500',
        accentBg: 'bg-slate-500',
        hoverBorder: 'hover:border-slate-300'
      };
  }
};

const EkstrakurikulerPage = () => {
  const [prestasiSiswa, setPrestasiSiswa] = useState([]);

  useEffect(() => {
    const activePrestasi = localStore.getPrestasiSiswa();
    if (activePrestasi) {
      setPrestasiSiswa(activePrestasi);
    }
  }, []);

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* ==========================================
          HERO SECTION — Classroom BG + overlay
          ========================================== */}
      <section className="relative min-h-[240px] md:min-h-[300px] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Glowing Orbs */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-glow-orb rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[250px] h-[250px] bg-glow-orb rounded-full pointer-events-none opacity-60" />

        {/* Animated Moving Stripes Overlay */}
        <div className="absolute inset-0 bg-stripes-pattern opacity-40 animate-moving-stripes pointer-events-none" />

        {/* Diagonal stripes overlay original style but animated */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-slate-950 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

        <div className="relative z-10 text-center px-6 py-12 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-sm font-sans">
            Kesiswaan <span className="text-gradient-primary">&amp; Ekstrakurikuler</span>
          </h1>
          
          <p className="text-slate-300 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed font-normal">
            Mengembangkan potensi, minat, dan bakat siswa melalui berbagai wadah organisasi,
            kegiatan ekstrakurikuler, dan program pembinaan kedisiplinan berkarakter unggul di SMAN 12 Tangerang Selatan.
          </p>
        </div>
      </section>

      {/* ==========================================
          EKSTRAKURIKULER SECTION — 3×2 info cards
          ========================================== */}
      <section className="py-12 md:py-16 bg-transparent relative z-10">
        <div className="container-main">
          {/* Header Title Section */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              Pilihan <span className="text-primary">Ekstrakurikuler</span>
            </h2>
            <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto">
              Berbagai program pengembangan minat dan bakat untuk melatih kepemimpinan, kemandirian, dan kreativitas siswa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ekstrakurikuler.map((item) => {
              const styles = getCategoryStyles(item.kategori);
              return (
                <div
                  key={item.nama}
                  className={`group relative bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1)] ${styles.hoverBorder} hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col`}
                >
                  {/* Top accent bar warna kategori */}
                  <div className={`h-1.5 w-full ${styles.accentBg}`} />

                  <div className="p-6 flex flex-col flex-1">
                    {/* Header: Title + Category */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <h3 className="text-sm md:text-base font-bold text-slate-800 tracking-tight leading-tight group-hover:text-primary transition-colors duration-200">
                        {item.nama}
                      </h3>
                      
                      <span className={`shrink-0 px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${styles.bg} ${styles.text} ${styles.border}`}>
                        {item.kategori}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] bg-slate-100 w-full mb-3" />

                    {/* Description */}
                    <p className="text-[12px] text-slate-500 leading-relaxed font-normal flex-1">
                      {item.deskripsi}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary transition-colors duration-300" />
                        <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">SMAN 12 Tangsel</p>
                      </div>
                      <div className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          PRESTASI SISWA SECTION — 4 student cards
          ========================================== */}
      <section className="py-12 md:py-16 bg-transparent relative z-10 border-t border-slate-100/60">
        <div className="container-main">
          {/* Header Title Section */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              Prestasi <span className="text-primary">Siswa Kami</span>
            </h2>
            <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto">
              Apresiasi atas dedikasi dan kerja keras para siswa yang berhasil meraih prestasi gemilang.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {prestasiSiswa.map((siswa) => (
              <div
                key={siswa.nama}
                className="group relative bg-white rounded-2xl p-5 pt-7 border border-slate-100 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] text-center hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1)] hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
              >
                <span className={`absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white shadow-sm ${siswa.badgeColor}`}>
                  {siswa.badge}
                </span>

                <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-100 mx-auto mb-4 flex items-center justify-center shadow-sm bg-amber-50/20 p-2.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <img
                    src={trophyPng}
                    alt="Piala"
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 mb-1 leading-snug group-hover:text-primary transition-colors duration-200">{siswa.nama}</h3>
                <p className="text-[10px] sm:text-[11px] text-primary font-semibold mb-1.5 leading-snug">
                  {siswa.prestasi}
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium">{siswa.level}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SISTEM POINT SISWA — Dark section
          ========================================== */}
      <section className="py-12 md:py-16 bg-transparent relative z-10 border-t border-slate-100/60">
        <div className="container-main">
          <div className="bg-[#1B2A4A] rounded-2xl overflow-hidden shadow-lg border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-0">
              <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-bold tracking-wider uppercase mb-3 w-fit">
                  Poin Karakter
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                  Sistem Poin Siswa
                </h2>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6 max-w-sm">
                  Portal terpadu untuk memantau kedisiplinan dan prestasi siswa.
                  Akses informasi mengenai akumulasi poin, riwayat pelanggaran,
                  dan rekam jejak pembinaan secara transparan.
                </p>
                <div>
                  <Link
                    to="/kesiswaan/login/siswa"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg"
                  >
                    Masuk ke Sistem Poin
                    <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[1px] bg-slate-800">
                {sistemPointFeatures.map((feat) => (
                  <div key={feat.title} className="bg-[#1B2A4A] p-6 hover:bg-slate-900/40 transition-colors duration-200">
                    <h3 className="text-sm font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-[11px] text-slate-300/80 leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EkstrakurikulerPage;
