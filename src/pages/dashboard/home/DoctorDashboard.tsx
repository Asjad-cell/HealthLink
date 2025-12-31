import React, { useEffect, useState } from 'react';
import { Calendar, Users, Clock, CheckCircle, Activity, TrendingUp } from 'lucide-react';
import { doctorService } from '../../../services';
import { DoctorStats, Appointment } from '../../../types/api';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';

const DoctorDashboard: React.FC = () => {
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadDashboardData();
      }
    };

    const handleFocus = () => {
      loadDashboardData();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get all appointments with different statuses to ensure we get everything
      const [statsData, confirmedAppointments, pendingAppointmentsData, completedAppointmentsData] = await Promise.all([
        doctorService.getDoctorStats(),
        doctorService.getMyAppointments(1, 100, 'confirmed'),
        doctorService.getMyAppointments(1, 100, 'pending'),
        doctorService.getMyAppointments(1, 100, 'completed')
      ]);
      
      // Combine all appointments from different status calls
      const allAppointments = [
        ...(confirmedAppointments.data.appointments || []),
        ...(pendingAppointmentsData.data.appointments || []),
        ...(completedAppointmentsData.data.appointments || [])
      ];
      
      // Remove duplicates by ID
      const uniqueAppointments = allAppointments.filter((apt, index, self) => 
        index === self.findIndex((a) => a._id === apt._id)
      );
      
      // Filter appointments based on medical history
      const pendingAppointments = uniqueAppointments.filter(apt => 
        !apt.patient?.medicalHistory || apt.patient.medicalHistory.length === 0
      );
      
      const completedAppointments = uniqueAppointments.filter(apt => 
        apt.patient?.medicalHistory && apt.patient.medicalHistory.length > 0
      );
      
      // Update stats with locally calculated counts (as backup)
      const updatedStats = {
        ...statsData,
        pendingAppointments: statsData.pendingAppointments || pendingAppointments.length,
        completedAppointments: statsData.completedAppointments || completedAppointments.length,
        totalAppointments: statsData.totalAppointments || uniqueAppointments.length
      };
      
      setStats(updatedStats);
      
      // Filter today's appointments from all appointments
      const today = new Date().toISOString().split('T')[0];
      const todaysAppts = uniqueAppointments.filter(apt => 
        apt.appointmentDate.split('T')[0] === today
      ) || [];
      setTodayAppointments(todaysAppts);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={loadDashboardData}
        className="m-6"
      />
    );
  }

  const statCards = [
    {
      title: 'Total Appointments',
      value: stats?.totalAppointments || 0,
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+8%'
    },
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      icon: Users,
      color: 'bg-green-500',
      change: '+15%'
    },
    {
      title: 'Pending Appointments',
      value: stats?.pendingAppointments || 0,
      icon: Clock,
      color: 'bg-orange-500',
      change: '-5%'
    },
    {
      title: 'Today\'s Appointments',
      value: stats?.todayAppointments || 0,
      icon: CheckCircle,
      color: 'bg-purple-500',
      change: '+2%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600">Manage your appointments and patients efficiently.</p>
        </div>
        <button
          onClick={loadDashboardData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{card.change}</span>
                  <span className="text-sm text-gray-500 ml-1">from last week</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
        </div>
        <div className="p-6">
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No appointments scheduled for today.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.patient.name}</p>
                      <p className="text-sm text-gray-600">
                        {appointment.patient.age} years old • {appointment.patient.gender}
                      </p>
                      <p className="text-sm text-gray-500">{appointment.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{appointment.timeSlot}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      appointment.patient?.medicalHistory?.length > 0
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.patient?.medicalHistory?.length > 0 ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default DoctorDashboard;
