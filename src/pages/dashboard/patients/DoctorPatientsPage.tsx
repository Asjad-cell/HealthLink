import React, { useState, useEffect } from "react";
import { Search, Users, Plus, FileText, Edit } from "lucide-react";
import { doctorService } from "../../../services";
import { Patient, AddMedicalRecordRequest } from "../../../types/api";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { ErrorMessage } from "../../../components/common/ErrorMessage";
import { useApi } from "../../../hooks/useApi";
import { toast } from "sonner";

const DoctorPatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isEditRecordOpen, setIsEditRecordOpen] = useState(false);
  const [editingRecordIndex, setEditingRecordIndex] = useState<number | null>(
    null
  );
  const [billingAmount, setBillingAmount] = useState<number>(0);

  useEffect(() => {
    if (selectedPatient) {
      setBillingAmount(selectedPatient.billingAmount || 0);
    }
  }, [selectedPatient]);

  const [recordData, setRecordData] = useState<AddMedicalRecordRequest>({
    disease: "",
    diagnosis: "",
    treatment: "",
    billingAmount: 0,
  });

  const { execute: addRecord, loading: addingRecord } = useApi(
    doctorService.addPatientRecord
  );
  const { execute: updateRecord, loading: updatingRecord } = useApi(
    doctorService.updatePatientRecord
  ); // Assuming service exists

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await doctorService.getMyPatients(1, 50);
      setPatients(response.data.patients || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load patients";
      toast.error(errorMessage, { id: 'patients-error' });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleAddRecord = (patient: Patient) => {
    setSelectedPatient(patient);
    setRecordData({ disease: "", diagnosis: "", treatment: "", billingAmount: 0 });
    setIsAddRecordOpen(true);
  };

  const handleEditRecord = (patient: Patient, index: number) => {
    setSelectedPatient(patient);
    setEditingRecordIndex(index);
    const record = patient.medicalHistory[index];
    setRecordData({
      disease: record.disease,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
    });
    setIsEditRecordOpen(true);
  };

  const handleSaveRecord = async () => {
    if (!selectedPatient) return;

    try {
      if (isEditRecordOpen && editingRecordIndex !== null) {
        // Update existing record
        await updateRecord(selectedPatient._id, editingRecordIndex, recordData);
        toast.success('Medical record updated successfully!', { id: 'record-updated' });
      } else {
        // Add new record
        await addRecord(selectedPatient._id, recordData);
        toast.success('Medical record added successfully!', { id: 'record-added' });
      }

      setIsAddRecordOpen(false);
      setIsEditRecordOpen(false);
      setRecordData({ disease: "", diagnosis: "", treatment: "", billingAmount: 0 });
      setEditingRecordIndex(null);
      loadPatients(); // Refresh to get updated patient data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save medical record';
      toast.error(errorMessage, { id: 'record-error' });
    }
  };

  const handleSaveBilling = async () => {
    if (!selectedPatient) return;

    try {
      // Call your backend API to update billing amount
      const updatedPatient = await doctorService.updatePatientBilling(selectedPatient._id, {
        billingAmount,
      });

      // Update the selected patient with the new data
      setSelectedPatient(updatedPatient);

      // Refresh patient list in background
      loadPatients();

      // Success toast
      toast.success("Billing amount updated successfully", { id: 'billing-updated' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update billing amount";
      toast.error(errorMessage, { id: 'billing-error' });
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Patients</h1>
          <p className="text-gray-600">
            Manage your assigned patients and their medical records
          </p>
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

      {/* Stats Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center">
          <Users className="w-8 h-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Patients</p>
            <p className="text-2xl font-bold text-gray-900">
              {patients.length}
            </p>
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div
            key={patient._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {patient.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {patient.age} years old • {patient.gender}
                </p>
              </div>
              <div className="flex items-center">
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {patient.medicalHistory.length} records
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {patient.email}
              </p>

              <p className="text-sm text-gray-600">
                <strong>Phone:</strong> {patient.phone}
              </p>
              {patient.latestAppointmentReason && (
                <p className="text-sm text-gray-600">
                  <strong>Latest Visit Reason:</strong>{" "}
                  {patient.latestAppointmentReason}
                </p>
              )}
              {patient.totalAppointments && (
                <p className="text-sm text-gray-600">
                  <strong>Total Appointments:</strong>{" "}
                  {patient.totalAppointments}
                </p>
              )}
              {patient.description && (
                <p className="text-sm text-gray-600">
                  <strong>Notes:</strong> {patient.description}
                </p>
              )}
              <p className="text-sm text-gray-600">
                <strong>Billing Amount:</strong> $
                {patient.billingAmount?.toFixed(2) || "0.00"}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleViewPatient(patient)}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <FileText className="w-4 h-4" />
                <span>View Records</span>
              </button>
              <button
                onClick={() => handleAddRecord(patient)}
                className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            No patients found
          </p>
          <p className="text-gray-600">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Patients will appear here when they book appointments with you"}
          </p>
        </div>
      )}

      {/* Patient Details Modal */}
      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Patient Records
              </h2>
              <p className="text-sm text-gray-600">{selectedPatient.name}</p>
            </div>

            <div className="px-6 py-4">
              {/* Basic Information */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3">
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Age</p>
                    <p className="text-sm text-gray-900">
                      {selectedPatient.age} years old
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Gender</p>
                    <p className="text-sm text-gray-900">
                      {selectedPatient.gender}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-sm text-gray-900">
                      {selectedPatient.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-sm text-gray-900">
                      {selectedPatient.phone}
                    </p>
                  </div>
                  {selectedPatient.totalAppointments && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Visits
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedPatient.totalAppointments}
                      </p>
                    </div>
                  )}
                  {selectedPatient.latestAppointmentDate && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Last Visit
                      </p>
                      <p className="text-sm text-gray-900">
                        {new Date(
                          selectedPatient.latestAppointmentDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointment Reasons */}
              {selectedPatient.appointmentReasons &&
                selectedPatient.appointmentReasons.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-3">
                      Visit Reasons
                    </h3>
                    <div className="space-y-2">
                      {selectedPatient.appointmentReasons.map(
                        (reason, index) => (
                          <div
                            key={index}
                            className="bg-blue-50 rounded-lg p-3"
                          >
                            <p className="text-sm text-blue-800">{reason}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Billing */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3">
                  Billing
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={billingAmount || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        setBillingAmount(value === "" ? 0 : parseFloat(value));
                      }
                    }}
                    className="w-[60%] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Amount"
                  />
                  <button
                    onClick={handleSaveBilling}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save Billing
                  </button>
                </div>
              </div>

              {/* Medical History */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-gray-900">
                    Medical History
                  </h3>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleAddRecord(selectedPatient);
                    }}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Record</span>
                  </button>
                </div>

                {selectedPatient.medicalHistory.length > 0 ? (
                  <div className="space-y-4">
                    {selectedPatient.medicalHistory.map((record, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Disease
                              </p>
                              <p className="text-sm text-gray-900">
                                {record.disease}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setIsModalOpen(false);
                                handleEditRecord(selectedPatient, index);
                              }}
                              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
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
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Medical Record Modal */}
      {(isAddRecordOpen || isEditRecordOpen) && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setIsAddRecordOpen(false);
              setIsEditRecordOpen(false);
            }}
          />

          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditRecordOpen
                  ? "Edit Medical Record"
                  : "Add Medical Record"}
              </h2>
              <p className="text-sm text-gray-600">
                For {selectedPatient.name}
              </p>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disease *
                </label>
                <input
                  type="text"
                  value={recordData.disease}
                  onChange={(e) =>
                    setRecordData((prev) => ({
                      ...prev,
                      disease: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Hypertension"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosis *
                </label>
                <textarea
                  value={recordData.diagnosis}
                  onChange={(e) =>
                    setRecordData((prev) => ({
                      ...prev,
                      diagnosis: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Detailed diagnosis..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment *
                </label>
                <textarea
                  value={recordData.treatment}
                  onChange={(e) =>
                    setRecordData((prev) => ({
                      ...prev,
                      treatment: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Treatment plan and medications..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setIsAddRecordOpen(false);
                  setIsEditRecordOpen(false);
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRecord}
                disabled={
                  addingRecord ||
                  updatingRecord ||
                  !recordData.disease ||
                  !recordData.diagnosis ||
                  !recordData.treatment
                }
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center"
              >
                {addingRecord || updatingRecord ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : isEditRecordOpen ? (
                  "Update Record"
                ) : (
                  "Add Record"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatientsPage;
