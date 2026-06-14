import { Link } from 'react-router-dom';

const footerLinks = {
  profil: [
    { label: 'Visi & Misi', to: '/visi-misi' },
    { label: 'Sambutan Kepala Sekolah', to: '/#sambutan-kepsek' },
    { label: 'Informasi Sekolah', to: '/informasi' },
    { label: 'Hubungi Kami', to: '/hubungi-kami' },
  ],
  kesiswaan: [
    { label: 'Ekstrakurikuler', to: '/ekstrakurikuler' },
    { label: 'Siswa Berprestasi', to: '/#prestasi-siswa' },
    { label: 'Galeri Sekolah', to: '/galeri' },
    { label: 'Berita & Pengumuman', to: '/berita' },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-dark-800 text-white">
      <div className="container-main py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: Profil */}
          <div>
            <h4 className="text-[13px] font-bold mb-3.5 tracking-wide text-primary uppercase">
              Profil
            </h4>
            <ul className="space-y-2">
              {footerLinks.profil.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-xs text-dark-300 hover:text-primary transition-colors leading-relaxed"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Kesiswaan */}
          <div>
            <h4 className="text-[13px] font-bold mb-3.5 tracking-wide text-primary uppercase">
              Kesiswaan
            </h4>
            <ul className="space-y-2">
              {footerLinks.kesiswaan.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-xs text-dark-300 hover:text-primary transition-colors leading-relaxed"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Kontak Resmi Sekolah */}
          <div>
            <h4 className="text-[13px] font-bold mb-3.5 tracking-wide text-primary uppercase">
              Kontak Resmi Sekolah
            </h4>
            <ul className="space-y-2.5 text-xs text-dark-300">
              <li className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="leading-relaxed">
                  Jl. Pendidikan No. 12, Ciputat, Kota Tangerang Selatan, Banten 15411
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(021) 7654321</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@sman12tangsel.sch.id" className="hover:text-primary transition-colors">
                  info@sman12tangsel.sch.id
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-dark-600">
        <div className="container-main py-4">
          <p className="text-center text-[11px] text-dark-400">
            &copy; {new Date().getFullYear()} SMAN 12 Kota Tangerang Selatan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
