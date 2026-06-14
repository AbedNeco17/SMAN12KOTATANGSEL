import { Link } from 'react-router-dom';

/**
 * Reusable Berita/News Card — matching design:
 * Simple rounded rectangle with cream/beige bg placeholder
 * Clean, minimal style
 */
const BeritaCard = ({ id, judul, deskripsi, thumbnail }) => {
  return (
    <Link
      to={id ? `/berita/${id}` : '#'}
      className="group block rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Image / Placeholder */}
      <div className="aspect-[4/3] overflow-hidden bg-[#F5EFE6] rounded-lg">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={judul || 'Berita'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>

      {/* Content — only show if data exists */}
      {judul && (
        <div className="pt-2.5 pb-1">
          <h3 className="text-sm font-semibold text-dark-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {judul}
          </h3>
          {deskripsi && (
            <p className="text-xs text-dark-400 leading-relaxed mt-1 line-clamp-2">
              {deskripsi}
            </p>
          )}
        </div>
      )}
    </Link>
  );
};

export default BeritaCard;
