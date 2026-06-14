import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { localStore } from '@services/localStore';
import ConfirmModal from '@components/ui/ConfirmModal';

const DataBeritaPage = () => {
  const navigate = useNavigate();
  const [beritaList, setBeritaList] = useState([]);
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBeritaList(localStore.getBerita());
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const filteredList = beritaList.filter((item) => {
    const matchesSearch = item.judul.toLowerCase().includes(search.toLowerCase()) ||
                          (item.tags && item.tags.toLowerCase().includes(search.toLowerCase()));
    
    if (filterKategori === 'Semua') {
      return matchesSearch;
    }
    return matchesSearch && item.kategori === filterKategori;
  });

  const getStatusBadge = (status) => {
    if (status === 'published') {
      return 'bg-green-50 text-green-600 border border-green-200';
    }
    return 'bg-gray-100 text-gray-600 border border-gray-200';
  };

  const getCategoryBadge = (kategori) => {
    switch (kategori) {
      case 'prestasi':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'kegiatan':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'pengumuman':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div>
      {/* ====== Page Header ====== */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Kelola Konten Sekolah</h1>
          <p className="text-xs text-dark-400 mt-1">Kelola berita, pengumuman, prestasi, dan kegiatan SMAN 12</p>
        </div>
        <Link 
          to="/admin/tambah-konten" 
          className="px-4 py-2 bg-[#F5921B] hover:bg-[#E8850F] text-white text-xs font-bold rounded-lg transition-all shadow-sm"
        >
          + Tambah Baru
        </Link>
      </div>

      {/* ====== Search & Filters ====== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white p-4 rounded-xl border border-dark-100 shadow-sm">
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Cari judul atau tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg bg-white
                       focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-dark-500 font-medium">Kategori:</span>
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="berita">Berita</option>
            <option value="pengumuman">Pengumuman</option>
            <option value="kegiatan">Kegiatan</option>
            <option value="prestasi">Prestasi</option>
          </select>
        </div>
      </div>

      {/* ====== Data Table ====== */}
      <div className="bg-white rounded-xl shadow-sm border border-dark-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-50">
              <tr className="border-b border-dark-100">
                <th className="text-left px-6 py-3 font-medium text-dark-500 text-xs uppercase tracking-wider">Thumbnail</th>
                <th className="text-left px-6 py-3 font-medium text-dark-500 text-xs uppercase tracking-wider">Judul</th>
                <th className="text-left px-6 py-3 font-medium text-dark-500 text-xs uppercase tracking-wider">Kategori</th>
                <th className="text-left px-6 py-3 font-medium text-dark-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 font-medium text-dark-500 text-xs uppercase tracking-wider">Tanggal</th>
                <th className="text-center px-6 py-3 font-medium text-dark-500 text-xs uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-dark-50/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.thumbnail ? (
                      <img 
                        src={item.thumbnail} 
                        alt="Thumbnail" 
                        className="w-12 h-9 object-cover rounded-md border border-gray-200" 
                      />
                    ) : (
                      <div className="w-12 h-9 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-[10px] text-gray-400">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs md:max-w-md">
                      <p className="font-bold text-dark-800 text-xs truncate" title={item.judul}>{item.judul}</p>
                      {item.tags && (
                        <p className="text-[10px] text-dark-400 mt-0.5 font-medium truncate">Tags: {item.tags}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold capitalize ${getCategoryBadge(item.kategori)}`}>
                      {item.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-dark-600">
                    {item.created_at}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/edit-konten/${item.id}`)}
                        className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold transition"
                        title="Edit Konten"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-dark-400 hover:text-red-600 transition"
                        title="Hapus"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-dark-400 text-xs">
                    Tidak ada data berita atau pengumuman
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            localStore.deleteBerita(deleteId);
            localStore.deletePengumuman(deleteId);
            loadData();
          }
        }}
        title="Hapus Konten"
        message="Apakah Anda yakin ingin menghapus konten berita/pengumuman ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
      />
    </div>
  );
};

export default DataBeritaPage;
