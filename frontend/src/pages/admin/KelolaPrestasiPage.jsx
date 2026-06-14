import { useState, useEffect } from 'react';
import { localStore } from '@services/localStore';

const KelolaPrestasiPage = () => {
  const [prestasiList, setPrestasiList] = useState([]);
  const [formPrestasi, setFormPrestasi] = useState({
    nama: '',
    prestasi: '',
    level: '',
    badge: 'Nasional'
  });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const prestasiData = localStore.getPrestasiSiswa();
    if (prestasiData) {
      setPrestasiList(prestasiData);
    }
  };

  const handlePrestasiChange = (e) => {
    setFormPrestasi({ ...formPrestasi, [e.target.name]: e.target.value });
  };

  const handlePrestasiSubmit = (e) => {
    e.preventDefault();
    if (!formPrestasi.nama.trim() || !formPrestasi.prestasi.trim() || !formPrestasi.level.trim()) {
      alert('Semua bidang prestasi harus diisi!');
      return;
    }

    let badgeColor = 'bg-primary';
    if (formPrestasi.badge === 'Provinsi') badgeColor = 'bg-purple-500';
    if (formPrestasi.badge === 'Kota') badgeColor = 'bg-blue-500';
    if (formPrestasi.badge === 'Internasional') badgeColor = 'bg-red-600';
    if (formPrestasi.badge === 'Regional') badgeColor = 'bg-cyan-600';

    let newList = [...prestasiList];
    if (editingId !== null) {
      newList = newList.map((item) =>
        item.id === editingId
          ? { ...item, ...formPrestasi, badgeColor }
          : item
      );
      setEditingId(null);
      showToast('Prestasi siswa berhasil diperbarui!');
    } else {
      const newId = newList.length > 0 ? Math.max(...newList.map(o => o.id)) + 1 : 1;
      newList.unshift({
        id: newId,
        ...formPrestasi,
        badgeColor
      });
      showToast('Prestasi siswa baru berhasil ditambahkan!');
    }

    localStore.savePrestasiSiswa(newList);
    setPrestasiList(newList);
    setFormPrestasi({
      nama: '',
      prestasi: '',
      level: '',
      badge: 'Nasional'
    });
  };

  const handlePrestasiEdit = (item) => {
    setFormPrestasi({
      nama: item.nama,
      prestasi: item.prestasi,
      level: item.level,
      badge: item.badge || 'Nasional'
    });
    setEditingId(item.id);
  };

  const handlePrestasiDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus prestasi ini?')) {
      const newList = prestasiList.filter((item) => item.id !== id);
      localStore.savePrestasiSiswa(newList);
      setPrestasiList(newList);
      showToast('Prestasi siswa berhasil dihapus.');
      if (editingId === id) {
        setEditingId(null);
        setFormPrestasi({
          nama: '',
          prestasi: '',
          level: '',
          badge: 'Nasional'
        });
      }
    }
  };

  const handlePrestasiCancel = () => {
    setEditingId(null);
    setFormPrestasi({
      nama: '',
      prestasi: '',
      level: '',
      badge: 'Nasional'
    });
  };

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  const filteredList = prestasiList.filter(item => 
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.prestasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats calculation
  const countStats = () => {
    let intl = 0, nas = 0, prov = 0, kota = 0;
    prestasiList.forEach(item => {
      const b = item.badge?.toLowerCase();
      if (b === 'internasional') intl++;
      else if (b === 'nasional') nas++;
      else if (b === 'provinsi') prov++;
      else kota++;
    });
    return { intl, nas, prov, kota, total: prestasiList.length };
  };

  const stats = countStats();

  return (
    <div>
      {/* ====== Breadcrumb ====== */}
      <div className="flex items-center gap-2 text-xs text-dark-400 mb-4">
        <span className="text-primary font-medium">Admin Panel</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-primary font-medium">Kelola Konten</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-bold text-dark-800">Prestasi Siswa</span>
      </div>

      {/* ====== Page Header ====== */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-800">Kelola Prestasi Siswa</h1>
        <p className="text-xs text-dark-400 mt-1">Kelola daftar prestasi akademik & non-akademik siswa SMAN 12</p>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-lg transition-all duration-300 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {successMsg}
        </div>
      )}

      {/* ====== Stats Cards ====== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-dark-100 shadow-sm">
          <p className="text-[10px] font-bold text-dark-400 uppercase tracking-wider">Total Prestasi</p>
          <p className="text-xl font-extrabold text-dark-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-dark-100 shadow-sm">
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Internasional</p>
          <p className="text-xl font-extrabold text-red-600 mt-1">{stats.intl}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-dark-100 shadow-sm">
          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Nasional</p>
          <p className="text-xl font-extrabold text-orange-500 mt-1">{stats.nas}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-dark-100 shadow-sm">
          <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Provinsi</p>
          <p className="text-xl font-extrabold text-purple-500 mt-1">{stats.prov}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-dark-100 shadow-sm">
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Kota / Wilayah</p>
          <p className="text-xl font-extrabold text-blue-500 mt-1">{stats.kota}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="bg-white rounded-xl p-5 border border-dark-100 shadow-sm h-fit">
          <h2 className="text-sm font-extrabold text-[#F5921B] border-b border-dark-50 pb-2.5 mb-4">
            {editingId !== null ? '✏️ Edit Prestasi Siswa' : '🏆 Tambah Prestasi Baru'}
          </h2>
          <form onSubmit={handlePrestasiSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-dark-700 mb-1">Nama Siswa / Tim</label>
              <input
                type="text"
                name="nama"
                value={formPrestasi.nama}
                onChange={handlePrestasiChange}
                placeholder="Contoh: Ronald Ricky Candra"
                required
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-dark-700 mb-1">Prestasi yang Diraih</label>
              <textarea
                name="prestasi"
                value={formPrestasi.prestasi}
                onChange={handlePrestasiChange}
                placeholder="Contoh: Juara 1 Pencak Silat TAPCHA 7"
                required
                rows={2}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition bg-white resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-dark-700 mb-1">Tingkat / Tahun Penyelenggaraan</label>
              <input
                type="text"
                name="level"
                value={formPrestasi.level}
                onChange={handlePrestasiChange}
                placeholder="Contoh: Tingkat Nasional 2025"
                required
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-dark-700 mb-1">Kategori Tingkatan</label>
              <select
                name="badge"
                value={formPrestasi.badge}
                onChange={handlePrestasiChange}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition bg-white font-medium"
              >
                <option value="Internasional">Internasional</option>
                <option value="Nasional">Nasional</option>
                <option value="Provinsi">Provinsi</option>
                <option value="Regional">Regional</option>
                <option value="Kota">Kota / Wilayah</option>
              </select>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-[#F5921B] hover:bg-[#E8850F] text-white text-xs font-bold rounded-lg transition-all text-center shadow-sm active:scale-95"
              >
                {editingId !== null ? 'Simpan Perubahan' : 'Tambahkan Prestasi'}
              </button>
              {editingId !== null && (
                <button
                  type="button"
                  onClick={handlePrestasiCancel}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-all active:scale-95"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table/List Column */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-dark-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-dark-50 pb-3">
            <h2 className="text-sm font-extrabold text-[#F5921B]">Daftar Prestasi Siswa SMAN 12</h2>
            
            <div className="relative w-full sm:w-60">
              <input
                type="text"
                placeholder="Cari nama, prestasi, tingkat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
              />
              <svg className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-dark-100 text-[10px] font-bold text-dark-500 bg-slate-50 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Nama Siswa / Tim</th>
                  <th className="py-2.5 px-3">Prestasi</th>
                  <th className="py-2.5 px-3">Tingkat / Tahun</th>
                  <th className="py-2.5 px-3">Tingkatan</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-50">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-dark-400 italic">
                      Tidak ada data prestasi siswa ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-dark-800">{item.nama}</td>
                      <td className="py-3 px-3 text-dark-600 font-medium max-w-xs">{item.prestasi}</td>
                      <td className="py-3 px-3 text-dark-500">{item.level}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white shadow-sm ${item.badgeColor || 'bg-primary'}`}>
                          {item.badge}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handlePrestasiEdit(item)}
                          className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded text-[10px] font-bold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePrestasiDelete(item.id)}
                          className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded text-[10px] font-bold transition-colors"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaPrestasiPage;
