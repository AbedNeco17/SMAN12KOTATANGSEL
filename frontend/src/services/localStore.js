// ========================================
// Initial Seed Data
// ========================================

const defaultBerita = [
  {
    id: 1,
    judul: "Sosialisasi Pencegahan Perundungan (Anti-Bullying) oleh Mahasiswa Universitas Pamulang di SMAN 12 Tangerang Selatan",
    slug: "sosialisasi-pencegahan-perundungan-anti-bullying-unpam-sman-12-tangsel",
    kategori: "kegiatan",
    deskripsi: "Mahasiswa Program Studi Hukum S1 Universitas Pamulang mengadakan edukasi pencegahan perundungan bagi siswa SMAN 12 Tangsel untuk meningkatkan kesadaran hukum.",
    konten: "Mahasiswa Program Studi Hukum S1 Universitas Pamulang sukses menyelenggarakan Pengabdian Kepada Masyarakat (PKM) di SMAN 12 Tangerang Selatan pada 21 Mei 2026. Kegiatan ini bertajuk 'Tertawamu Adalah Tangis Mereka: Sosialisasi Anti-Bullying di Sekolah Menengah'. Dipandu oleh para mahasiswa, sosialisasi ini bertujuan mengedukasi siswa mengenai bahaya fisik, verbal, dan psikologis perundungan serta konsekuensi hukumnya bagi pelaku di bawah umur. Melalui analisis SWOT, siswa diajak mengidentifikasi faktor pendukung dan penghambat pencegahan perundungan di sekolah untuk mewujudkan lingkungan yang aman dan ramah anak.",
    thumbnail: "/images/news/anti_bullying_pkm.png",
    status: "published",
    created_at: "2026-05-21",
    tags: "Anti-Bullying, Edukasi, Universitas Pamulang, PKM"
  },
  {
    id: 2,
    judul: "Apresiasi Keberhasilan Puluhan Siswa SMAN 12 Kota Tangerang Selatan Lolos Jalur SNBP PTN 2026",
    slug: "apresiasi-kelulusan-snbp-ptn-2026-sman-12-tangsel",
    kategori: "prestasi",
    deskripsi: "Kepala Sekolah SMAN 12 Tangerang Selatan Bapak Rokhmat Hidayat mengapresiasi puluhan siswa kelas XII yang diterima di berbagai PTN favorit.",
    konten: "SMAN 12 Kota Tangerang Selatan mencatatkan hasil yang membanggakan dalam Seleksi Nasional Berdasarkan Prestasi (SNBP) 2026. Puluhan siswa kelas XII dinyatakan lolos masuk Perguruan Tinggi Negeri (PTN) impian mereka seperti Universitas Indonesia (UI), IPB University, Universitas Negeri Jakarta (UNJ), UIN Syarif Hidayatullah Jakarta, dan universitas negeri favorit lainnya. Kepala Sekolah SMAN 12, Bapak Rokhmat Hidayat, menyampaikan selamat dan apresiasi setinggi-tingginya kepada para siswa serta guru pendamping atas kerja keras yang membawa hasil gemilang ini.",
    thumbnail: "/images/news/snbp_ptn_kelulusan.png",
    status: "published",
    created_at: "2026-03-28",
    tags: "SNBP, PTN, Prestasi, SMAN 12"
  },
  {
    id: 3,
    judul: "Mengembangkan Potensi Kreatif, Siswa Kelas XII SMAN 12 Tangsel Sukses Gelar Ujian Praktik Seni Budaya",
    slug: "siswa-xii-sman-12-tangsel-sukses-gelar-ujian-praktik-seni-budaya",
    kategori: "kegiatan",
    deskripsi: "Pagelaran karya tari tradisional, teater drama sosial, dan kolaborasi musik Nusantara memukau para penguji dan civitas akademika.",
    konten: "Siswa kelas XII SMAN 12 Kota Tangerang Selatan menyelenggarakan pagelaran ujian praktik mata pelajaran Seni Budaya dan Keterampilan (SBK). Kegiatan ini dibimbing langsung oleh Bapak Muhammad Rojak selaku guru Seni Budaya. Para siswa menampilkan berbagai pertunjukan seni kreatif yang memukau penguji, mulai dari pagelaran tari kolosal tradisional Nusantara, teater mini bertema kritik sosial, hingga aransemen musik ansambel. Selain untuk penilaian ujian akhir, kegiatan ini ditujukan untuk memupuk jiwa seni dan melestarikan kebudayaan daerah.",
    thumbnail: "/images/news/seni_budaya_praktik.png",
    status: "published",
    created_at: "2026-02-20",
    tags: "Seni Budaya, Ujian Praktik, Kreativitas, SMAN 12"
  },
  {
    id: 4,
    judul: "Sosialisasi Pancasila sebagai Sistem Etika oleh Mahasiswa UBSI di SMAN 12 Tangerang Selatan",
    slug: "sosialisasi-pancasila-sistem-etika-ubsi-sman-12-tangsel",
    kategori: "kegiatan",
    deskripsi: "Mahasiswa Universitas Bina Sarana Informatika mengadakan sosialisasi pentingnya etika Pancasila dalam memperkuat moral siswa.",
    konten: "Mahasiswa Universitas Bina Sarana Informatika (UBSI) Kampus BSD menyelenggarakan kegiatan sosialisasi mengenai Pancasila sebagai sistem etika untuk penguatan karakter di SMAN 12 Kota Tangerang Selatan pada Senin, 20 Oktober 2025. Kegiatan ini difokuskan kepada siswa kelas X.C untuk menanamkan nilai-nilai luhur Pancasila dalam perilaku sehari-hari. Melalui presentasi PowerPoint, diskusi kelompok interaktif mengenai studi kasus moralitas remaja, dan kuis interaktif, siswa dibimbing agar lebih memahami pentingnya bersikap sopan, berintegritas, dan menjunjung toleransi.",
    thumbnail: "/images/news/pancasila_etika_ubsi.png",
    status: "published",
    created_at: "2025-10-20",
    tags: "Pancasila, UBSI, Pengabdian Masyarakat"
  },
  {
    id: 5,
    judul: "Tingkatkan Kesiapan Karir Masa Depan, SMAN 12 Tangsel Adakan Pelatihan Pembuatan CV Profesional bagi Siswa",
    slug: "pelatihan-pembuatan-cv-profesional-word-sman-12-tangsel",
    kategori: "kegiatan",
    deskripsi: "Pelatihan menyusun resume profesional dan Curriculum Vitae menggunakan Microsoft Word diikuti oleh ratusan siswa kelas XII.",
    konten: "Sebagai bekal menghadapi persaingan pasca-kelulusan sekolah menengah, SMAN 12 Kota Tangerang Selatan bekerja sama dengan Universitas Pamulang menyelenggarakan pelatihan penyusunan Curriculum Vitae (CV) profesional menggunakan Microsoft Word pada 13 Februari 2025. Diikuti oleh siswa-siswi kelas XII, kegiatan ini memaparkan tips menyusun portofolio karir, menulis deskripsi keahlian, dan memilih layout CV yang dinilai ramah sistem penyaringan HRD (*ATS-friendly*). Diharapkan pelatihan keterampilan digital ini membantu alumni bersaing lebih baik.",
    thumbnail: "/images/news/pelatihan_cv_siswa.png",
    status: "published",
    created_at: "2025-02-13",
    tags: "Kesiapan Kerja, Microsoft Word, Pelatihan Siswa, Universitas Pamulang"
  },
  {
    id: 6,
    judul: "Siswa Kelas X SMAN 12 Tangerang Selatan Giat Latihan P5 Aksi dengan Kearifan Budaya Lokal",
    slug: "siswa-kelas-x-sman-12-tangerang-selatan-giat-latihan-p5-aksi-dengan-kearifan-budaya-lokal",
    kategori: "kegiatan",
    deskripsi: "Siswa kelas X SMAN 12 Tangerang Selatan menyelenggarakan latihan P5 aksi bertema kearifan lokal sebagai persiapan menyambut Panen Raya P5.",
    konten: "Siswa kelas X SMAN 12 Tangerang Selatan menyelenggarakan latihan 'P5 Aksi dengan Kearifan Lokal' sebagai persiapan menuju 'Panen Raya P5 Hajatan Budaya'. Pada latihan ini, para siswa dibagi ke dalam kelompok-kelompok kecil untuk mempersiapkan berbagai aspek pertunjukan dan pameran, mulai dari dekorasi dan tata panggung, pameran kuliner tradisional (seperti soto betawi, gudeg, kue cucur, bakpia), hingga latihan pertunjukan kesenian daerah (Palang Pintu, tari tradisional, cerita rakyat, teater). Kegiatan ini dipersiapkan di bawah bimbingan Wakil Kurikulum Ibu Yanthi Rohayati, S.T., M.Pd. dan wali kelas X.",
    thumbnail: "/images/news/p5_kearifan_lokal.png",
    status: "published",
    created_at: "2024-02-23",
    tags: "P5, Kearifan Lokal, Kebudayaan, Kurikulum Merdeka"
  },
  {
    id: 7,
    judul: "Tingkatkan Keterampilan Digital, Siswa SMAN 12 Tangsel Ikuti Pelatihan Microsoft Excel Sekejap",
    slug: "tingkatkan-keterampilan-digital-siswa-sman-12-tangsel-ikuti-pelatihan-microsoft-excel-sekejap",
    kategori: "kegiatan",
    deskripsi: "Pengabdian Kepada Masyarakat (PKM) Universitas Pamulang mengadakan pelatihan Microsoft Excel bagi siswa SMAN 12 Tangsel untuk meningkatkan keahlian digital.",
    konten: "Tim Pengabdian Kepada Masyarakat (PKM) dari Universitas Pamulang menyelenggarakan pelatihan praktis Microsoft Excel bagi siswa-siswi di SMAN 12 Tangerang Selatan pada 17 Oktober 2024. Bertajuk 'Bikin Siswa SMAN 12 Tangsel Jago Excel dalam Sekejap!', pelatihan ini memfokuskan pada penguasaan rumus-rumus penting (seperti VLOOKUP, HLOOKUP, IF statement), pengelolaan database sederhana, serta visualisasi data menggunakan grafik. Pelatihan ini diharapkan dapat meningkatkan keahlian digital siswa untuk bekal menghadapi dunia perguruan tinggi maupun kerja.",
    thumbnail: "/images/news/pkm_unpam_excel.png",
    status: "published",
    created_at: "2024-10-22",
    tags: "Excel, Pelatihan, Universitas Pamulang, PKM"
  },
  {
    id: 8,
    judul: "Edukasi Pemilih Pemula, Bawaslu Tangsel Gelar Roadshow Sosialisasi Pemilu di SMAN 12 Tangsel",
    slug: "edukasi-pemilih-pemula-bawaslu-tangsel-gelar-roadshow-sosialisasi-pemilu-di-sman-12-tangsel",
    kategori: "kegiatan",
    deskripsi: "Bawaslu Kota Tangerang Selatan mengadakan sosialisasi pengawasan partisipatif Pemilu menyasar siswa pemilih pemula di SMAN 12.",
    konten: "Bawaslu Kota Tangerang Selatan menyelenggarakan sosialisasi pengawasan partisipatif bertajuk 'Bawaslu Go To School' di SMAN 12 Kota Tangerang Selatan pada Jumat, 1 Maret 2019. Kegiatan sosialisasi ini bertujuan mengedukasi siswa SMA selaku pemilih pemula tentang mekanisme Pemilu, pentingnya menolak politik uang (money politics), serta mendorong keterlibatan aktif siswa dalam mengawasi jalannya Pemilu secara mandiri. Acara dikemas menarik dengan talkshow interaktif serta penampilan band akustik Monokrom yang membawakan jingle resmi Bawaslu.",
    thumbnail: "/images/news/bawaslu_go_to_school.png",
    status: "published",
    created_at: "2019-03-01",
    tags: "Bawaslu, Pemilu, Pemilih Pemula, Sosialisasi"
  }
];

const defaultPengumuman = [
  {
    id: 1,
    judul: "Pengumuman Kelulusan Kelas 12 2025/2026",
    status: "STATUS: DILAKSANAKAN",
    statusType: "published",
    tanggal: "2026-05-22"
  },
  {
    id: 2,
    judul: "Jadwal Pengambilan Ijazah dan Raport Semester Genap",
    status: "STATUS: MEI 2026",
    statusType: "scheduled",
    tanggal: "2026-05-18"
  },
  {
    id: 3,
    judul: "Ketentuan Penggunaan Seragam dan Aturan Akademik Baru",
    status: "SEGERA",
    statusType: "upcoming",
    tanggal: "2026-05-10"
  },
  {
    id: 4,
    judul: "Undangan Rapat Komite Orang Tua Siswa Kelas X",
    status: "ARSIP",
    statusType: "archive",
    tanggal: "2026-04-15"
  }
];

const defaultGaleri = [
  {
    id: 1,
    judul: "Gedung Sekolah SMAN 12",
    kategori: "Fasilitas",
    gambar: "https://sman12kotatangsel.sch.id/wp-content/uploads/2021/08/cropped-cropped-Front1.jpg"
  },
  {
    id: 2,
    judul: "Kegiatan Masa Pengenalan Lingkungan Sekolah (MPLS)",
    kategori: "Umum",
    gambar: "https://sman12kotatangsel.sch.id/wp-content/uploads/2024/07/BANNER-MPLS-1-scaled.jpg"
  },
  {
    id: 3,
    judul: "Layanan & Konsultasi Bimbingan Konseling (BK)",
    kategori: "Akademik",
    gambar: "https://sman12kotatangsel.sch.id/wp-content/uploads/2022/12/Guru-BK-Sahabat-Siswa.jpeg"
  },
  {
    id: 4,
    judul: "Pengumuman Siswa Lolos SNBP PTN",
    kategori: "Prestasi",
    gambar: "https://sman12kotatangsel.sch.id/wp-content/uploads/2024/06/SNBP-2024-1-1-1024x803.png"
  },
  {
    id: 5,
    judul: "Kegiatan Pembelajaran & Praktik Siswa",
    kategori: "Akademik",
    gambar: "https://sman12kotatangsel.sch.id/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-22-at-14.20.59.jpeg"
  },
  {
    id: 6,
    judul: "Sosialisasi Program Kerja Kesiswaan SMAN 12",
    kategori: "Umum",
    gambar: "https://sman12kotatangsel.sch.id/wp-content/uploads/2022/12/WhatsApp-Image-2022-12-09-at-14.38.02.jpeg"
  }
];

const defaultPengaturan = {
  namaSekolah: "SMAN 12 KOTA TANGERANG SELATAN",
  tagline: "I AM THE BEST, YOU'RE THE BEST WE ARE THE BEST, DUBES IS THE BEST",
  alamat: "Jl. Raya Cilenggang I No. 1, Cilenggang, Kec. Serpong, Kota Tangerang Selatan, Banten 15310",
  telepon: "(021) 7654321",
  email: "info@sman12tangsel.sch.id",
  kepalaSekolah: "Rokhmat Hidayat, S.Pd., MM",
  nipKepalaSekolah: "19740512 200003 1 002",
  fotoKepalaSekolah: "/images/KEPALA SEKOLAH.jpeg",
  sambutanKepalaSekolah: [
    "Puji syukur kita panjatkan kehadirat Allah SWT, karena berkat rahmat dan karunia-Nya, kita semua diberikan kesehatan dan kesempatan untuk terus berkarya. Di kesempatan yang berbahagia ini, saya ingin menyampaikan sambutan singkat kepada seluruh civitas akademika SMAN 12 Kota Tangerang Selatan, serta para orang tua dan masyarakat yang mendukung perjalanan sekolah ini.",
    "Sebagai Kepala SMAN 12 Kota Tangerang Selatan, saya merasa sangat terhormat dapat memimpin sekolah yang penuh dengan semangat, prestasi, dan dedikasi tinggi dalam mencetak generasi muda yang berkarakter, berprestasi, serta siap menghadapi tantangan global. Kami berkomitmen untuk terus meningkatkan kualitas pendidikan yang kami berikan, baik dalam hal akademik, non-akademik, maupun pengembangan karakter siswa.",
    "Sekolah kami selalu berusaha menciptakan lingkungan yang mendukung pertumbuhan siswa yang tidak hanya cerdas dalam ilmu pengetahuan, tetapi juga berbudi pekerti yang luhur. Dengan dukungan penuh dari seluruh guru, tenaga kependidikan, serta orang tua, kami yakin SMAN 12 Kota Tangerang Selatan akan terus berkembang menjadi sekolah unggulan yang dapat diandalkan dalam mencetak generasi penerus bangsa.",
    "Kami juga sangat menghargai partisipasi masyarakat dan para alumni dalam setiap kegiatan yang kami lakukan. Tanpa kerja sama yang baik, tentu prestasi yang kita capai bersama tidak akan bisa diraih. Saya berharap semoga kita semua dapat terus bekerja sama untuk menjadikan SMAN 12 Kota Tangerang Selatan sebagai sekolah yang mampu menghasilkan lulusan terbaik yang siap berkontribusi untuk kemajuan bangsa dan negara.",
    "Demikian sambutan dari saya, semoga Allah SWT senantiasa memberikan petunjuk dan keberkahan dalam setiap langkah kita. Mari kita jaga semangat kebersamaan dan terus berinovasi demi masa depan yang lebih baik."
  ]
};

const defaultPrestasiSiswa = [
  {
    id: 1,
    nama: 'Almirah Tsabitah',
    prestasi: 'Juara 3 Taekwondo Internasional (IISTC 3)',
    level: 'Tingkat Internasional 2025',
    badge: 'Internasional',
    badgeColor: 'bg-red-600'
  },
  {
    id: 2,
    nama: 'Ronald Ricky Candra',
    prestasi: 'Juara 1 Pencak Silat Tingkat Nasional (TAPCHA 7)',
    level: 'Tingkat Nasional 2025',
    badge: 'Nasional',
    badgeColor: 'bg-orange-500'
  },
  {
    id: 3,
    nama: 'Zaina Zulfa Ajjaurah',
    prestasi: 'Juara 1 Pencak Silat Tingkat Nasional (TAPCHA 7)',
    level: 'Tingkat Nasional 2025',
    badge: 'Nasional',
    badgeColor: 'bg-orange-500'
  },
  {
    id: 4,
    nama: 'Graciana Retta S. L. & Tim',
    prestasi: 'Juara 1 Debat Bahasa Indonesia (Wonderkind Festival)',
    level: 'Tingkat Regional 2026',
    badge: 'Regional',
    badgeColor: 'bg-blue-600'
  },
  {
    id: 5,
    nama: 'Adhit Ramadhan',
    prestasi: 'Juara 1 Taekwondo Internasional (IISTC 3)',
    level: 'Tingkat Internasional 2025',
    badge: 'Internasional',
    badgeColor: 'bg-red-600'
  },
  {
    id: 6,
    nama: 'Mazaya Aliya M. S.',
    prestasi: 'Juara 1 Taekwondo Internasional (IISTC 3)',
    level: 'Tingkat Internasional 2025',
    badge: 'Internasional',
    badgeColor: 'bg-red-600'
  },
  {
    id: 7,
    nama: 'Evelyna Vivian Wedyawati',
    prestasi: 'Juara 1 Pencak Silat Tingkat Nasional (TAPCHA 7)',
    level: 'Tingkat Nasional 2025',
    badge: 'Nasional',
    badgeColor: 'bg-orange-500'
  },
  {
    id: 8,
    nama: 'Aiko Yulistya & Tim',
    prestasi: 'Juara 1 Voli Putri (Neivtars Cup)',
    level: 'Tingkat Regional 2025',
    badge: 'Regional',
    badgeColor: 'bg-blue-600'
  }
];

const defaultDokumen = [
  {
    id: 1,
    judul: 'Formulir Pendaftaran Ulang PPDB 2026',
    deskripsi: 'Formulir resmi untuk pendaftaran ulang calon peserta didik baru SMAN 12 Kota Tangerang Selatan tahun ajaran 2026/2027.',
    file_path: '/uploads/dokumen-dummy.pdf',
    tipe: 'formulir',
    ukuran_file: 345200,
    created_at: '2026-05-10'
  },
  {
    id: 2,
    judul: 'Surat Keputusan Kelulusan Kelas XII TA 2025/2026',
    deskripsi: 'Surat keputusan kepala sekolah mengenai penetapan kelulusan siswa kelas XII SMAN 12 Kota Tangerang Selatan.',
    file_path: '/uploads/dokumen-dummy.pdf',
    tipe: 'surat',
    ukuran_file: 512000,
    created_at: '2026-05-22'
  },
  {
    id: 3,
    judul: 'Kalender Akademik SMAN 12 TA 2025/2026',
    deskripsi: 'Kalender akademik resmi SMAN 12 Kota Tangerang Selatan yang berisi jadwal KBM, hari libur, dan agenda penting sekolah.',
    file_path: '/uploads/dokumen-dummy.pdf',
    tipe: 'pengumuman',
    ukuran_file: 1048576,
    created_at: '2025-07-01'
  }
];

const defaultPointRules = [
  // Pelanggaran Ringan (PR)
  { id: 1, kode: "PR. 1", nama: "Berperilaku tidak sopan/santun, baik ucapan maupun tindakan terhadap warga sekolah.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 5 },
  { id: 2, kode: "PR. 2", nama: "Tidak menjaga kebersihan lingkungan sekolah.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 5 },
  { id: 3, kode: "PR. 3", nama: "Menggunakan HP atau alat elektronik lainnya saat KBM tanpa seizin guru.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 5 },
  { id: 4, kode: "PR. 4", nama: "Tidak memakai seragam sesuai tata tertib sekolah.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 5 },
  { id: 5, kode: "PR. 5", nama: "Datang terlambat di sekolah tanpa konfirmasi dari orang tua.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 5 },
  { id: 6, kode: "PR. 6", nama: "Meninggalkan jam pelajaran tanpa seizin guru.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 10 },
  { id: 7, kode: "PR. 7", nama: "Tidak hadir tanpa keterangan.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 10 },
  { id: 8, kode: "PR. 8", nama: "Memakai sepatu berwarna selain hitam.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 10 },
  { id: 9, kode: "PR. 9", nama: "Main kartu di lingkungan sekolah (remi, domino & kartu judi lainnya).", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 10 },
  { id: 10, kode: "PR. 10", nama: "Memakai celana model pensil atau ketat.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 10 },
  { id: 11, kode: "PR. 11", nama: "Berambut gondrong (melebihi alis, telinga, dan kerah baju) untuk laki-laki.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 10 },
  { id: 12, kode: "PR. 12", nama: "Berpakaian (memakai baju dan rok) ketat untuk perempuan.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 10 },
  { id: 13, kode: "PR. 13", nama: "Bermain bola pada saat jam pelajaran kecuali jam pelajaran olahraga.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 10 },
  { id: 14, kode: "PR. 14", nama: "Memakai anting/tindak, gelang, dan kalung bagi laki-laki.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 10 },
  { id: 15, kode: "PR. 15", nama: "Mewarnai rambut dan kuku.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 10 },
  { id: 16, kode: "PR. 16", nama: "Memakai make up dan atau perhiasan berlebihan.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 10 },
  { id: 17, kode: "PR. 17", nama: "Merayakan ulang tahun secara berlebihan yang dapat menganggu ketertiban dan keamanan di lingkungan sekolah.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 10 },
  { id: 18, kode: "PR. 18", nama: "Tidak tertib saat melaksanakan kegiatan sekolah.", kategori: "Pelanggaran Ringan", tipe: "negative", poin: 15 },

  // Pelanggaran Sedang (PS)
  { id: 19, kode: "PS. 1", nama: "Memberi keterangan tidak benar atau palsu, membuat dan atau mengedarkan surat palsu, memalsukan tandatangan (orang tua/wali, kepala sekolah, guru, karyawan Tata Usaha dan pihak lain) untuk kepentingan tertentu.", kategori: "Pelanggaran Sedang", tipe: "negative", poin: 30 },
  { id: 20, kode: "PS. 2", nama: "Melakukan demonstrasi tanpa izin di dalam maupun di luar lingkungan sekolah.", kategori: "Pelanggaran Sedang", tipe: "negative", poin: 30 },
  { id: 21, kode: "PS. 3", nama: "Tidak mengikuti upacara bendera setiap hari Senin dan atau upacara peringatan hari-hari besar Nasional tanpa seizin orang tua dan pihak sekolah.", kategori: "Pelanggaran Sedang", tipe: "negative", poin: 30 },
  { id: 22, kode: "PS. 4", nama: "Tidak mengikuti kegiatan keagamaan dan peringatan hari-hari besar keagamaan yang diselenggarakan sekolah tanpa seizin orang tua dan pihak sekolah.", kategori: "Pelanggaran Sedang", tipe: "negative", poin: 30 },
  { id: 23, kode: "PS. 5", nama: "Berkumpul/nongkrong di sekitar lingkungan sekolah dengan radius 1 km memakai seragam atau atribut sekolah dengan disertai tindakan yang melanggar tata tertib sekolah.", kategori: "Pelanggaran Sedang", tipe: "negative", poin: 30 },
  { id: 24, kode: "PS. 6", nama: "Pelecehan seksual secara verbal terhadap lawan jenis atau sesama jenis.", kategori: "Pelanggaran Sedang", tipe: "negative", poin: 30 },
  { id: 25, kode: "PS. 7", nama: "Merusak sarana prasarana sekolah yang mengakibatkan kerusakan ringan.", kategori: "Pelanggaran Sedang", tipe: "negative", poin: 30 },

  // Pelanggaran Berat (PB)
  { id: 26, kode: "PB. 1", nama: "Menyebarkan informasi bohong atau fitnah dalam bentuk apapun yang dapat menimbulkan keresahan sosial dan pertikaian antar pelajar maupun masyarakat luas.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 50 },
  { id: 27, kode: "PB. 2", nama: "Mencemarkan nama baik guru, karyawan sekolah dalam bentuk apapun.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 50 },
  { id: 28, kode: "PB. 3", nama: "Membawa alat kontrasepsi dan sejenisnya.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 50 },
  { id: 29, kode: "PB. 4", nama: "Menjadi pengurus, anggota, simpatisan berbagai organisasi diluar OSIS dan MPK tanpa seizin pihak sekolah.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 55 },
  { id: 30, kode: "PB. 5", nama: "Memprovokasi tindakan yang dapat mengganggu keamanan dan ketertiban sekolah.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 55 },
  { id: 31, kode: "PB. 6", nama: "Membawa rokok dan vape, serta merokok dan menggunakan vape di sekolah.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 55 },
  { id: 32, kode: "PB. 7", nama: "Melakukan ancaman, terror, bullying pada warga sekolah.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 55 },
  { id: 33, kode: "PB. 8", nama: "Merusak sarana prasarana sekolah yang mengakibatkan kerusakan berat.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 65 },
  { id: 34, kode: "PB. 9", nama: "Melakukan tindakan vandalisme (merusak, menghancurkan karya seni dan benda berharga lainnya sehingga mengurangi/menghilangkan keindahan sarana prasarana sekolah).", kategori: "Pelanggaran Berat", tipe: "negative", poin: 65 },
  { id: 35, kode: "PB. 10", nama: "Merajah bagian tubuh (tato).", kategori: "Pelanggaran Berat", tipe: "negative", poin: 75 },
  { id: 36, kode: "PB. 11", nama: "Pacaran berlebihan.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 75 },
  { id: 37, kode: "PB. 12", nama: "Melakukan pelecehan seksual secara fisik terhadap lawan jenis atau sesama jenis.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 75 },
  { id: 38, kode: "PB. 13", nama: "Melompat pagar dan atau jendela sekolah.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 75 },
  { id: 39, kode: "PB. 14", nama: "Membawa dan atau meminum minuman keras serta masuk sekolah dalam kondisi mabuk.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 75 },
  { id: 40, kode: "PB. 15", nama: "Berjudi di dalam lingkungan sekolah dan di luar lingkungan sekolah.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 75 },
  { id: 41, kode: "PB. 16", nama: "Melawan kepala sekolah, guru, dan pegawai dalam bentuk apapun.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 75 },
  { id: 42, kode: "PB. 17", nama: "Melakukan perkelahian satu lawan satu atau lebih.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 75 },
  { id: 43, kode: "PB. 18", nama: "Memprovokasi tindakan yang dapat mencemarkan nama baik sekolah.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 75 },
  { id: 44, kode: "PB. 19", nama: "Melakukan tindakan pornografi dan atau pornoaksi yang dianggap tidak wajar dan berlebihan bagi peserta didik, baik di lingkungan sekolah maupun di luar lingkungan sekolah.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 75 },
  { id: 45, kode: "PB. 20", nama: "Mencuri atau mengambil uang/barang berharga milik orang lain atau sekolah.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 100 },
  { id: 46, kode: "PB. 21", nama: "Melakukan tindakan kekerasan terhadap warga sekolah.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 100 },
  { id: 47, kode: "PB. 22", nama: "Membawa dan atau menggunakan senjata tajam, senjata api dan alat-alat yang dapat membahayakan keselamatan orang lain tanpa seizin pihak sekolah.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 100 },
  { id: 48, kode: "PB. 23", nama: "Melakukan tawuran antar pelajar dan atau sesama pelajar satu sekolah.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 100 },
  { id: 49, kode: "PB. 24", nama: "Terbukti hamil atau menghamili.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 100 },
  { id: 50, kode: "PB. 25", nama: "Terbukti telah menikah dan atau telah melakukan hubungan badan dengan bukti yang sudah terkonfirmasi kebenarannya.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 100 },
  { id: 51, kode: "PB. 26", nama: "Membawa, menggunakan dan mengedarkan narkoba serta zat adiktif lainnya.", kategori: "Pelanggaran Berat", tipe: "negative", poin: 100 },

  // Standar Prestasi (PRST)
  { id: 52, kode: "PRST. 1", nama: "Juara I/II/III Lomba/Kegiatan Tingkat Kabupaten/Kota", kategori: "Penghargaan", tipe: "positive", poin: 20 },
  { id: 53, kode: "PRST. 2", nama: "Juara I/II/III Lomba/Kegiatan Tingkat Provinsi", kategori: "Penghargaan", tipe: "positive", poin: 30 },
  { id: 54, kode: "PRST. 3", nama: "Juara I/II/III Lomba/Kegiatan Tingkat Nasional", kategori: "Penghargaan", tipe: "positive", poin: 50 },
  { id: 55, kode: "PRST. 4", nama: "Juara I/II/III Lomba/Kegiatan Tingkat Internasional", kategori: "Penghargaan", tipe: "positive", poin: 75 },
  { id: 56, kode: "PRST. 5", nama: "Pengurus Aktif OSIS / MPK / Ekstrakurikuler dengan kinerja sangat baik", kategori: "Penghargaan", tipe: "positive", poin: 15 },
  { id: 57, kode: "PRST. 6", nama: "Menunjukkan kejujuran luar biasa (mengembalikan barang hilang/berharga)", kategori: "Penghargaan", tipe: "positive", poin: 15 },
  { id: 58, kode: "PRST. 7", nama: "Kehadiran penuh (100% absen) dalam satu semester", kategori: "Penghargaan", tipe: "positive", poin: 15 }
];

// ========================================
// Initializer Helper
// ========================================

const defaultSiswaPoin = [
  {
    nisn: '0012345678',
    name: 'Lucas Adiputra',
    kelas: 'XII MIPA 2',
    poin_pelanggaran: 5,
    poin_penghargaan: 45,
    status: 'Bebas Pelanggaran',
    passwordSiswa: 'siswa123',
    passwordOrangTua: 'ortu123'
  },
  {
    nisn: '0098765432',
    name: 'Rian Hidayat',
    kelas: 'XII MIPA 2',
    poin_pelanggaran: 15,
    poin_penghargaan: 0,
    status: 'Panggilan I',
    passwordSiswa: 'siswa123',
    passwordOrangTua: 'ortu123'
  },
  {
    nisn: '0087654321',
    name: 'Amelia Putri',
    kelas: 'XII MIPA 1',
    poin_pelanggaran: 0,
    poin_penghargaan: 25,
    status: 'Bebas Pelanggaran',
    passwordSiswa: 'siswa123',
    passwordOrangTua: 'ortu123'
  },
  {
    nisn: '0076543210',
    name: 'Fajar Pratama',
    kelas: 'XI MIPA 3',
    poin_pelanggaran: 28,
    poin_penghargaan: 0,
    status: 'Panggilan II',
    passwordSiswa: 'siswa123',
    passwordOrangTua: 'ortu123'
  }
];

const defaultRiwayatPoin = [
  {
    id: 1,
    nisn: '0012345678',
    tanggal: '2026-05-20',
    kategori: 'Penghargaan',
    keterangan: 'Juara 1 Lomba Karya Ilmiah Remaja (KIR) Tingkat Kota',
    poin: '+20 Poin',
    type: 'positive'
  },
  {
    id: 2,
    nisn: '0012345678',
    tanggal: '2026-05-18',
    kategori: 'Penghargaan',
    keterangan: 'Mengembalikan barang milik siswa lain yang tertinggal',
    poin: '+10 Poin',
    type: 'positive'
  },
  {
    id: 3,
    nisn: '0012345678',
    tanggal: '2026-05-12',
    kategori: 'Pelanggaran Ringan',
    keterangan: 'Terlambat masuk sekolah sesi pagi (lebih dari 15 menit)',
    poin: '+5 Poin',
    type: 'negative'
  },
  {
    id: 4,
    nisn: '0012345678',
    tanggal: '2026-05-05',
    kategori: 'Penghargaan',
    keterangan: 'Kehadiran penuh selama bulan April tanpa absen',
    poin: '+15 Poin',
    type: 'positive'
  }
];

const defaultSiswaNotifikasi = [
  {
    id: 1,
    nisn: '0012345678',
    tipe: 'warning',
    pesan: 'Perhatian: Lucas Adiputra menerima penambahan 5 poin pelanggaran untuk Kategori Pelanggaran Ringan (Terlambat masuk sekolah) pada 12 Mei 2026.',
    waktu: '10 jam yang lalu',
    dibaca: false
  },
  {
    id: 2,
    nisn: '0012345678',
    tipe: 'success',
    pesan: 'Selamat! Lucas Adiputra mendapatkan tambahan 20 poin Penghargaan atas Lomba Karya Ilmiah Remaja (KIR) Tingkat Kota pada 20 Mei 2026.',
    waktu: '2 hari yang lalu',
    dibaca: false
  },
  {
    id: 3,
    nisn: '0012345678',
    tipe: 'info',
    pesan: 'Undangan: Rapat rutin komite sekolah dan pembagian laporan poin tengah semester pada Sabtu, 30 Mei 2026 pukul 09:00 WIB.',
    waktu: '3 hari yang lalu',
    dibaca: true
  }
];

const defaultPesanBk = [
  {
    id: 1,
    nisn: '0012345678',
    namaOrangTua: 'Bapak Hermawan',
    namaSiswa: 'Lucas Adiputra',
    kelas: 'XII MIPA 2',
    pesan: 'Mohon info mengenai rincian keterlambatan Lucas pada tanggal 12 Mei. Apakah dia terlambat karena macet atau ada alasan lain?',
    tanggal: '2026-05-21',
    dibalas: false,
    balasan: ''
  }
];

const initStore = () => {
  // Clear any existing PPDB key in local storage to keep it clean
  localStorage.removeItem("sman12_ppdb");

  // Migration: Reset local storage for 100-base deduction system v2
  if (!localStorage.getItem("sman12_points_v2_100base")) {
    console.log("Migrating points system to 100-base deduction system.");
    localStorage.removeItem("sman12_siswa_poin");
    localStorage.removeItem("sman12_riwayat_poin");
    localStorage.removeItem("sman12_siswa_notifikasi");
    localStorage.removeItem("sman12_pesan_bk");
    localStorage.setItem("sman12_points_v2_100base", "true");
  }

  // Migration: Check for old point schema (presence of 'points' in student data, or old categories in point rules)
  let oldSchemaDetected = false;
  const oldSiswaPoin = localStorage.getItem("sman12_siswa_poin");
  if (oldSiswaPoin) {
    try {
      const parsedSiswa = JSON.parse(oldSiswaPoin);
      if (Array.isArray(parsedSiswa) && parsedSiswa.length > 0) {
        // If the first student has a 'points' property instead of 'poin_pelanggaran', or lacks 'poin_pelanggaran'
        if ('points' in parsedSiswa[0] || !('poin_pelanggaran' in parsedSiswa[0])) {
          oldSchemaDetected = true;
        }
      }
    } catch (e) {
      oldSchemaDetected = true;
    }
  }

  const oldPointRules = localStorage.getItem("sman12_point_rules");
  if (oldPointRules) {
    try {
      const parsedRules = JSON.parse(oldPointRules);
      if (Array.isArray(parsedRules) && parsedRules.length > 0) {
        // If there's a category like "Disiplin", "Integritas", or "Prestasi" (old names)
        const hasOldCategories = parsedRules.some(r => r.kategori === 'Disiplin' || r.kategori === 'Integritas' || r.kategori === 'Prestasi');
        if (hasOldCategories) {
          oldSchemaDetected = true;
        }
      }
    } catch (e) {
      oldSchemaDetected = true;
    }
  }

  if (oldSchemaDetected) {
    console.log("Old schema detected in local storage. Performing migration reset.");
    localStorage.removeItem("sman12_siswa_poin");
    localStorage.removeItem("sman12_riwayat_poin");
    localStorage.removeItem("sman12_siswa_notifikasi");
    localStorage.removeItem("sman12_point_rules");
  }

  // Migration: Remove any PPDB news from existing local storage
  if (localStorage.getItem("sman12_berita")) {
    try {
      const currentBerita = JSON.parse(localStorage.getItem("sman12_berita"));
      const filteredBerita = currentBerita.filter(b => !b.judul.includes("PPDB") && b.id !== 6);
      if (currentBerita.length !== filteredBerita.length) {
        localStorage.setItem("sman12_berita", JSON.stringify(filteredBerita));
      }
    } catch (e) {
      console.error("Failed to migrate sman12_berita:", e);
    }
  }

  const currentBerita = localStorage.getItem("sman12_berita");
  let needsReset = !currentBerita;
  if (currentBerita) {
    try {
      const parsed = JSON.parse(currentBerita);
      needsReset = parsed.length < 8 || parsed.some(b => b.judul.includes("MNC Bank") || b.judul.includes("KIR Tingkat Kota") || b.judul.includes("Pelepasan dan Wisuda") || (b.thumbnail && b.thumbnail.startsWith("data:image/svg+xml")) || b.created_at === "2026-05-18");
    } catch (e) {
      needsReset = true;
    }
  }
  if (needsReset) {
    localStorage.setItem("sman12_berita", JSON.stringify(defaultBerita));
  }
  if (!localStorage.getItem("sman12_pengumuman")) {
    localStorage.setItem("sman12_pengumuman", JSON.stringify(defaultPengumuman));
  }
  const currentGaleri = localStorage.getItem("sman12_galeri");
  let galeriNeedsReset = !currentGaleri;
  if (currentGaleri) {
    try {
      const parsedG = JSON.parse(currentGaleri);
      galeriNeedsReset = parsedG.some(g => g.gambar && g.gambar.startsWith("data:image/svg+xml"));
    } catch (e) {
      galeriNeedsReset = true;
    }
  }
  if (galeriNeedsReset) {
    localStorage.setItem("sman12_galeri", JSON.stringify(defaultGaleri));
  }
  if (!localStorage.getItem("sman12_pesan")) {
    localStorage.setItem("sman12_pesan", JSON.stringify([]));
  }
  const storedConfig = localStorage.getItem("sman12_pengaturan");
  let configNeedsReset = !storedConfig;
  if (storedConfig) {
    try {
      const parsed = JSON.parse(storedConfig);
      if (parsed.alamat && parsed.alamat.includes("Jl. Pendidikan")) {
        configNeedsReset = true;
      }
    } catch (e) {
      configNeedsReset = true;
    }
  }
  if (configNeedsReset) {
    localStorage.setItem("sman12_pengaturan", JSON.stringify(defaultPengaturan));
  }
  if (!localStorage.getItem("sman12_siswa_poin")) {
    localStorage.setItem("sman12_siswa_poin", JSON.stringify(defaultSiswaPoin));
  }
  if (!localStorage.getItem("sman12_riwayat_poin")) {
    localStorage.setItem("sman12_riwayat_poin", JSON.stringify(defaultRiwayatPoin));
  }
  if (!localStorage.getItem("sman12_siswa_notifikasi")) {
    localStorage.setItem("sman12_siswa_notifikasi", JSON.stringify(defaultSiswaNotifikasi));
  }
  if (!localStorage.getItem("sman12_pesan_bk")) {
    localStorage.setItem("sman12_pesan_bk", JSON.stringify(defaultPesanBk));
  }
  const currentPrestasi = localStorage.getItem("sman12_prestasi_siswa");
  if (!currentPrestasi || JSON.parse(currentPrestasi).length <= 1 || JSON.parse(currentPrestasi).length === 12) {
    localStorage.setItem("sman12_prestasi_siswa", JSON.stringify(defaultPrestasiSiswa));
  }
  if (!localStorage.getItem("sman12_dokumen")) {
    localStorage.setItem("sman12_dokumen", JSON.stringify(defaultDokumen));
  }
  if (!localStorage.getItem("sman12_point_rules")) {
    localStorage.setItem("sman12_point_rules", JSON.stringify(defaultPointRules));
  }
};

initStore();

// ========================================
// Store Operations API
// ========================================

export const localStore = {
  // Point Rules & Pembinaan
  getPointRules: () => {
    return JSON.parse(localStorage.getItem("sman12_point_rules") || JSON.stringify(defaultPointRules));
  },
  getViolationPoints: (nisn) => {
    const riwayat = JSON.parse(localStorage.getItem("sman12_riwayat_poin") || "[]");
    return riwayat
      .filter(r => r.nisn === nisn && r.type === 'negative')
      .reduce((sum, r) => {
        const pts = parseInt(r.poin.replace(/[^0-9]/g, ''));
        return sum + (isNaN(pts) ? 0 : pts);
      }, 0);
  },
  getLangkahPembinaan: (netViolationPoints) => {
    if (netViolationPoints <= 0) return { tahap: 'Bebas Pelanggaran', pembina: '-', tindakan: 'Tidak ada tindakan pelanggaran.' };
    if (netViolationPoints <= 20) {
      return {
        tahap: 'Panggilan I (Proses 1)',
        pembina: 'Guru, Wali Kelas',
        tindakan: '1. Teguran oleh guru dan dikomunikasikan kepada piket\n2. Setiap temuan pelanggaran tatib siswa dicatat pada Kartu Siswa oleh piket dan ditanda tangani oleh walikelas dan orang tua.\n3. Dikomunikasikan kepada wali kelas'
      };
    }
    if (netViolationPoints <= 40) {
      return {
        tahap: 'Panggilan II (Proses 2)',
        pembina: 'Wali Kelas, Bimbingan Konseling',
        tindakan: '1. Pembinaan wali kelas dari poin terendah\n2. Undang orang tua secara lisan. Bersama tim kesiswaan berkomunikasi dengan orang tua untuk menemukan solusi\n3. Diberikan PERINGATAN 1'
      };
    }
    if (netViolationPoints <= 60) {
      return {
        tahap: 'Panggilan III (Proses 3)',
        pembina: 'Bimbingan Konseling, Wali Kelas',
        tindakan: '1. Pembinaan oleh Bimbingan Konseling dari poin terendah\n2. Dimungkinkan home visit oleh Bimbingan Konseling dan Wali Kelas\n3. Siswa membuat pernyataan ditanda tangani orang tua dan bermaterai\n4. Diberikan PERINGATAN 2'
      };
    }
    if (netViolationPoints <= 95) {
      return {
        tahap: 'Panggilan IV (Proses 4)',
        pembina: 'Bimbingan Konseling, Wakasek Kesiswaan',
        tindakan: '1. Pembinaan oleh Bimbingan Konseling dari poin terendah\n2. Panggilan resmi orang tua menghadap Bimbingan Konseling dan Wakasek Kesiswaan\n3. Siswa membuat pernyataan ditanda tangani orang tua dan bermaterai\n4. Diberi PERINGATAN 3'
      };
    }
    return {
      tahap: 'Panggilan Terakhir (Proses 5)',
      pembina: 'Bimbingan Konseling, Wakasek Kesiswaan, Kepala Sekolah',
      tindakan: '1. Panggilan resmi orang tua oleh sekolah\n2. Gelar perkara dengan menghadirkan guru dan wali kelas\n3. Dikembalikan ke orang tua'
    };
  },
  getSisaPoin: (nisn) => {
    const student = localStore.getSiswaByNisn(nisn);
    if (!student) return 100;
    return Math.max(0, Math.min(100, 100 - (student.poin_pelanggaran || 0) + (student.poin_penghargaan || 0)));
  },
  getNetViolationPoints: (nisn) => {
    const student = localStore.getSiswaByNisn(nisn);
    if (!student) return 0;
    return Math.max(0, (student.poin_pelanggaran || 0) - (student.poin_penghargaan || 0));
  },

  // Berita
  getBerita: () => {
    return JSON.parse(localStorage.getItem("sman12_berita") || "[]");
  },
  getBeritaById: (id) => {
    const list = JSON.parse(localStorage.getItem("sman12_berita") || "[]");
    return list.find((item) => item.id === parseInt(id));
  },
  saveBerita: (data) => {
    const list = JSON.parse(localStorage.getItem("sman12_berita") || "[]");
    if (data.id) {
      const idx = list.findIndex((item) => item.id === parseInt(data.id));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data, id: parseInt(data.id) };
      }
    } else {
      const newId = list.length > 0 ? Math.max(...list.map((o) => o.id)) + 1 : 1;
      const slug = data.judul.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      list.unshift({
        ...data,
        id: newId,
        slug,
        created_at: new Date().toISOString().split("T")[0]
      });
    }
    localStorage.setItem("sman12_berita", JSON.stringify(list));
  },
  deleteBerita: (id) => {
    const list = JSON.parse(localStorage.getItem("sman12_berita") || "[]");
    const filtered = list.filter((item) => item.id !== parseInt(id));
    localStorage.setItem("sman12_berita", JSON.stringify(filtered));
  },

  // Pengumuman
  getPengumuman: () => {
    return JSON.parse(localStorage.getItem("sman12_pengumuman") || "[]");
  },
  savePengumuman: (data) => {
    const list = JSON.parse(localStorage.getItem("sman12_pengumuman") || "[]");
    if (data.id) {
      const idx = list.findIndex((item) => item.id === parseInt(data.id));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data, id: parseInt(data.id) };
      }
    } else {
      const newId = list.length > 0 ? Math.max(...list.map((o) => o.id)) + 1 : 1;
      list.unshift({
        ...data,
        id: newId,
        tanggal: new Date().toISOString().split("T")[0]
      });
    }
    localStorage.setItem("sman12_pengumuman", JSON.stringify(list));
  },
  deletePengumuman: (id) => {
    const list = JSON.parse(localStorage.getItem("sman12_pengumuman") || "[]");
    const filtered = list.filter((item) => item.id !== parseInt(id));
    localStorage.setItem("sman12_pengumuman", JSON.stringify(filtered));
  },

  // Galeri
  getGaleri: () => {
    return JSON.parse(localStorage.getItem("sman12_galeri") || "[]");
  },
  saveGaleri: (data) => {
    const list = JSON.parse(localStorage.getItem("sman12_galeri") || "[]");
    const newId = list.length > 0 ? Math.max(...list.map((o) => o.id)) + 1 : 1;
    list.unshift({
      ...data,
      id: newId
    });
    localStorage.setItem("sman12_galeri", JSON.stringify(list));
  },
  deleteGaleri: (id) => {
    const list = JSON.parse(localStorage.getItem("sman12_galeri") || "[]");
    const filtered = list.filter((item) => item.id !== parseInt(id));
    localStorage.setItem("sman12_galeri", JSON.stringify(filtered));
  },


  // Pesan
  getPesan: () => {
    return JSON.parse(localStorage.getItem("sman12_pesan") || "[]");
  },
  savePesan: (data) => {
    const list = JSON.parse(localStorage.getItem("sman12_pesan") || "[]");
    const newId = list.length > 0 ? Math.max(...list.map((o) => o.id)) + 1 : 1;
    list.unshift({
      ...data,
      id: newId,
      tanggal: new Date().toISOString().split("T")[0]
    });
    localStorage.setItem("sman12_pesan", JSON.stringify(list));
  },
  deletePesan: (id) => {
    const list = JSON.parse(localStorage.getItem("sman12_pesan") || "[]");
    const filtered = list.filter((item) => item.id !== parseInt(id));
    localStorage.setItem("sman12_pesan", JSON.stringify(filtered));
  },

  // Pengaturan
  getPengaturan: () => {
    return JSON.parse(localStorage.getItem("sman12_pengaturan") || JSON.stringify(defaultPengaturan));
  },
  savePengaturan: (data) => {
    localStorage.setItem("sman12_pengaturan", JSON.stringify(data));
  },

  // ====== Siswa & Poin ======
  getSiswa: () => {
    return JSON.parse(localStorage.getItem("sman12_siswa_poin") || "[]");
  },
  getSiswaByNisn: (nisn) => {
    const list = JSON.parse(localStorage.getItem("sman12_siswa_poin") || "[]");
    return list.find((item) => item.nisn === nisn);
  },
  saveSiswa: (data) => {
    const list = JSON.parse(localStorage.getItem("sman12_siswa_poin") || "[]");
    const idx = list.findIndex((item) => item.nisn === data.nisn);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
    } else {
      list.push({ 
        ...data, 
        poin_pelanggaran: 0, 
        poin_penghargaan: 0, 
        status: 'Bebas Pelanggaran',
        passwordSiswa: data.passwordSiswa || 'siswa123',
        passwordOrangTua: data.passwordOrangTua || 'ortu123'
      });
    }
    localStorage.setItem("sman12_siswa_poin", JSON.stringify(list));
  },
  deleteSiswa: (nisn) => {
    const list = JSON.parse(localStorage.getItem("sman12_siswa_poin") || "[]");
    const filtered = list.filter((item) => item.nisn !== nisn);
    localStorage.setItem("sman12_siswa_poin", JSON.stringify(filtered));

    const riwayat = JSON.parse(localStorage.getItem("sman12_riwayat_poin") || "[]");
    const filteredRiwayat = riwayat.filter((item) => item.nisn !== nisn);
    localStorage.setItem("sman12_riwayat_poin", JSON.stringify(filteredRiwayat));

    const notif = JSON.parse(localStorage.getItem("sman12_siswa_notifikasi") || "[]");
    const filteredNotif = notif.filter((item) => item.nisn !== nisn);
    localStorage.setItem("sman12_siswa_notifikasi", JSON.stringify(filteredNotif));

    const pesan = JSON.parse(localStorage.getItem("sman12_pesan_bk") || "[]");
    const filteredPesan = pesan.filter((item) => item.nisn !== nisn);
    localStorage.setItem("sman12_pesan_bk", JSON.stringify(filteredPesan));
  },
  updateSiswaPoin: (nisn, kategori, jumlah, tipe, keterangan) => {
    const list = JSON.parse(localStorage.getItem("sman12_siswa_poin") || "[]");
    const idx = list.findIndex((item) => item.nisn === nisn);
    if (idx !== -1) {
      const student = list[idx];
      const delta = parseInt(jumlah);
      
      let pPelanggaran = student.poin_pelanggaran || 0;
      let pPenghargaan = student.poin_penghargaan || 0;
      
      const lowerKat = kategori.toLowerCase();
      if (lowerKat === 'penghargaan' || tipe === 'positive') {
        pPenghargaan += delta;
      } else {
        pPelanggaran += delta;
      }
      
      let newStatus = 'Bebas Pelanggaran';
      const netViolation = Math.max(0, pPelanggaran - pPenghargaan);
      const sisaPoin = Math.max(0, Math.min(100, 100 - netViolation));
      
      if (sisaPoin === 100) newStatus = 'Bebas Pelanggaran';
      else if (sisaPoin >= 80) newStatus = 'Panggilan I';
      else if (sisaPoin >= 60) newStatus = 'Panggilan II';
      else if (sisaPoin >= 40) newStatus = 'Panggilan III';
      else if (sisaPoin >= 5) newStatus = 'Panggilan IV';
      else newStatus = 'Panggilan Terakhir';

      list[idx] = {
        ...student,
        poin_pelanggaran: pPelanggaran,
        poin_penghargaan: pPenghargaan,
        status: newStatus
      };
      
      localStorage.setItem("sman12_siswa_poin", JSON.stringify(list));

      const riwayat = JSON.parse(localStorage.getItem("sman12_riwayat_poin") || "[]");
      const newId = riwayat.length > 0 ? Math.max(...riwayat.map(r => r.id)) + 1 : 1;
      const formattedPoin = '+' + delta + ' Poin';
      
      riwayat.unshift({
        id: newId,
        nisn: nisn,
        tanggal: new Date().toISOString().split("T")[0],
        kategori: kategori,
        keterangan: keterangan,
        poin: formattedPoin,
        type: tipe
      });
      localStorage.setItem("sman12_riwayat_poin", JSON.stringify(riwayat));

      const notif = JSON.parse(localStorage.getItem("sman12_siswa_notifikasi") || "[]");
      const newNotifId = notif.length > 0 ? Math.max(...notif.map(n => n.id)) + 1 : 1;
      const notifType = tipe === 'positive' ? 'success' : 'warning';
      const msg = tipe === 'positive'
        ? `Selamat! ${student.name} mendapatkan tambahan ${delta} poin Penghargaan atas ${keterangan} pada tanggal ${new Date().toLocaleDateString('id-ID')}.`
        : `Perhatian: ${student.name} menerima penambahan ${delta} poin pelanggaran untuk Kategori ${kategori} (${keterangan}) pada tanggal ${new Date().toLocaleDateString('id-ID')}.`;

      notif.unshift({
        id: newNotifId,
        nisn: nisn,
        tipe: notifType,
        pesan: msg,
        waktu: 'Baru saja',
        dibaca: false
      });
      localStorage.setItem("sman12_siswa_notifikasi", JSON.stringify(notif));
    }
  },
  getRiwayatPoin: (nisn) => {
    const riwayat = JSON.parse(localStorage.getItem("sman12_riwayat_poin") || "[]");
    return riwayat.filter(r => r.nisn === nisn);
  },
  getAllRiwayatPoin: () => {
    return JSON.parse(localStorage.getItem("sman12_riwayat_poin") || "[]");
  },
  getSiswaNotifikasi: (nisn) => {
    const notif = JSON.parse(localStorage.getItem("sman12_siswa_notifikasi") || "[]");
    return notif.filter(n => n.nisn === nisn);
  },
  addSiswaNotifikasi: (nisn, pesan, tipe = 'info') => {
    const notif = JSON.parse(localStorage.getItem("sman12_siswa_notifikasi") || "[]");
    const newNotifId = notif.length > 0 ? Math.max(...notif.map(n => n.id)) + 1 : 1;
    notif.unshift({
      id: newNotifId,
      nisn: nisn,
      tipe: tipe,
      pesan: pesan,
      waktu: 'Baru saja',
      dibaca: false
    });
    localStorage.setItem("sman12_siswa_notifikasi", JSON.stringify(notif));
  },
  markNotifikasiRead: (id) => {
    const notif = JSON.parse(localStorage.getItem("sman12_siswa_notifikasi") || "[]");
    const updated = notif.map(n => n.id === parseInt(id) ? { ...n, dibaca: true } : n);
    localStorage.setItem("sman12_siswa_notifikasi", JSON.stringify(updated));
  },
  deleteNotifikasi: (id) => {
    const notif = JSON.parse(localStorage.getItem("sman12_siswa_notifikasi") || "[]");
    const filtered = notif.filter(n => n.id !== parseInt(id));
    localStorage.setItem("sman12_siswa_notifikasi", JSON.stringify(filtered));
  },
  markAllNotifikasiRead: (nisn) => {
    const notif = JSON.parse(localStorage.getItem("sman12_siswa_notifikasi") || "[]");
    const updated = notif.map(n => n.nisn === nisn ? { ...n, dibaca: true } : n);
    localStorage.setItem("sman12_siswa_notifikasi", JSON.stringify(updated));
  },
  getPesanBk: () => {
    return JSON.parse(localStorage.getItem("sman12_pesan_bk") || "[]");
  },
  addPesanBk: (nisn, namaOrangTua, namaSiswa, kelas, pesan) => {
    const list = JSON.parse(localStorage.getItem("sman12_pesan_bk") || "[]");
    const newId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
    list.unshift({
      id: newId,
      nisn: nisn,
      namaOrangTua: namaOrangTua,
      namaSiswa: namaSiswa,
      kelas: kelas,
      pesan: pesan,
      tanggal: new Date().toISOString().split("T")[0],
      dibalas: false,
      balasan: ''
    });
    localStorage.setItem("sman12_pesan_bk", JSON.stringify(list));
  },
  balasPesanBk: (id, balasan) => {
    const list = JSON.parse(localStorage.getItem("sman12_pesan_bk") || "[]");
    const idx = list.findIndex(p => p.id === parseInt(id));
    if (idx !== -1) {
      list[idx].dibalas = true;
      list[idx].balasan = balasan;
      localStorage.setItem("sman12_pesan_bk", JSON.stringify(list));
    }
  },
  deletePesanBk: (id) => {
    const list = JSON.parse(localStorage.getItem("sman12_pesan_bk") || "[]");
    const filtered = list.filter((item) => item.id !== parseInt(id));
    localStorage.setItem("sman12_pesan_bk", JSON.stringify(filtered));
  },

  // Prestasi Siswa
  getPrestasiSiswa: () => {
    return JSON.parse(localStorage.getItem("sman12_prestasi_siswa") || JSON.stringify(defaultPrestasiSiswa));
  },
  savePrestasiSiswa: (list) => {
    localStorage.setItem("sman12_prestasi_siswa", JSON.stringify(list));
  },

  // Dokumen
  getDokumen: () => {
    return JSON.parse(localStorage.getItem("sman12_dokumen") || JSON.stringify(defaultDokumen));
  },
  saveDokumen: (data) => {
    if (Array.isArray(data)) {
      localStorage.setItem("sman12_dokumen", JSON.stringify(data));
      return;
    }
    const list = JSON.parse(localStorage.getItem("sman12_dokumen") || JSON.stringify(defaultDokumen));
    if (data.id) {
      const idx = list.findIndex((item) => item.id === parseInt(data.id));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data, id: parseInt(data.id) };
      }
    } else {
      const newId = list.length > 0 ? Math.max(...list.map((o) => o.id)) + 1 : 1;
      list.unshift({
        ...data,
        id: newId,
        created_at: new Date().toISOString().split("T")[0]
      });
    }
    localStorage.setItem("sman12_dokumen", JSON.stringify(list));
  },
  deleteDokumen: (id) => {
    const list = JSON.parse(localStorage.getItem("sman12_dokumen") || JSON.stringify(defaultDokumen));
    const filtered = list.filter((item) => item.id !== parseInt(id));
    localStorage.setItem("sman12_dokumen", JSON.stringify(filtered));
  }
};
