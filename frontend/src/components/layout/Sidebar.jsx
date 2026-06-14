import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import logoSman12 from '@assets/logo-sman12.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [kelolaOpen, setKelolaOpen] = useState(true);

  const adminName = localStorage.getItem('adminName') || 'Administrator Portal';
  const adminRole = localStorage.getItem('adminRole') || 'superadmin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminName');
    navigate('/login');
  };

  const isKelolaActive = [
    '/admin/tambah-konten',
    '/admin/data-berita',
    '/admin/galeri',
    '/admin/prestasi',
    '/admin/dokumen'
  ].some((p) => location.pathname.startsWith(p));

  return (
    <aside className="fixed top-0 left-0 w-[220px] h-screen flex flex-col z-40 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #F5921B 0%, #E8850F 40%, #D4750A 100%)',
      }}
    >
      {/* ====== Logo Area ====== */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <img
            src={logoSman12}
            alt="Logo SMAN 12"
            className="w-9 h-9 object-contain flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-tight">SMAN 12</p>
            <p className="text-[10px] text-white/70 leading-tight">KOTA TANGERANG<br/>SELATAN</p>
          </div>
        </div>
      </div>

      {/* ====== Navigation ====== */}
      <nav className="flex-1 py-2 px-3 space-y-0.5 overflow-y-auto">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all ${
              isActive
                ? 'bg-white/20 text-white'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </NavLink>

        <div>
          <button
            onClick={() => setKelolaOpen(!kelolaOpen)}
            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-md text-[13px] font-medium transition-all ${
              isKelolaActive
                ? 'bg-white/25 text-white'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Kelola Konten
            </span>
            <svg className={`w-3.5 h-3.5 transition-transform ${kelolaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {kelolaOpen && (
            <div className="ml-8 mt-1 space-y-0.5">
              <NavLink
                to="/admin/tambah-konten"
                className={({ isActive }) =>
                  `block px-3 py-1.5 text-[12px] font-medium rounded transition-colors ${
                    isActive
                      ? 'text-white underline underline-offset-2'
                      : 'text-white/60 hover:text-white'
                  }`
                }
              >
                Berita
              </NavLink>
              <NavLink
                to="/admin/data-berita"
                className={({ isActive }) =>
                  `block px-3 py-1.5 text-[12px] font-medium rounded transition-colors ${
                    isActive
                      ? 'text-white underline underline-offset-2'
                      : 'text-white/60 hover:text-white'
                  }`
                }
              >
                Pengumuman
              </NavLink>
              <NavLink
                to="/admin/galeri"
                className={({ isActive }) =>
                  `block px-3 py-1.5 text-[12px] font-medium rounded transition-colors ${
                    isActive
                      ? 'text-white underline underline-offset-2'
                      : 'text-white/60 hover:text-white'
                  }`
                }
              >
                Galeri
              </NavLink>
              <NavLink
                to="/admin/prestasi"
                className={({ isActive }) =>
                  `block px-3 py-1.5 text-[12px] font-medium rounded transition-colors ${
                    isActive
                      ? 'text-white underline underline-offset-2'
                      : 'text-white/60 hover:text-white'
                  }`
                }
              >
                Prestasi Siswa
              </NavLink>
              <NavLink
                to="/admin/dokumen"
                className={({ isActive }) =>
                  `block px-3 py-1.5 text-[12px] font-medium rounded transition-colors ${
                    isActive
                      ? 'text-white underline underline-offset-2'
                      : 'text-white/60 hover:text-white'
                  }`
                }
              >
                Unduhan Dokumen
              </NavLink>
            </div>
          )}
        </div>


        <NavLink
          to="/admin/pengaturan"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all ${
              isActive
                ? 'bg-white/20 text-white'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Pengaturan
        </NavLink>
      </nav>

      {/* ====== User Info + Logout ====== */}
      <div className="px-4 py-3 border-t border-white/20">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate" title={adminName}>{adminName}</p>
            <p className="text-[10px] text-white/60">
              {adminRole === 'superadmin' ? 'Super Administrator' : 'Administrator'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Logout"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
