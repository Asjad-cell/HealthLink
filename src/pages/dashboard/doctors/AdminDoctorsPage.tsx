import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  UserX,
  Edit2,
  Eye,
  EyeOff,
  Mail,
  Phone,
} from "lucide-react";
import { adminService } from "../../../services";
import {
  DoctorProfile,
  CreateDoctorRequest,
  SPECIALIZATIONS,
} from "../../../types/api";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { toast } from "sonner";

const AdminDoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorProfile | null>(
    null
  );
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    specialization: "General Medicine",
    phone: "",
    experience: 0,
    qualification: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllDoctors(1, 50);
      setDoctors(res.data.doctors || []);
    } catch {
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     MODAL HANDLERS
  ========================== */

  const openCreateModal = () => {
    setEditingDoctor(null);
    setFormData({
      email: "",
      password: "",
      name: "",
      specialization: "General Medicine",
      phone: "",
      experience: 0,
      qualification: "",
    });
    setFormErrors({});
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const openEditModal = (doctor: DoctorProfile) => {
    setEditingDoctor(doctor);
    setFormData({
      email: doctor.user?.email || "",
      password: "",
      name: doctor.name || "",
      specialization: doctor.specialization || "General Medicine",
      phone: doctor.phone || "",
      experience: doctor.experience ?? 0,
      qualification: doctor.qualification || "",
    });
    setFormErrors({});
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDoctor(null);
    setFormErrors({});
  };

  /* =========================
     VALIDATION
  ========================== */

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const qualification = formData.qualification.trim();
    const password = formData.password;

    if (!name) errors.name = "Name is required";

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email address";
    }

    if (!phone) {
      errors.phone = "Phone is required";
    } else if (!/^(0[0-9]{10}|\+92[0-9]{10})$/.test(phone)) {
      errors.phone = "Phone number must be in Pakistani format (e.g., 03001234567 or +923001234567)";
    }

    if (!qualification) errors.qualification = "Qualification is required";

    if (!editingDoctor && !password) {
      errors.password = "Password is required";
    }

    if (password && password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* =========================
     SAVE
  ========================== */

  const handleSaveDoctor = async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      if (editingDoctor) {
        const updatePayload: Omit<CreateDoctorRequest, 'password'> & { password?: string } = {
          email: formData.email.trim(),
          name: formData.name.trim(),
          specialization: formData.specialization,
          phone: formData.phone.trim(),
          experience: formData.experience,
          qualification: formData.qualification.trim(),
        };

        if (formData.password.trim()) {
          updatePayload.password = formData.password.trim();
        }

        await adminService.updateDoctor(editingDoctor._id, updatePayload);
        toast.success("Doctor updated successfully");
      } else {
        const createPayload: CreateDoctorRequest = {
          email: formData.email.trim(),
          password: formData.password.trim(),
          name: formData.name.trim(),
          specialization: formData.specialization,
          phone: formData.phone.trim(),
          experience: formData.experience,
          qualification: formData.qualification.trim(),
        };

        await adminService.createDoctor(createPayload);
        toast.success("Doctor added successfully");
      }

      closeModal();
      await loadDoctors();
    } catch {
      toast.error("Failed to save doctor");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivateDoctor = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this doctor?")) return;

    try {
      await adminService.deleteDoctor(id);
      toast.success("Doctor deactivated successfully");
      await loadDoctors();
    } catch {
      toast.error("Failed to deactivate doctor");
    }
  };

  /* =========================
     FILTER
  ========================== */

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Doctor Management</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <Plus size={16} /> Add Doctor
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
          placeholder="Search doctors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor._id}
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {doctor.name}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    {doctor.specialization}
                  </div>
                </div>
                <button
                  onClick={() => openEditModal(doctor)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit doctor"
                >
                  <Edit2
                    size={18}
                    className="text-gray-600 hover:text-blue-600"
                  />
                </button>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-2 text-sm">
                  <Mail
                    size={16}
                    className="text-gray-400 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-gray-700 break-all">
                    {doctor.user?.email}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700">{doctor.phone}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Experience</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {doctor.experience} years
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Qualification</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {doctor.qualification}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDeactivateDoctor(doctor._id)}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 py-2.5 rounded-lg transition-colors font-medium text-sm"
              >
                <UserX size={16} />
                Delete Doctor
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingDoctor ? "Edit Doctor" : "Add Doctor"}
            </h2>

            {/* TWO FIELDS PER ROW */}
            <div className="mb-3 flex gap-3">
              {/* Full Name */}
              <div className="flex-1">
                <label className="text-sm">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                />
                {formErrors.name && (
                  <p className="text-red-600 text-sm">{formErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="flex-1">
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                />
                {formErrors.email && (
                  <p className="text-red-600 text-sm">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="mb-3 flex gap-3">
              {/* Phone */}
              <div className="flex-1">
                <label className="text-sm">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                />
                {formErrors.phone && (
                  <p className="text-red-600 text-sm">{formErrors.phone}</p>
                )}
              </div>

              {/* Qualification */}
              <div className="flex-1">
                <label className="text-sm">Qualification</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, qualification: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                />
                {formErrors.qualification && (
                  <p className="text-red-600 text-sm">
                    {formErrors.qualification}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-3 flex gap-3">
              {/* Specialization */}
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">
                  Specialization
                </label>
                <select
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specialization: e.target.value,
                    }))
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">
                  Experience (years)
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      experience: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="text-sm">
                {editingDoctor ? "Change Password" : "Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, password: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-2.5"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-600 text-sm">{formErrors.password}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDoctor}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctorsPage;
