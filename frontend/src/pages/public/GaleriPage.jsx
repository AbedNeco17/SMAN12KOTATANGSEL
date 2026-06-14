import { useState, useEffect } from 'react';
import { localStore } from '@services/localStore';

const categories = ['Semua', 'Akademik', 'Ekstrakurikuler', 'Fasilitas', 'Prestasi', 'Umum'];

const GaleriPage = () => {
  const [galeriList, setGaleriList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setGaleriList(localStore.getGaleri());
  }, []);

  const filtered = activeCategory === 'Semua'
    ? galeriList
    : galeriList.filter((g) => g.kategori.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div>
      {/* ==========================================
          HEADER — left-aligned, bold
          ========================================== */}
      <section className="pt-8 pb-4 md:pt-10 md:pb-5">
        <div className="container-main">
          <h1 className="text-2xl md:text-3xl font-extrabold text-dark-800 mb-1">
            Galeri SMAN 12
          </h1>
          <p className="text-sm text-dark-400 leading-relaxed max-w-lg">
            Dokumentasi kegiatan akademik, ekstrakurikuler, fasilitas, dan prestasi sekolah.
          </p>
        </div>
      </section>

      {/* ==========================================
          FILTER TABS — pill buttons
          ========================================== */}
      <section className="pb-6">
        <div className="container-main">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
                  ${activeCategory === cat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-dark-600 border-gray-200 hover:border-primary hover:text-primary'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          GALLERY GRID — 3 columns, cards with title + category
          ========================================== */}
      <section className="pb-12 md:pb-16">
        <div className="container-main">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#F5EFE6] transition-transform duration-300 group-hover:shadow-md group-hover:-translate-y-0.5">
                  {item.gambar ? (
                    <img
                      src={item.gambar}
                      alt={item.judul}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="text-xs md:text-sm font-bold text-dark-800 leading-snug group-hover:text-primary transition-colors">
                    {item.judul}
                  </h3>
                  <p className="text-[11px] text-dark-400 mt-0.5">
                    {item.kategori}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-12 h-12 text-dark-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-dark-400">Belum ada galeri untuk kategori ini</p>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          LIGHTBOX — Image preview modal
          ========================================== */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative bg-white rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="aspect-video bg-[#F5EFE6]">
              {selectedItem.gambar ? (
                <img src={selectedItem.gambar} alt={selectedItem.judul} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-dark-300">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-base font-bold text-dark-800">{selectedItem.judul}</h3>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {selectedItem.kategori}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriPage;
