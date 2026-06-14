import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { localStore } from '@services/localStore';

const DetailBeritaPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const data = localStore.getBeritaById(id);
    setItem(data);

    if (data) {
      const allNews = localStore.getBerita();
      const filtered = allNews
        .filter((n) => n.id !== data.id && n.status === 'published')
        .slice(0, 3);
      setRelated(filtered);
    }
  }, [id]);

  if (!item) {
    return (
      <div className="py-20 text-center container-main">
        <h2 className="text-xl font-bold text-dark-800">Detail Konten Tidak Ditemukan</h2>
        <p className="text-sm text-dark-400 mt-2">Konten yang Anda cari mungkin telah dihapus atau dipindahkan.</p>
        <Link to="/berita" className="inline-block mt-4 btn-primary text-xs">
          Kembali ke Berita
        </Link>
      </div>
    );
  }

  const categoryColors = {
    berita: 'bg-green-100 text-green-700',
    pengumuman: 'bg-orange-100 text-orange-700',
    kegiatan: 'bg-amber-100 text-amber-700',
    prestasi: 'bg-blue-100 text-blue-700'
  };

  return (
    <div className="py-10 bg-slate-50/20">
      <div className="container-main max-w-4xl">
        {/* ========================================
            Breadcrumbs
            ======================================== */}
        <div className="flex items-center gap-1.5 text-xs text-dark-400 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link to="/berita" className="hover:text-primary transition-colors">Berita</Link>
          <svg className="w-3 h-3 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-semibold text-dark-800 truncate max-w-[200px] sm:max-w-xs">{item.judul}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 items-start">
          {/* ========================================
              Left Section: Content Details
              ======================================== */}
          <article className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${categoryColors[item.kategori] || 'bg-gray-100 text-gray-700'}`}>
                {item.kategori}
              </span>
              <span className="text-xs text-dark-400 font-medium">
                {item.created_at}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl lg:text-[28px] font-extrabold text-dark-800 leading-tight mb-6">
              {item.judul}
            </h1>

            {item.thumbnail && (
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#F5EFE6] border border-slate-100 mb-6">
                <img src={item.thumbnail} alt={item.judul} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="text-dark-700 text-sm leading-relaxed space-y-4 text-justify">
              {item.konten.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {item.tags && (
              <div className="border-t border-slate-100 pt-5 mt-8">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-bold text-dark-500 mr-1">Tags:</span>
                  {item.tags.split(',').map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-50 text-dark-500 rounded text-xs font-medium">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* ========================================
              Right Section: Sidebar Related Posts
              ======================================== */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-extrabold text-dark-800 tracking-wider uppercase mb-4">
                Berita Lainnya
              </h3>
              
              {related.length > 0 ? (
                <div className="space-y-4">
                  {related.map((rel) => (
                    <Link key={rel.id} to={`/berita/${rel.id}`} className="group block">
                      <div className="aspect-video rounded-lg overflow-hidden bg-[#F5EFE6] mb-2 border border-slate-100">
                        {rel.thumbnail ? (
                          <img src={rel.thumbnail} alt={rel.judul} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-dark-800 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {rel.judul}
                      </h4>
                      <span className="text-[10px] text-dark-400 mt-1 block">{rel.created_at}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-dark-300">Tidak ada berita lain.</p>
              )}
            </div>

            <Link
              to="/berita"
              className="flex items-center justify-center gap-2 py-3 bg-white text-dark-700 text-xs font-bold rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Berita
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DetailBeritaPage;
