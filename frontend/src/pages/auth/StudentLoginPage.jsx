import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { localStore } from '@services/localStore';

const StudentLoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('siswa');
  const [nisn, setNisn] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (role === 'siswa' && !/^\d{10}$/.test(nisn)) {
      setError('NISN harus terdiri dari 10 digit angka.');
      return;
    }

    if (role === 'orangtua' && nisn.length < 5) {
      setError('Masukkan NISN siswa dengan benar.');
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi harus memiliki minimal 6 karakter.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const student = localStore.getSiswaByNisn(nisn);
      if (!student) {
        setLoading(false);
        setError('Siswa dengan NISN tersebut tidak ditemukan.');
        return;
      }

      const correctPassword = role === 'siswa'
        ? (student.passwordSiswa || 'siswa123')
        : (student.passwordOrangTua || 'ortu123');

      if (password !== correctPassword) {
        setLoading(false);
        setError('Kata sandi yang Anda masukkan salah.');
        return;
      }

      setLoading(false);
      const token = 'dummy-portal-token-' + role + '-' + Math.random().toString(36).substring(2, 10);
      const profile = {
        nisn,
        name: role === 'siswa' ? student.name : `Bapak/Ibu (Orang Tua ${student.name})`,
        kelas: student.kelas,
        role: role
      };

      if (keepLoggedIn) {
        localStorage.setItem('siswaToken', token);
        localStorage.setItem('siswaProfile', JSON.stringify(profile));
      } else {
        sessionStorage.setItem('siswaToken', token);
        sessionStorage.setItem('siswaProfile', JSON.stringify(profile));
      }

      navigate(role === 'orangtua' ? '/orangtua/dashboard' : '/siswa/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* ========================================
          Left Panel - Branding & Stats Info
          ======================================== */}
      <div className="lg:w-[45%] bg-gradient-to-b from-[#0B1528] via-[#101E35] to-[#0A1120] text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[460px] lg:min-h-screen">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[80px] -mr-40 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] -ml-40 -mb-20 pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-3.5 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-lg max-w-full">
            <div className="bg-primary p-2.5 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div className="min-w-0 pr-2">
              <h2 className="text-[11px] sm:text-xs font-bold text-white tracking-wide truncate">
                SMAN 12 KOTA TANGERANG SELATAN
              </h2>
              <p className="text-[8px] sm:text-[9px] font-semibold text-primary tracking-widest mt-0.5 uppercase">
                Maju Bersama, Hebat Semua
              </p>
            </div>
          </div>

          <div className="mt-14 lg:mt-24 max-w-md">
            <h1 className="text-3xl sm:text-[40px] lg:text-[44px] font-extrabold leading-[1.1] tracking-tight">
              Sistem Poin
              <span className="block text-primary mt-1">Karakter Siswa.</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-5 max-w-[360px]">
              Platform digital terintegrasi untuk pemantauan disiplin, prestasi, dan pengembangan karakter siswa secara real-time.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-12 lg:mt-0">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-[380px]">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between min-h-[90px] backdrop-blur-sm">
              <span className="text-xl sm:text-2xl font-bold text-white">01</span>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-2">
                Integritas
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between min-h-[90px] backdrop-blur-sm">
              <span className="text-xl sm:text-2xl font-bold text-white">02</span>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-2">
                Disiplin
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between min-h-[90px] backdrop-blur-sm">
              <span className="text-xl sm:text-2xl font-bold text-white">03</span>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-2">
                Prestasi
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 lg:mt-0 flex gap-6 text-[10px] tracking-widest font-bold text-slate-500">
          <button type="button" className="hover:text-slate-400 transition-colors uppercase">
            Pusat Bantuan
          </button>
          <button type="button" className="hover:text-slate-400 transition-colors uppercase">
            Panduan
          </button>
        </div>
      </div>

      {/* ========================================
          Right Panel - Login Form & Role Selector
          ======================================== */}
      <div className="flex-1 bg-[#F9FBFC] flex items-center justify-center p-6 sm:p-10 lg:p-16 xl:p-20">
        <div className="w-full max-w-[420px] py-8 lg:py-0">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold tracking-wider rounded-md uppercase mb-4">
            Akses Portal
          </div>

          <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 leading-tight mb-2">
            Selamat Datang Kembali
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
            Gunakan NISN siswa atau akun Anda untuk masuk. Data Anda dilindungi oleh sistem keamanan sekolah.
          </p>

          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200/40">
            <button
              type="button"
              onClick={() => {
                setRole('siswa');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold text-center rounded-lg transition-all duration-200 ${
                role === 'siswa'
                  ? 'bg-white text-[#0B1528] shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Siswa
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('orangtua');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold text-center rounded-lg transition-all duration-200 ${
                role === 'orangtua'
                  ? 'bg-white text-[#0B1528] shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Orang Tua
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2 animate-fadeIn">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">
                {role === 'siswa' ? 'NISN / Identitas Pengguna' : 'NISN Siswa / Identitas Orang Tua'}
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={role === 'siswa' ? 'Contoh: 0012345678' : 'Contoh: 0012345678 atau Username'}
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  className="text-[10px] text-primary font-bold hover:underline transition-colors"
                >
                  Lupa Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="keep-logged-in"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
              />
              <label
                htmlFor="keep-logged-in"
                className="text-xs sm:text-sm text-slate-500 cursor-pointer select-none"
              >
                Biarkan saya tetap masuk
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0B1528] hover:bg-[#101E35] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98] mt-6"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  Masuk ke Sistem
                  <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[9px] tracking-widest font-semibold text-slate-400 uppercase mt-8">
            Portal Akademik SMAN 12 &copy; 2024
          </p>

          <div className="border-t border-slate-200/60 my-8" />

          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 text-[10px] tracking-widest font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Kembali ke Website Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;
