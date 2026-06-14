import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { localStore } from '@services/localStore';
import trophyPng from '@assets/trophy.png';

const ekstrakurikuler = [
  {
    nama: 'Pramuka',
    deskripsi: 'Membangun karakter disiplin, kemandirian, dan kepemimpinan melalui kegiatan kepramukaan yang menyenangkan.',
  },
  {
    nama: 'Basket',
    deskripsi: 'Mengembangkan bakat olahraga bola basket, kerjasama tim, dan sportivitas dalam kompetisi antar sekolah.',
  },
  {
    nama: 'Futsal',
    deskripsi: 'Meningkatkan kemampuan fisik, taktik, dan semangat pantang menyerah melalui olahraga futsal.',
  },
  {
    nama: 'PMR',
    deskripsi: 'Palang Merah Remaja melatih kesiapsiagaan, pertolongan pertama, dan kepedulian sosial terhadap sesama.',
  },
  {
    nama: 'Seni Musik',
    deskripsi: 'Wadah kreativitas bagi siswa yang memiliki minat dalam bermain alat musik dan bernyanyi.',
  },
  {
    nama: 'KIR',
    deskripsi: 'Kelompok Ilmiah Remaja mendorong siswa untuk meneliti, berinovasi, dan berpikir kritis dalam bidang sains.',
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

const EkstrakurikulerPage = () => {
  const [prestasiSiswa, setPrestasiSiswa] = useState([]);

  useEffect(() => {
    const activePrestasi = localStore.getPrestasiSiswa();
    if (activePrestasi) {
      setPrestasiSiswa(activePrestasi);
    }
  }, []);

  return (
    <div>
      {/* ==========================================
          HERO SECTION — Classroom BG + overlay
          ========================================== */}
      <section className="relative min-h-[200px] md:min-h-[260px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, #3E2723 0%, #4E342E 30%, #5D4037 60%, #6D4C41 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 text-center px-4 py-10 md:py-14">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white italic mb-2 drop-shadow-lg">
            Kesiswaan
          </h1>
          <p className="text-white/80 text-xs md:text-sm max-w-xl mx-auto leading-relaxed drop-shadow">
            Mengembangkan potensi siswa melalui berbagai program, organisasi, dan kegiatan
            ekstrakurikuler untuk mencetak generasi berprestasi dan berkarakter.
          </p>
        </div>
      </section>

      {/* ==========================================
          EKSTRAKURIKULER SECTION — 3×2 info cards
          ========================================== */}
      <section className="py-10 md:py-14 bg-white">
        <div className="container-main">
          <h2 className="text-xl md:text-2xl font-bold text-primary italic text-center mb-1">
            Ekstrakurikuler
          </h2>
          <div className="h-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {ekstrakurikuler.map((item) => (
              <div
                key={item.nama}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <h3 className="text-sm font-bold text-dark-800 mb-2">{item.nama}</h3>
                <p className="text-xs text-dark-400 leading-relaxed">{item.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          PRESTASI SISWA SECTION — 4 student cards
          ========================================== */}
      <section className="py-10 md:py-14 bg-[#F8F9FB]">
        <div className="container-main">
          <h2 className="text-xl md:text-2xl font-bold text-primary text-center mb-1">
            Prestasi Siswa
          </h2>
          <div className="h-6" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {prestasiSiswa.map((siswa) => (
              <div
                key={siswa.nama}
                className="relative bg-white rounded-xl p-4 pt-5 border border-gray-100 shadow-sm text-center"
              >
                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-bold text-white ${siswa.badgeColor}`}>
                  {siswa.badge}
                </span>

                <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-100 mx-auto mb-3 flex items-center justify-center shadow-sm bg-amber-50/15 p-1.5">
                  <img
                    src={trophyPng}
                    alt="Piala"
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className="text-sm font-bold text-dark-800 mb-0.5">{siswa.nama}</h3>
                <p className="text-[11px] text-primary font-bold mb-1">
                  {siswa.prestasi}
                </p>
                <p className="text-[10px] text-dark-400">{siswa.level}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SISTEM POINT SISWA — Dark section
          ========================================== */}
      <section className="py-10 md:py-14 bg-white">
        <div className="container-main">
          <div className="bg-[#1B2A4A] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-0">
              <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                <h2 className="text-lg md:text-xl font-bold text-white mb-3">
                  Sistem Point Siswa
                </h2>
                <p className="text-xs md:text-sm text-white/60 leading-relaxed mb-5 max-w-sm">
                  Portal terpadu untuk memantau kedisiplinan dan prestasi siswa.
                  Akses informasi mengenai akumulasi point, riwayat pelanggaran,
                  dan rekam jejak pembinaan secara transparan.
                </p>
                <div>
                  <Link
                    to="/kesiswaan/login/siswa"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary text-xs font-semibold rounded-md
                               hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    Masuk ke Sistem Point
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[1px] bg-white/10">
                {sistemPointFeatures.map((feat) => (
                  <div key={feat.title} className="bg-[#1B2A4A] p-5 md:p-6">
                    <h3 className="text-sm font-bold text-white mb-1.5">{feat.title}</h3>
                    <p className="text-[11px] text-white/50 leading-relaxed">{feat.desc}</p>
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
