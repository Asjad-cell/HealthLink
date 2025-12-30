import { useAuth } from "../../../contexts/useAuth";
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';

const Page = () => {
  const { isAdmin, isDoctor } = useAuth();

  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isDoctor) {
    return <DoctorDashboard />;
  }

  // Fallback for unknown roles
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to HealthLink</h2>
      <p className="text-gray-600">Your dashboard is being prepared...</p>
    </div>
  );
};

export default Page;
