import React, { useState, useEffect } from "react";
import { Search, Users, Eye, Calendar, FileText, Edit3 } from "lucide-react";
import { adminService } from "../../../services";
import { Patient } from "../../../types/api";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { ErrorMessage } from "../../../components/common/ErrorMessage";
import { AppointmentBookingForm } from "@components/forms/AppointmentBookingForm";

const AdminPatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getAllPatients(1, 50);
      setPatients(response.data.patients || []);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load patients"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
  };

  const handleUpdatePatient = async (updatedPatient: Partial<Patient>) => {
    if (!selectedPatient) return;
    try {
      await adminService.updatePatient(selectedPatient._id, updatedPatient);
      setIsEditModalOpen(false);
      loadPatients();
    } catch (err) {
      console.error("Failed to update patient", err);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage message={error} onRetry={loadPatients} className="m-6" />
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Patient Management
          </h1>
          <p className="text-gray-600">View and manage all patient records</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <Users className="w-8 h-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Patients</p>
            <p className="text-2xl font-bold text-gray-900">
              {patients.length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <Calendar className="w-8 h-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">New This Month</p>
            <p className="text-2xl font-bold text-gray-900">
              {
                patients.filter((p) => {
                  const patientDate = new Date(p.createdAt);
                  const now = new Date();
                  return (
                    patientDate.getMonth() === now.getMonth() &&
                    patientDate.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <FileText className="w-8 h-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">With Records</p>
            <p className="text-2xl font-bold text-gray-900">
              {patients.filter((p) => p.medicalHistory.length > 0).length}
            </p>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Patients</h2>
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Patient
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demographics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medical Records
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {patient.name}
                    </div>
                    {patient.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {patient.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.email}</div>
                    <div className="text-sm text-gray-500">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {patient.age} years old
                    </div>
                    <div className="text-sm text-gray-500">
                      {patient.gender}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {patient.medicalHistory.length} records
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <button
                      onClick={() => handleViewPatient(patient)}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditPatient(patient)}
                      className="text-black flex items-center"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              No patients found
            </p>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Patients will appear here when they book appointments"}
            </p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedPatient && (
        <EditPatientModal
          patient={selectedPatient}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdatePatient}
        />
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsBookingModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Book Appointment
              </h2>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsBookingModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <AppointmentBookingForm
              onSuccess={() => {
                setIsBookingModalOpen(false);
                loadPatients();
              }}
              className="mt-4"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// --- Separate Components for Modals ---

const PatientDetailsModal: React.FC<{
  patient: Patient;
  onClose: () => void;
}> = ({ patient, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Patient Details</h2>
        <p className="text-sm text-gray-600">{patient.name}</p>
      </div>
      <div className="px-6 py-4">
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-900 mb-3">
            Basic Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Name</p>
              <p className="text-sm text-gray-900">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Age</p>
              <p className="text-sm text-gray-900">{patient.age} years old</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Gender</p>
              <p className="text-sm text-gray-900">{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Registered</p>
              <p className="text-sm text-gray-900">
                {new Date(patient.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-900 mb-3">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="text-sm text-gray-900">{patient.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Phone</p>
              <p className="text-sm text-gray-900">{patient.phone}</p>
            </div>
            {patient.description && (
              <div>
                <p className="text-sm font-medium text-gray-600">Description</p>
                <p className="text-sm text-gray-900">{patient.description}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-md font-semibold text-gray-900 mb-3">
            Medical History
          </h3>
          {patient.medicalHistory.length > 0 ? (
            <div className="space-y-4">
              {patient.medicalHistory.map((record, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Disease
                      </p>
                      <p className="text-sm text-gray-900">{record.disease}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Diagnosis
                      </p>
                      <p className="text-sm text-gray-900">
                        {record.diagnosis}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Treatment
                      </p>
                      <p className="text-sm text-gray-900">
                        {record.treatment}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Recorded on{" "}
                    {new Date(record.recordedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No medical records available
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const EditPatientModal: React.FC<{
  patient: Patient;
  onClose: () => void;
  onUpdate: (data: Partial<Patient>) => void;
}> = ({ patient, onClose, onUpdate }) => {
  const [name, setName] = useState(patient.name);
  const [email, setEmail] = useState(patient.email);
  const [phone, setPhone] = useState(patient.phone);
  const [age, setAge] = useState(patient.age);
  const [gender, setGender] = useState(patient.gender);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Edit Patient
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <h1 className="font-semibold">Name</h1>
          <input
            type="text"
            className="border px-3 py-2 rounded-lg"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <h1 className="font-semibold">Email</h1>
          <input
            type="email"
            className="border px-3 py-2 rounded-lg"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <h1 className="font-semibold">Phone</h1>
          <input
            type="text"
            className="border px-3 py-2 rounded-lg"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <h1 className="font-semibold">Age</h1>
          <input
            type="number"
            className="border px-3 py-2 rounded-lg"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
          <h1 className="font-semibold">Gender</h1>
          <select
            value={gender}
            onChange={(e) =>
              setGender(e.target.value as "Male" | "Female" | "Other")
            }
            className="border px-3 py-2 rounded-lg"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onUpdate({ name, email, phone, age, gender })
            }
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPatientsPage;
