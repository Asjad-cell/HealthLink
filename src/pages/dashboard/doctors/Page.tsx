import { useAuth } from "../../../contexts/useAuth";
import AdminDoctorsPage from './AdminDoctorsPage';

const Page = () => {
  const { isAdmin } = useAuth();

  // Only admins can manage doctors
  if (isAdmin) {
    return <AdminDoctorsPage />;
  }

  // Doctors don't have access to doctor management
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-600">You don't have permission to access this page.</p>
    </div>
  );
};

export default Page;
