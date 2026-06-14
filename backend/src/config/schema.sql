-- =====================================================================
-- DATABASE SCHEMA FOR SMAN 12 KOTA TANGERANG SELATAN
-- =====================================================================
-- Skema database relational yang optimal untuk jangka panjang (skala sekolah).
-- Dilengkapi dengan Foreign Key, referensi cascade, tipe data terstandar,
-- serta Indexing untuk pencarian berkinerja tinggi.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS sman12_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sman12_db;

-- 1. TABEL: admin_users (Pengelola Konten Website Sekolah)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL,
  role ENUM('admin', 'superadmin') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_admin_username (username)
) ENGINE=InnoDB;

-- 2. TABEL: teachers_staff (Guru BK / Staf Kesiswaan Pengelola Poin)
CREATE TABLE IF NOT EXISTS teachers_staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nip VARCHAR(25) NOT NULL UNIQUE,
  nama_lengkap VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_teacher_username (username)
) ENGINE=InnoDB;

-- 3. TABEL: students (Data Identitas & Akumulasi Skor Poin Siswa)
CREATE TABLE IF NOT EXISTS students (
  nisn VARCHAR(10) PRIMARY KEY,
  nama_siswa VARCHAR(100) NOT NULL,
  kelas VARCHAR(20) NOT NULL,
  poin_pelanggaran INT DEFAULT 0,
  poin_penghargaan INT DEFAULT 0,
  status ENUM('Bebas Pelanggaran', 'Panggilan I', 'Panggilan II', 'Panggilan III', 'Panggilan IV', 'Panggilan Terakhir') DEFAULT 'Bebas Pelanggaran',
  passwordSiswa VARCHAR(255) DEFAULT '$2a$10$tM.aBih6o8D1u/d6KxQcCOY1E5W82wT/P0E9Yn1.gV7K27ZgYx/uG', -- Hashed: siswa123
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_student_name (nama_siswa),
  INDEX idx_student_kelas (kelas)
) ENGINE=InnoDB;

-- 4. TABEL: parents (Data Wali Murid Terhubung ke Siswa)
CREATE TABLE IF NOT EXISTS parents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_ortu VARCHAR(100) NOT NULL,
  email_ortu VARCHAR(100) NOT NULL UNIQUE,
  passwordOrangTua VARCHAR(255) DEFAULT '$2a$10$wN9aRix.vT3W.eG8K/d4X.nQp1m78lJ5q9cK0yV6gH8I6UuV2t2sK', -- Hashed: ortu123
  nisn_siswa VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (nisn_siswa) REFERENCES students(nisn) ON DELETE CASCADE,
  INDEX idx_parent_nisn (nisn_siswa)
) ENGINE=InnoDB;

-- 5. TABEL: point_rules (Aturan Poin Pelanggaran & Prestasi)
CREATE TABLE IF NOT EXISTS point_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_aturan VARCHAR(255) NOT NULL,
  kategori ENUM('Pelanggaran Ringan', 'Pelanggaran Sedang', 'Pelanggaran Berat', 'Penghargaan') NOT NULL,
  tipe ENUM('positive', 'negative') NOT NULL,
  poin_value INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rule_kategori (kategori)
) ENGINE=InnoDB;

-- 6. TABEL: point_logs (Log Transaksi Riwayat Pelanggaran/Prestasi Murid)
CREATE TABLE IF NOT EXISTS point_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nisn_siswa VARCHAR(10) NOT NULL,
  aturan_id INT NOT NULL,
  keterangan_tambahan TEXT,
  guru_pencatat_id INT,
  tanggal DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nisn_siswa) REFERENCES students(nisn) ON DELETE CASCADE,
  FOREIGN KEY (aturan_id) REFERENCES point_rules(id) ON DELETE RESTRICT,
  FOREIGN KEY (guru_pencatat_id) REFERENCES teachers_staff(id) ON DELETE SET NULL,
  INDEX idx_log_nisn (nisn_siswa),
  INDEX idx_log_tanggal (tanggal)
) ENGINE=InnoDB;

-- 7. TABEL: notifications (Notifikasi Poin/Peringatan Terbaca Orang Tua)
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nisn_siswa VARCHAR(10) NOT NULL,
  tipe ENUM('warning', 'success', 'info') NOT NULL,
  pesan TEXT NOT NULL,
  dibaca BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nisn_siswa) REFERENCES students(nisn) ON DELETE CASCADE,
  INDEX idx_notif_nisn (nisn_siswa)
) ENGINE=InnoDB;

-- 8. TABEL: bk_consultations (Log Pesan Chat BK Antara Wali Murid & Guru BK)
CREATE TABLE IF NOT EXISTS bk_consultations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nisn_siswa VARCHAR(10) NOT NULL,
  pesan_ortu TEXT NOT NULL,
  balasan_bk TEXT,
  status_dibalas BOOLEAN DEFAULT FALSE,
  tanggal DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nisn_siswa) REFERENCES students(nisn) ON DELETE CASCADE,
  INDEX idx_chat_nisn (nisn_siswa)
) ENGINE=InnoDB;



-- 10. TABEL: berita (Artikel Portal Berita & Pengumuman Sekolah)
CREATE TABLE IF NOT EXISTS berita (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  konten TEXT NOT NULL,
  thumbnail VARCHAR(500),
  kategori ENUM('berita', 'pengumuman', 'kegiatan', 'prestasi') DEFAULT 'berita',
  status ENUM('draft', 'published') DEFAULT 'draft',
  author_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_news_status (status),
  INDEX idx_news_kategori (kategori),
  INDEX idx_news_created (created_at)
) ENGINE=InnoDB;

-- 11. TABEL: galeri (Foto Dokumentasi Fasilitas/Kegiatan)
CREATE TABLE IF NOT EXISTS galeri (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  gambar VARCHAR(500) NOT NULL,
  kategori ENUM('kegiatan', 'fasilitas', 'prestasi', 'lainnya') DEFAULT 'kegiatan',
  author_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_galeri_kategori (kategori)
) ENGINE=InnoDB;

-- 12. TABEL: dokumen (File Unduhan Dokumen Kurikulum/Surat)
CREATE TABLE IF NOT EXISTS dokumen (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  file_path VARCHAR(500) NOT NULL,
  tipe ENUM('surat', 'pengumuman', 'formulir', 'lainnya') DEFAULT 'lainnya',
  ukuran_file INT DEFAULT 0,
  author_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_dokumen_tipe (tipe)
) ENGINE=InnoDB;

-- 13. TABEL: school_settings (Konfigurasi Profil Instansi Sekolah - Key/Value)
CREATE TABLE IF NOT EXISTS school_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL
) ENGINE=InnoDB;

-- =====================================================================
-- SEED DATA AWAL (DEFAULT ADMINISTRATOR & GURU & BERITA)
-- =====================================================================
-- Default Admin: username 'admin', password 'admin123' (bcrypt)
INSERT IGNORE INTO admin_users (username, password, email, nama_lengkap, role)
VALUES ('admin', '$2a$10$X7UrE5Jx2lDSn.tQqV9vNOViFl7y6HJlMq5C/0RAHInWbKxjnWk2y', 'admin@sman12.sch.id', 'Administrator Portal', 'superadmin');

-- Default Guru BK: username 'guru', password 'guru123' (bcrypt)
INSERT IGNORE INTO teachers_staff (nip, nama_lengkap, username, password)
VALUES ('197911172009022002', 'Ana Mukarromah, S.Si., M.Pd', 'guru', '$2a$10$n8D.73wFw.q/P5H0XJ1O/OWUuqn82E8mGgH5z7M.Xqf6/JtC87E2K');

-- Seed Point Rules (Tata Tertib Pelanggaran & Prestasi SMAN 12)
INSERT IGNORE INTO point_rules (id, nama_aturan, kategori, tipe, poin_value) VALUES
-- Pelanggaran Ringan (PR)
(1, '[PR. 1] Berperilaku tidak sopan/santun, baik ucapan maupun tindakan terhadap warga sekolah.', 'Pelanggaran Ringan', 'negative', 5),
(2, '[PR. 2] Tidak menjaga kebersihan lingkungan sekolah.', 'Pelanggaran Ringan', 'negative', 5),
(3, '[PR. 3] Menggunakan HP atau alat elektronik lainnya saat KBM tanpa seizin guru.', 'Pelanggaran Ringan', 'negative', 5),
(4, '[PR. 4] Tidak memakai seragam sesuai tata tertib sekolah.', 'Pelanggaran Ringan', 'negative', 5),
(5, '[PR. 5] Datang terlambat di sekolah tanpa konfirmasi dari orang tua.', 'Pelanggaran Ringan', 'negative', 5),
(6, '[PR. 6] Meninggalkan jam pelajaran tanpa seizin guru.', 'Pelanggaran Ringan', 'negative', 10),
(7, '[PR. 7] Tidak hadir tanpa keterangan.', 'Pelanggaran Ringan', 'negative', 10),
(8, '[PR. 8] Memakai sepatu berwarna selain hitam.', 'Pelanggaran Ringan', 'negative', 10),
(9, '[PR. 9] Main kartu di lingkungan sekolah (remi, domino & kartu judi lainnya).', 'Pelanggaran Ringan', 'negative', 10),
(10, '[PR. 10] Memakai celana model pensil atau ketat.', 'Pelanggaran Ringan', 'negative', 10),
(11, '[PR. 11] Berambut gondrong (melebihi alis, telinga, dan kerah baju) untuk laki-laki.', 'Pelanggaran Ringan', 'negative', 10),
(12, '[PR. 12] Berpakaian (memakai baju dan rok) ketat untuk perempuan.', 'Pelanggaran Ringan', 'negative', 10),
(13, '[PR. 13] Bermain bola pada saat jam pelajaran kecuali jam pelajaran olahraga.', 'Pelanggaran Ringan', 'negative', 10),
(14, '[PR. 14] Memakai anting/tindak, gelang, dan kalung bagi laki-laki.', 'Pelanggaran Ringan', 'negative', 10),
(15, '[PR. 15] Mewarnai rambut dan kuku.', 'Pelanggaran Ringan', 'negative', 10),
(16, '[PR. 16] Memakai make up dan atau perhiasan berlebihan.', 'Pelanggaran Ringan', 'negative', 10),
(17, '[PR. 17] Merayakan ulang tahun secara berlebihan yang dapat menganggu ketertiban dan keamanan di lingkungan sekolah.', 'Pelanggaran Ringan', 'negative', 10),
(18, '[PR. 18] Tidak tertib saat melaksanakan kegiatan sekolah.', 'Pelanggaran Ringan', 'negative', 15),

-- Pelanggaran Sedang (PS)
(19, '[PS. 1] Memberi keterangan tidak benar atau palsu, membuat dan atau mengedarkan surat palsu, memalsukan tandatangan (orang tua/wali, kepala sekolah, guru, karyawan Tata Usaha dan pihak lain) untuk kepentingan tertentu.', 'Pelanggaran Sedang', 'negative', 30),
(20, '[PS. 2] Melakukan demonstrasi tanpa izin di dalam maupun di luar lingkungan sekolah.', 'Pelanggaran Sedang', 'negative', 30),
(21, '[PS. 3] Tidak mengikuti upacara bendera setiap hari Senin dan atau upacara peringatan hari-hari besar Nasional tanpa seizin orang tua dan pihak sekolah.', 'Pelanggaran Sedang', 'negative', 30),
(22, '[PS. 4] Tidak mengikuti kegiatan keagamaan dan peringatan hari-hari besar keagamaan yang diselenggarakan sekolah tanpa seizin orang tua dan pihak sekolah.', 'Pelanggaran Sedang', 'negative', 30),
(23, '[PS. 5] Berkumpul/nongkrong di sekitar lingkungan sekolah dengan radius 1 km memakai seragam atau atribut sekolah dengan disertai tindakan yang melanggar tata tertib sekolah.', 'Pelanggaran Sedang', 'negative', 30),
(24, '[PS. 6] Pelecehan seksual secara verbal terhadap lawan jenis atau sesama jenis.', 'Pelanggaran Sedang', 'negative', 30),
(25, '[PS. 7] Merusak sarana prasarana sekolah yang mengakibatkan kerusakan ringan.', 'Pelanggaran Sedang', 'negative', 30),

-- Pelanggaran Berat (PB)
(26, '[PB. 1] Menyebarkan informasi bohong atau fitnah dalam bentuk apapun yang dapat menimbulkan keresahan sosial dan pertikaian antar pelajar maupun masyarakat luas.', 'Pelanggaran Berat', 'negative', 50),
(27, '[PB. 2] Mencemarkan nama baik guru, karyawan sekolah dalam bentuk apapun.', 'Pelanggaran Berat', 'negative', 50),
(28, '[PB. 3] Membawa alat kontrasepsi dan sejenisnya.', 'Pelanggaran Berat', 'negative', 50),
(29, '[PB. 4] Menjadi pengurus, anggota, simpatisan berbagai organisasi diluar OSIS and MPK tanpa seizin pihak sekolah.', 'Pelanggaran Berat', 'negative', 55),
(30, '[PB. 5] Memprovokasi tindakan yang dapat mengganggu keamanan dan ketertiban sekolah.', 'Pelanggaran Berat', 'negative', 55),
(31, '[PB. 6] Membawa rokok dan vape, serta merokok dan menggunakan vape di sekolah.', 'Pelanggaran Berat', 'negative', 55),
(32, '[PB. 7] Melakukan ancaman, terror, bullying pada warga sekolah.', 'Pelanggaran Berat', 'negative', 55),
(33, '[PB. 8] Merusak sarana prasarana sekolah yang mengakibatkan kerusakan berat.', 'Pelanggaran Berat', 'negative', 65),
(34, '[PB. 9] Melakukan tindakan vandalisme (merusak, menghancurkan karya seni dan benda berharga lainnya sehingga mengurangi/menghilangkan keindahan sarana prasarana sekolah).', 'Pelanggaran Berat', 'negative', 65),
(35, '[PB. 10] Merajah bagian tubuh (tato).', 'Pelanggaran Berat', 'negative', 75),
(36, '[PB. 11] Pacaran berlebihan.', 'Pelanggaran Berat', 'negative', 75),
(37, '[PB. 12] Melakukan pelecehan seksual secara fisik terhadap lawan jenis atau sesama jenis.', 'Pelanggaran Berat', 'negative', 75),
(38, '[PB. 13] Melompat pagar dan atau jendela sekolah.', 'Pelanggaran Berat', 'negative', 75),
(39, '[PB. 14] Membawa dan atau meminum minuman keras serta masuk sekolah dalam kondisi mabuk.', 'Pelanggaran Berat', 'negative', 75),
(40, '[PB. 15] Berjudi di dalam lingkungan sekolah dan di luar lingkungan sekolah.', 'Pelanggaran Berat', 'negative', 75),
(41, '[PB. 16] Melawan kepala sekolah, guru, dan pegawai dalam bentuk apapun.', 'Pelanggaran Berat', 'negative', 75),
(42, '[PB. 17] Melakukan perkelahian satu lawan satu atau lebih.', 'Pelanggaran Berat', 'negative', 75),
(43, '[PB. 18] Memprovokasi tindakan yang dapat mencemarkan nama baik sekolah.', 'Pelanggaran Berat', 'negative', 75),
(44, '[PB. 19] Melakukan tindakan pornografi dan atau pornoaksi yang dianggap tidak wajar dan berlebihan bagi peserta didik, baik di lingkungan sekolah maupun di luar lingkungan sekolah.', 'Pelanggaran Berat', 'negative', 75),
(45, '[PB. 20] Mencuri atau mengambil uang/barang berharga milik orang lain atau sekolah.', 'Pelanggaran Berat', 'negative', 100),
(46, '[PB. 21] Melakukan tindakan kekerasan terhadap warga sekolah.', 'Pelanggaran Berat', 'negative', 100),
(47, '[PB. 22] Membawa dan atau menggunakan senjata tajam, senjata api dan alat-alat yang dapat membahayakan keselamatan orang lain tanpa seizin pihak sekolah.', 'Pelanggaran Berat', 'negative', 100),
(48, '[PB. 23] Melakukan tawuran antar pelajar dan atau sesama pelajar satu sekolah.', 'Pelanggaran Berat', 'negative', 100),
(49, '[PB. 24] Terbukti hamil atau menghamili.', 'Pelanggaran Berat', 'negative', 100),
(50, '[PB. 25] Terbukti telah menikah dan atau telah melakukan hubungan badan dengan bukti yang sudah terkonfirmasi kebenarannya.', 'Pelanggaran Berat', 'negative', 100),
(51, '[PB. 26] Membawa, menggunakan dan mengedarkan narkoba serta zat adiktif lainnya.', 'Pelanggaran Berat', 'negative', 100),

-- Prestasi (PRST)
(52, '[PRST. 1] Juara I/II/III Lomba/Kegiatan Tingkat Kabupaten/Kota', 'Penghargaan', 'positive', 20),
(53, '[PRST. 2] Juara I/II/III Lomba/Kegiatan Tingkat Provinsi', 'Penghargaan', 'positive', 30),
(54, '[PRST. 3] Juara I/II/III Lomba/Kegiatan Tingkat Nasional', 'Penghargaan', 'positive', 50),
(55, '[PRST. 4] Juara I/II/III Lomba/Kegiatan Tingkat Internasional', 'Penghargaan', 'positive', 75),
(56, '[PRST. 5] Pengurus Aktif OSIS / MPK / Ekstrakurikuler dengan kinerja sangat baik', 'Penghargaan', 'positive', 15),
(57, '[PRST. 6] Menunjukkan kejujuran luar biasa (mengembalikan barang hilang/berharga)', 'Penghargaan', 'positive', 15),
(58, '[PRST. 7] Kehadiran penuh (100% absen) dalam satu semester', 'Penghargaan', 'positive', 15);


-- Seed data for berita table of SMAN 12 Kota Tangerang Selatan
INSERT IGNORE INTO berita (id, judul, slug, konten, thumbnail, kategori, status, author_id, created_at)
VALUES 
(1, 'Sosialisasi Pencegahan Perundungan (Anti-Bullying) oleh Mahasiswa Universitas Pamulang di SMAN 12 Tangerang Selatan', 'sosialisasi-pencegahan-perundungan-anti-bullying-unpam-sman-12-tangsel', 'Mahasiswa Program Studi Hukum S1 Universitas Pamulang sukses menyelenggarakan Pengabdian Kepada Masyarakat (PKM) di SMAN 12 Tangerang Selatan pada 21 Mei 2026. Kegiatan ini bertajuk ''Tertawamu Adalah Tangis Mereka: Sosialisasi Anti-Bullying di Sekolah Menengah''. Dipandu oleh para mahasiswa, sosialisasi ini bertujuan mengedukasi siswa mengenai bahaya fisik, verbal, dan psikologis perundungan serta konsekuensi hukumnya bagi pelaku di bawah umur. Melalui analisis SWOT, siswa diajak mengidentifikasi faktor pendukung dan penghambat pencegahan perundungan di sekolah untuk mewujudkan lingkungan yang aman dan ramah anak.', '/images/news/anti_bullying_pkm.png', 'kegiatan', 'published', 1, '2026-05-21 00:00:00'),
(2, 'Apresiasi Keberhasilan Puluhan Siswa SMAN 12 Kota Tangerang Selatan Lolos Jalur SNBP PTN 2026', 'apresiasi-kelulusan-snbp-ptn-2026-sman-12-tangsel', 'SMAN 12 Kota Tangerang Selatan mencatatkan hasil yang membanggakan dalam Seleksi Nasional Berdasarkan Prestasi (SNBP) 2026. Puluhan siswa kelas XII dinyatakan lolos masuk Perguruan Tinggi Negeri (PTN) impian mereka seperti Universitas Indonesia (UI), IPB University, Universitas Negeri Jakarta (UNJ), UIN Syarif Hidayatullah Jakarta, dan universitas negeri favorit lainnya. Kepala Sekolah SMAN 12, Bapak Rokhmat Hidayat, menyampaikan selamat dan apresiasi setinggi-tingginya kepada para siswa serta guru pendamping atas kerja keras yang membawa hasil gemilang ini.', '/images/news/snbp_ptn_kelulusan.png', 'prestasi', 'published', 1, '2026-03-28 00:00:00'),
(3, 'Mengembangkan Potensi Kreatif, Siswa Kelas XII SMAN 12 Tangsel Sukses Gelar Ujian Praktik Seni Budaya', 'siswa-xii-sman-12-tangsel-sukses-gelar-ujian-praktik-seni-budaya', 'Siswa kelas XII SMAN 12 Kota Tangerang Selatan menyelenggarakan pagelaran ujian praktik mata pelajaran Seni Budaya dan Keterampilan (SBK). Kegiatan ini dibimbing langsung oleh Bapak Muhammad Rojak selaku guru Seni Budaya. Para siswa menampilkan berbagai pertunjukan seni kreatif yang memukau penguji, mulai dari pagelaran tari kolosal tradisional Nusantara, teater mini bertema kritik sosial, hingga aransemen musik ansambel. Selain untuk penilaian ujian akhir, kegiatan ini ditujukan untuk memupuk jiwa seni dan melestarikan kebudayaan daerah.', '/images/news/seni_budaya_praktik.png', 'kegiatan', 'published', 1, '2026-02-20 00:00:00'),
(4, 'Sosialisasi Pancasila sebagai Sistem Etika oleh Mahasiswa UBSI di SMAN 12 Tangerang Selatan', 'sosialisasi-pancasila-sistem-etika-ubsi-sman-12-tangsel', 'Mahasiswa Universitas Bina Sarana Informatika (UBSI) Kampus BSD menyelenggarakan kegiatan sosialisasi mengenai Pancasila sebagai sistem etika untuk penguatan karakter di SMAN 12 Kota Tangerang Selatan pada Senin, 20 Oktober 2025. Kegiatan ini difokuskan kepada siswa kelas X.C untuk menanamkan nilai-nilai luhur Pancasila dalam perilaku sehari-hari. Melalui presentasi PowerPoint, diskusi kelompok interaktif mengenai studi kasus moralitas remaja, dan kuis interaktif, siswa dibimbing agar lebih memahami pentingnya bersikap sopan, berintegritas, dan menjunjung toleransi.', '/images/news/pancasila_etika_ubsi.png', 'kegiatan', 'published', 1, '2025-10-20 00:00:00'),
(5, 'Tingkatkan Kesiapan Karir Masa Depan, SMAN 12 Tangsel Adakan Pelatihan Pembuatan CV Profesional bagi Siswa', 'pelatihan-pembuatan-cv-profesional-word-sman-12-tangsel', 'Sebagai bekal menghadapi persaingan pasca-kelulusan sekolah menengah, SMAN 12 Kota Tangerang Selatan bekerja sama dengan Universitas Pamulang menyelenggarakan pelatihan penyusunan Curriculum Vitae (CV) profesional menggunakan Microsoft Word pada 13 Februari 2025. Diikuti oleh siswa-siswi kelas XII, kegiatan ini memaparkan tips menyusun portofolio karir, menulis deskripsi keahlian, dan memilih layout CV yang dinilai ramah sistem penyaringan HRD (*ATS-friendly*). Diharapkan pelatihan keterampilan digital ini membantu alumni bersaing lebih baik.', '/images/news/pelatihan_cv_siswa.png', 'kegiatan', 'published', 1, '2025-02-13 00:00:00'),
(6, 'Siswa Kelas X SMAN 12 Tangerang Selatan Giat Latihan P5 Aksi dengan Kearifan Budaya Lokal', 'siswa-kelas-x-sman-12-tangerang-selatan-giat-latihan-p5-aksi-dengan-kearifan-budaya-lokal', 'Siswa kelas X SMAN 12 Tangerang Selatan menyelenggarakan latihan ''P5 Aksi dengan Kearifan Lokal'' sebagai persiapan menuju ''Panen Raya P5 Hajatan Budaya''. Pada latihan ini, para siswa dibagi ke dalam kelompok-kelompok kecil untuk mempersiapkan berbagai aspek pertunjukan dan pameran, mulai dari dekorasi dan tata panggung, pameran kuliner tradisional (seperti soto betawi, gudeg, kue cucur, bakpia), hingga latihan pertunjukan kesenian daerah (Palang Pintu, tari tradisional, cerita rakyat, teater). Kegiatan ini dipersiapkan di bawah bimbingan Wakil Kurikulum Ibu Yanthi Rohayati, S.T., M.Pd. dan wali kelas X.', '/images/news/p5_kearifan_lokal.png', 'kegiatan', 'published', 1, '2024-02-23 00:00:00'),
(7, 'Tingkatkan Keterampilan Digital, Siswa SMAN 12 Tangsel Ikuti Pelatihan Microsoft Excel Sekejap', 'tingkatkan-keterampilan-digital-siswa-sman-12-tangsel-ikuti-pelatihan-microsoft-excel-sekejap', 'Tim Pengabdian Kepada Masyarakat (PKM) dari Universitas Pamulang menyelenggarakan pelatihan praktis Microsoft Excel bagi siswa-siswi di SMAN 12 Tangerang Selatan pada 17 Oktober 2024. Bertajuk ''Bikin Siswa SMAN 12 Tangsel Jago Excel dalam Sekejap!'', pelatihan ini memfokuskan pada penguasaan rumus-rumus penting (seperti VLOOKUP, HLOOKUP, IF statement), pengelolaan database sederhana, serta visualisasi data menggunakan grafik. Pelatihan ini diharapkan dapat meningkatkan keahlian digital siswa untuk bekal menghadapi dunia perguruan tinggi maupun kerja.', '/images/news/pkm_unpam_excel.png', 'kegiatan', 'published', 1, '2024-10-22 00:00:00'),
(8, 'Edukasi Pemilih Pemula, Bawaslu Tangsel Gelar Roadshow Sosialisasi Pemilu di SMAN 12 Tangsel', 'edukasi-pemilih-pemula-bawaslu-tangsel-gelar-roadshow-sosialisasi-pemilu-di-sman-12-tangsel', 'Bawaslu Kota Tangerang Selatan menyelenggarakan sosialisasi pengawasan partisipatif bertajuk ''Bawaslu Go To School'' di SMAN 12 Kota Tangerang Selatan pada Jumat, 1 Maret 2019. Kegiatan sosialisasi ini bertujuan mengedukasi siswa SMA selaku pemilih pemula tentang mekanisme Pemilu, pentingnya menolak politik uang (money politics), serta mendorong keterlibatan aktif siswa dalam mengawasi jalannya Pemilu secara mandiri. Acara dikemas menarik dengan talkshow interaktif serta penampilan band akustik Monokrom yang membawakan jingle resmi Bawaslu.', '/images/news/bawaslu_go_to_school.png', 'kegiatan', 'published', 1, '2019-03-01 00:00:00');
