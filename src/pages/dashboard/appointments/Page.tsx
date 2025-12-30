import React, { useState, useEffect } from "react";
import { Eye, RefreshCw, Calendar, X } from "lucide-react";
import { adminService } from "../../../services";
import { authService } from "../../../services/authService";
import { Appointment } from "../../../types/api";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { ErrorMessage } from "../../../components/common/ErrorMessage";

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState<
    Appointment["patient"]["medicalHistory"] | null
  >(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch current user profile from API
      const currentUser = await authService.getProfile();

      let fetchedAppointments: Appointment[] = [];

      if (currentUser.role === "admin") {
        const res = await adminService.getAllAppointments();
        fetchedAppointments = res.appointments || [];
      } else if (currentUser.role === "doctor" && currentUser.doctorProfile) {
        if (!currentUser.doctorProfile.id) {
          throw new Error("Doctor profile ID is missing");
        }
        const res = await adminService.getAppointmentsByDoctor(
          currentUser.doctorProfile.id
        );
        fetchedAppointments = res.appointments || [];
      } else {
        throw new Error("Invalid user role or missing doctor profile");
      }

      setAppointments(fetchedAppointments);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load appointments";

      setError(errorMessage);
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
        onRetry={loadAppointments}
        className="m-6"
      />
    );
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <button
            onClick={loadAppointments}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {appointments.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                No appointments found
              </p>
              <button
                onClick={loadAppointments}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appt) => {
                  const status = appt.patient?.medicalHistory?.length
                    ? "Completed"
                    : "Pending";
                  return (
                    <tr key={appt._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appt.patient?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appt.patient?.email || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appt.doctor?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appt.doctor?.specialization || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(appt.appointmentDate).toLocaleDateString()} at{" "}
                        {appt.timeSlot}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            setSelectedMedicalHistory(
                              appt.patient?.medicalHistory || []
                            )
                          }
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedMedicalHistory && (
        <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative">
            <button
              onClick={() => setSelectedMedicalHistory(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Medical History</h2>
            {selectedMedicalHistory.length === 0 ? (
              <p className="text-gray-500">No medical records found.</p>
            ) : (
              <ul className="space-y-4">
                {selectedMedicalHistory.map((record) => (
                  <li
                    key={record.recordedAt}
                    className="border p-4 rounded-lg bg-gray-50"
                  >
                    <p>
                      <span className="font-semibold">Disease:</span>{" "}
                      {record.disease}
                    </p>
                    <p>
                      <span className="font-semibold">Diagnosis:</span>{" "}
                      {record.diagnosis}
                    </p>
                    <p>
                      <span className="font-semibold">Treatment:</span>{" "}
                      {record.treatment}
                    </p>
                    <p className="text-sm text-gray-400">
                      Recorded at:{" "}
                      {new Date(record.recordedAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentsPage;
