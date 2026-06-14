import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logoSman12 from '@assets/logo-sman12.png';

const navLeft = [
  { label: 'Profil', hasDropdown: true, children: [
    { to: '/visi-misi', label: 'Visi & Misi' },
    { to: '/informasi', label: 'Sejarah Sekolah' },
  ]},
  { label: 'Kesiswaan', hasDropdown: true, children: [
    { to: '/ekstrakurikuler', label: 'Ekstrakurikuler' },
    { to: '/kesiswaan/login/siswa', label: 'Portal Poin Karakter' },
  ]},
];

const navRight = [
  { label: 'Info Sekolah', hasDropdown: true, children: [
    { to: '/informasi-sekolah', label: 'Informasi Sekolah' },
  ]},
  { to: '/hubungi-kami', label: 'Kontak' },
];

const getMenuIcon = (label, active) => {
  const iconClass = `w-4 h-4 transition-colors duration-200 ${
    active ? 'text-white' : 'text-primary/80 group-hover:text-primary'
  }`;

  switch (label.toLowerCase()) {
    case 'profil':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case 'kesiswaan':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      );
    case 'info sekolah':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'kontak':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    default:
      return null;
  }
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  const isItemActive = (item) => {
    if (item.to) {
      return location.pathname === item.to;
    }
    if (item.children) {
      return item.children.some(child => location.pathname === child.to);
    }
    return false;
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-sm transition-all duration-300">
      {/* Top Gradient Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary via-amber-400 to-primary-dark" />

      <div className="container-main">
        <div className="flex items-center justify-between h-[70px] pt-[4px]">

          {/* Left Menu Items (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-gradient-to-br from-orange-50/50 to-white/90 px-2 py-1.5 rounded-xl border border-orange-100/60 shadow-[0_1px_3px_rgba(245,146,27,0.02)]">
            {navLeft.map((item) => {
              const active = isItemActive(item);
              const open = openDropdown === item.label;
              return (
                <div key={item.label} className="relative group">
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                      active || open
                        ? 'text-white bg-gradient-to-r from-primary to-orange-500 shadow-[0_2.5px_8px_rgba(245,146,27,0.35)] font-semibold'
                        : 'text-slate-700 hover:text-primary hover:bg-white/70'
                    }`}
                  >
                    {getMenuIcon(item.label, active || open)}
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <svg className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  {item.hasDropdown && (
                    <div
                      className={`absolute top-full left-0 mt-3.5 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 min-w-[200px] z-50 transform origin-top transition-all duration-200 ${
                        open
                          ? 'opacity-100 scale-100 translate-y-0 visible'
                          : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                      }`}
                    >
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.to;
                        return (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => setOpenDropdown(null)}
                            className={`block px-4 py-2.5 text-[13px] transition-colors ${
                              isChildActive
                                ? 'text-primary font-semibold bg-primary-50/30'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                            } rounded-lg mx-1.5 my-0.5`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Center Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 hover:scale-[1.02] transition-transform duration-200" onClick={closeMobile}>
            <img
              src={logoSman12}
              alt="Logo SMAN 12"
              className="w-10 h-10 object-contain flex-shrink-0 drop-shadow-sm"
            />
            <span className="text-[13px] font-extrabold tracking-wide hidden xs:block">
              <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent mr-1">
                SMAN 12
              </span>
              <span className="text-slate-800 hover:text-primary transition-colors duration-200">
                KOTA TANGERANG SELATAN
              </span>
            </span>
          </Link>

          {/* Right Menu Items (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-gradient-to-br from-orange-50/50 to-white/90 px-2 py-1.5 rounded-xl border border-orange-100/60 shadow-[0_1px_3px_rgba(245,146,27,0.02)]">
            {navRight.map((item) => {
              const active = isItemActive(item);
              const open = openDropdown === item.label;
              return (
                <div key={item.label} className="relative group">
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                          active || open
                            ? 'text-white bg-gradient-to-r from-primary to-orange-500 shadow-[0_2.5px_8px_rgba(245,146,27,0.35)] font-semibold'
                            : 'text-slate-700 hover:text-primary hover:bg-white/70'
                        }`}
                      >
                        {getMenuIcon(item.label, active || open)}
                        <span>{item.label}</span>
                        <svg className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div
                        className={`absolute top-full right-0 mt-3.5 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 min-w-[200px] z-50 transform origin-top transition-all duration-200 ${
                          open
                            ? 'opacity-100 scale-100 translate-y-0 visible'
                            : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                        }`}
                      >
                        {item.children.map((child) => {
                          const isChildActive = location.pathname === child.to;
                          return (
                            <Link
                              key={child.to}
                              to={child.to}
                              onClick={() => setOpenDropdown(null)}
                              className={`block px-4 py-2.5 text-[13px] transition-colors ${
                                isChildActive
                                  ? 'text-primary font-semibold bg-primary-50/30'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                              } rounded-lg mx-1.5 my-0.5`}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200 block ${
                          isActive
                            ? 'text-white bg-gradient-to-r from-primary to-orange-500 shadow-[0_2.5px_8px_rgba(245,146,27,0.35)] font-semibold'
                            : 'text-slate-700 hover:text-primary hover:bg-white/70'
                        }`
                      }
                    >
                      {getMenuIcon(item.label, isItemActive(item))}
                      <span>{item.label}</span>
                    </NavLink>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hamburger Menu Button (Mobile) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5.5 h-5.5 transition-transform duration-200 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5.5 h-5.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-[500px] border-t border-slate-100 bg-white' : 'max-h-0'}`}>
        <div className="px-4 py-3 space-y-1 bg-gradient-to-b from-orange-50/50 to-white/95 backdrop-blur-sm">
          {[...navLeft, ...navRight].map((item) => {
            const active = isItemActive(item);
            return item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2.5 text-[14px] font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-primary to-orange-500 shadow-sm font-semibold'
                      : 'text-slate-700 hover:text-primary hover:bg-white/50'
                  }`
                }
              >
                {getMenuIcon(item.label, active)}
                <span>{item.label}</span>
              </NavLink>
            ) : (
              <div key={item.label} className="space-y-0.5">
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 text-[14px] font-medium rounded-lg transition-all duration-200 ${
                    active
                      ? 'text-white bg-gradient-to-r from-primary to-orange-500 shadow-sm font-semibold'
                      : 'text-slate-700 hover:text-primary hover:bg-white/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {getMenuIcon(item.label, active)}
                    <span>{item.label}</span>
                  </span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openDropdown === item.label ? 'max-h-[200px] py-1' : 'max-h-0'}`}>
                  {item.children?.map((child) => {
                    const isChildActive = location.pathname === child.to;
                    return (
                      <Link
                        key={child.to}
                        to={child.to}
                        onClick={closeMobile}
                        className={`block pl-9 pr-4 py-2 text-[13px] font-medium transition-colors rounded-lg mx-1 ${
                          isChildActive
                            ? 'text-primary font-semibold bg-primary-50/20'
                            : 'text-slate-500 hover:text-primary hover:bg-slate-50/50'
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {openDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
      )}
    </nav>
  );
};

export default Navbar;
