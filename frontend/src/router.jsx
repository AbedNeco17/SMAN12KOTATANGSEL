import { createHashRouter } from 'react-router-dom';

import PublicLayout from '@layouts/PublicLayout';
import AdminLayout from '@layouts/AdminLayout';

import HomePage from '@pages/public/HomePage';
import VisiMisiPage from '@pages/public/VisiMisiPage';
import HubungiKamiPage from '@pages/public/HubungiKamiPage';
import GaleriPage from '@pages/public/GaleriPage';
import EkstrakurikulerPage from '@pages/public/EkstrakurikulerPage';
import InformasiSekolahPage from '@pages/public/InformasiSekolahPage';
import BeritaListPage from '@pages/public/BeritaListPage';
import DetailBeritaPage from '@pages/public/DetailBeritaPage';
import DownloadPage from '@pages/public/DownloadPage';

import LoginPage from '@pages/auth/LoginPage';
import StudentLoginPage from '@pages/auth/StudentLoginPage';
import SiswaDashboardPage from '@pages/siswa/SiswaDashboardPage';
import OrangTuaDashboardPage from '@pages/siswa/OrangTuaDashboardPage';
import GuruDashboardPage from '@pages/guru/GuruDashboardPage';

import DashboardPage from '@pages/admin/DashboardPage';
import TambahKontenPage from '@pages/admin/TambahKontenPage';
import DataBeritaPage from '@pages/admin/DataBeritaPage';
import KelolaGaleriPage from '@pages/admin/KelolaGaleriPage';
import PengaturanPage from '@pages/admin/PengaturanPage';
import KelolaPrestasiPage from '@pages/admin/KelolaPrestasiPage';
import KelolaDokumenPage from '@pages/admin/KelolaDokumenPage';

import NotFoundPage from '@pages/NotFoundPage';

const router = createHashRouter([
  // ========================================
  // Public Routes
  // ========================================
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'visi-misi',
        element: <VisiMisiPage />,
      },
      {
        path: 'hubungi-kami',
        element: <HubungiKamiPage />,
      },
      {
        path: 'galeri',
        element: <GaleriPage />,
      },
      {
        path: 'ekstrakurikuler',
        element: <EkstrakurikulerPage />,
      },
      {
        path: 'informasi',
        element: <InformasiSekolahPage />,
      },
      {
        path: 'informasi-sekolah',
        element: <InformasiSekolahPage />,
      },
      {
        path: 'berita',
        element: <BeritaListPage />,
      },
      {
        path: 'berita/:id',
        element: <DetailBeritaPage />,
      },
      {
        path: 'download',
        element: <DownloadPage />,
      },
    ],
  },

  // ========================================
  // Auth Routes
  // ========================================
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/kesiswaan/login/siswa',
    element: <StudentLoginPage />,
  },
  {
    path: '/siswa/dashboard',
    element: <SiswaDashboardPage />,
  },
  {
    path: '/orangtua/dashboard',
    element: <OrangTuaDashboardPage />,
  },
  {
    path: '/guru/dashboard',
    element: <GuruDashboardPage />,
  },

  // ========================================
  // Admin Routes (Protected)
  // ========================================
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'tambah-konten',
        element: <TambahKontenPage />,
      },
      {
        path: 'edit-konten/:id',
        element: <TambahKontenPage />,
      },
      {
        path: 'data-berita',
        element: <DataBeritaPage />,
      },
      {
        path: 'galeri',
        element: <KelolaGaleriPage />,
      },
      {
        path: 'prestasi',
        element: <KelolaPrestasiPage />,
      },
      {
        path: 'dokumen',
        element: <KelolaDokumenPage />,
      },
      {
        path: 'pengaturan',
        element: <PengaturanPage />,
      },
    ],
  },

  // ========================================
  // 404
  // ========================================
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
