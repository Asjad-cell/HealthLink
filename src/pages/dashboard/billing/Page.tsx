import React, { useState, useEffect } from 'react';
import { Search, DollarSign, Users, TrendingUp } from 'lucide-react';
import { adminService } from '../../../services';
import { Patient } from '../../../types/api';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';

const AdminBillingPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getAllPatients(1, 100);
      setPatients(response.data.patients || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load patients';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // All patients with billing (including 0 for debugging)
  const allPatients = patients;
  
  // Patients with actual billing amounts
  const billedPatients = patients.filter(
    patient => patient.billingAmount && patient.billingAmount > 0
  );

  // Calculate total billing
  const totalBilling = billedPatients.reduce(
    (sum, patient) => sum + (patient.billingAmount || 0),
    0
  );

  // Search filter
  const filteredPatients = billedPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate average
  const averageBilling = billedPatients.length > 0 
    ? totalBilling / billedPatients.length 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Billing Overview</h1>
        <p className="text-gray-600">Complete billing records for all patients</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalBilling.toFixed(2)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                All-time total
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients Billed</p>
              <p className="text-2xl font-bold text-gray-900">
                {billedPatients.length}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Patients with billing records
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Bill</p>
              <p className="text-2xl font-bold text-gray-900">
                ${averageBilling.toFixed(2)}
              </p>
              <p className="text-xs text-purple-600 mt-1">Per patient</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* All-Time Billing Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">All Billing Records</h2>
              <p className="text-sm text-gray-600 mt-1">
                Complete billing history for all patients
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-64 mt-4 sm:mt-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Latest Diagnosis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billing Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => {
                const latestRecord = patient.medicalHistory[patient.medicalHistory.length - 1];
                return (
                  <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {patient.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.age} years • {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {latestRecord ? (
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {latestRecord.disease}
                          </div>
                          <div className="text-gray-500 truncate max-w-xs">
                            {latestRecord.diagnosis}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          No diagnosis
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-green-600">
                        ${patient.billingAmount?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.email}</div>
                      <div className="text-sm text-gray-500">{patient.phone}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">
                {searchQuery ? 'No matching billing records' : billedPatients.length === 0 ? 'No billing records found' : 'No patients found'}
              </p>
              <p className="text-sm mt-1">
                {searchQuery 
                  ? 'Try adjusting your search criteria' 
                  : billedPatients.length === 0
                  ? 'Billing records will appear here when doctors update patient billing'
                  : 'All patients are shown above'}
              </p>
              {allPatients.length > 0 && billedPatients.length === 0 && (
                <div className="mt-4 text-xs text-gray-400">
                  <p>Total patients in system: {allPatients.length}</p>
                  <p>Patients with billing: {billedPatients.length}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer with Total */}
        {filteredPatients.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredPatients.length} of {billedPatients.length} billing records
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${totalBilling.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Total Summary - Large Display */}
      <div className="mt-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between text-white">
          <div>
            <p className="text-green-100 text-sm uppercase tracking-wide mb-2">
              Total Revenue (All Time)
            </p>
            <p className="text-5xl font-bold">
              ${totalBilling.toFixed(2)}
            </p>
            <p className="text-green-100 text-sm mt-2">
              From {billedPatients.length} patient{billedPatients.length !== 1 ? 's' : ''} • Average: ${averageBilling.toFixed(2)} per patient
            </p>
          </div>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <DollarSign className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBillingPage;