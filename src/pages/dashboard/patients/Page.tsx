import { useAuth } from "../../../contexts/useAuth";
import AdminPatientsPage from './AdminPatientsPage';
import DoctorPatientsPage from './DoctorPatientsPage';

const Page = () => {
  const { isAdmin, isDoctor } = useAuth();

  if (isAdmin) {
    return <AdminPatientsPage />;
  }

  if (isDoctor) {
    return <DoctorPatientsPage />;
  }

  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-600">You don't have permission to access this page.</p>
    </div>
  );
};

export default Page;
