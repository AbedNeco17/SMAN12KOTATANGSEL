import { useState, useEffect } from 'react';
import { localStore } from '@services/localStore';
import BeritaCard from '@components/ui/BeritaCard';

const BeritaListPage = () => {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');

  useEffect(() => {
    const data = localStore.getBerita();
    const published = data.filter((item) => item.status === 'published');
    setNews(published);
  }, []);

  const filteredNews = news.filter((item) => {
    const matchesSearch = item.judul.toLowerCase().includes(search.toLowerCase()) || 
                          (item.deskripsi && item.deskripsi.toLowerCase().includes(search.toLowerCase()));
    
    if (activeTab === 'Semua') {
      return matchesSearch;
    }
    return matchesSearch && item.kategori === activeTab.toLowerCase();
  });

  return (
    <div className="py-10 bg-slate-50/30">
      <div className="container-main">
        {/* ========================================
            Header Area
            ======================================== */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-dark-800 mb-2">
            Berita &amp; Kegiatan Sekolah
          </h1>
          <p className="text-sm text-dark-400 max-w-lg">
            Temukan berita terbaru, pengumuman resmi, kegiatan kesiswaan, dan prestasi unggulan dari SMAN 12.
          </p>
        </div>

        {/* ========================================
            Search and Filter Tabs
            ======================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-1.5">
            {['Semua', 'Berita', 'Kegiatan', 'Prestasi'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                  activeTab === tab
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-dark-600 border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Cari berita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg bg-white
                         focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* ========================================
            Grid View
            ======================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
          {filteredNews.map((item) => (
            <BeritaCard
              key={item.id}
              id={item.id}
              judul={item.judul}
              deskripsi={item.deskripsi}
              thumbnail={item.thumbnail}
            />
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm mt-4">
            <svg className="w-12 h-12 text-dark-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
            </svg>
            <p className="text-sm text-dark-400">Tidak ada berita yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeritaListPage;
