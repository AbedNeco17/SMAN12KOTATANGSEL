import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '@components/layout/Sidebar';

const AdminLayout = () => {
  // TODO: Remove DEV_MODE bypass when auth is fully implemented
  const DEV_MODE = true;

  // Check if user is authenticated
  const token = localStorage.getItem('token');

  if (!token && !DEV_MODE) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      <Sidebar />
      <main className="flex-1 ml-[220px] p-5">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
