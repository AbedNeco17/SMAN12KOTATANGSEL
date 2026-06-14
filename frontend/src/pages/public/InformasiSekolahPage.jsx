import { useState, useEffect } from 'react';
import { localStore } from '@services/localStore';

const dokumenData = [
  { id: 1, nama: 'Kalender Akademik', size: 'PDF • 1,2 MB' },
  { id: 2, nama: 'Tata Tertib Sekolah', size: 'PDF • 0,8 MB' },
  { id: 3, nama: 'Buku Saku Siswa & Poin', size: 'PDF • 1,5 MB' },
  { id: 4, nama: 'Brosur Sekolah', size: 'PDF • 3,5 MB' },
];

const faqData = [
  {
    id: 1,
    q: 'Bagaimana cara masuk ke Portal Poin Karakter?',
    a: 'Siswa dan Orang Tua dapat masuk melalui menu Kesiswaan > Portal Poin Karakter, kemudian memasukkan NISN serta password masing-masing yang telah didaftarkan oleh pihak sekolah.',
  },
  {
    id: 2,
    q: 'Apakah ada seragam khusus untuk siswa baru?',
    a: 'Ya, siswa baru diwajibkan menggunakan seragam putih-abu sesuai ketentuan nasional, ditambah seragam batik khas SMAN 12 Kota Tangerang Selatan pada hari Jumat.',
  },
  {
    id: 3,
    q: 'Bagaimana cara melakukan pembayaran iuran?',
    a: 'Pembayaran iuran sekolah dapat dilakukan melalui transfer bank atau langsung di bagian keuangan sekolah. Detail rekening akan diberikan saat registrasi ulang.',
  },
];

const statusColors = {
  upcoming: 'text-orange-500',
  scheduled: 'text-blue-500',
  published: 'text-green-600',
  archive: 'text-dark-400',
};

const DokumenCard = ({ nama, size }) => (
  <div className="flex flex-col items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
      </svg>
    </div>
    <div className="text-center flex-1 min-w-0">
      <p className="text-xs font-bold text-dark-800 leading-snug">{nama}</p>
      <p className="text-[10px] text-dark-400 mt-0.5">{size}</p>
    </div>
    <button className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-dark-400">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </button>
  </div>
);

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-dark-700 hover:bg-gray-50 transition-colors"
      >
        <span>{q}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 ml-4 text-dark-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-dark-500 leading-relaxed border-t border-gray-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
};

const InformasiSekolahPage = () => {
  const [pengumumanList, setPengumumanList] = useState([]);

  useEffect(() => {
    setPengumumanList(localStore.getPengumuman());
  }, []);

  return (
    <div>
      <section className="bg-[#F0F4F8] py-10 md:py-14">
        <div className="container-main text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-dark-800 mb-3">
            Informasi Sekolah
          </h1>
          <p className="text-sm text-dark-400 max-w-xl mx-auto leading-relaxed">
            Pusat informasi resmi, dokumen akademik, jadwal kegiatan, dan pengumuman
            bagi seluruh warga akademika SMAN 12 Kota Tangerang Selatan.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-12 bg-white">
        <div className="container-main">
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary mb-3">
            Status Resmi
          </p>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h2 className="text-xl md:text-2xl font-bold text-dark-800 mb-3">
                  Sertifikat Akreditasi &ldquo;A&rdquo;
                </h2>
                <p className="text-sm text-dark-500 leading-relaxed max-w-md">
                  Sekolah kami telah mendapatkan sertifikasi dengan predikat Akreditasi A
                  yang diberikan oleh Badan Akreditasi Nasional Sekolah/Madrasah
                  (BAN-S/M), menjamin mutu pendidikan yang berkelajutan.
                </p>
              </div>
              <div className="border-t lg:border-t-0 lg:border-l border-gray-200 p-6 md:p-8 flex flex-col items-center justify-center gap-4 bg-gray-50/50">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                  </svg>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-primary text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all duration-200">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  DOWNLOAD SERTIFIKAT
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12 bg-[#F8F9FB]">
        <div className="container-main">
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary mb-2">
            Info Resmi
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-dark-800 mb-5">
            Pengumuman Kelulusan
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
            {pengumumanList.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-dark-800 leading-snug">{item.judul}</p>
                  <p className={`text-[11px] font-medium mt-0.5 ${statusColors[item.statusType]}`}>
                    {item.status}
                  </p>
                </div>
                <svg className="w-4 h-4 text-dark-300 group-hover:text-primary transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="unduhan" className="py-10 md:py-12 bg-white">
        <div className="container-main">
          <h2 className="text-xl md:text-2xl font-bold text-dark-800 mb-1">
            Unduhan Dokumen
          </h2>
          <p className="text-xs text-dark-400 mb-5">
            Dokumen panduan dan informasi publik sekolah
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {dokumenData.map((doc) => (
              <DokumenCard key={doc.id} nama={doc.nama} size={doc.size} />
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-10 md:py-12 bg-[#F8F9FB]">
        <div className="container-main max-w-2xl">
          <div className="text-center mb-7">
            <h2 className="text-xl md:text-2xl font-bold text-dark-800 mb-2">
              Pertanyaan Umum (FAQ)
            </h2>
            <p className="text-xs text-dark-400">
              Jawaban atas pertanyaan yang sering diajukan oleh orang tua dan siswa sekolah.
            </p>
          </div>
          <div className="space-y-3">
            {faqData.map((faq) => (
              <FaqItem key={faq.id} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default InformasiSekolahPage;
