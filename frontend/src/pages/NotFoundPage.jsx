import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-50 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-primary mb-4">404</h1>
        <p className="text-xl text-dark-500 mb-8">Halaman tidak ditemukan</p>
        <Link to="/" className="btn-primary">Kembali ke Beranda</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
