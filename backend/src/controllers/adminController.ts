import { Response } from "express";
import { User, Doctor, Patient, Appointment } from "../models";
import { AuthRequest, IUser } from "../types";
import { generateToken } from "../utils/jwt";

export const updateDoctor = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { doctorId } = req.params;
    const {
      name,
      phone,
      specialization,
      experience,
      qualification,
      email,
      password,
    } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      res.status(404).json({ success: false, message: "Doctor not found" });
      return;
    }

    // Update Doctor fields
    if (name !== undefined) doctor.name = name;
    if (phone !== undefined) doctor.phone = phone;
    if (specialization !== undefined) doctor.specialization = specialization;
    if (experience !== undefined) doctor.experience = experience;
    if (qualification !== undefined) doctor.qualification = qualification;

    await doctor.save();

    // Update User fields if email or password provided
    if (email || password) {
      const user = await User.findById(doctor.user);
      if (!user) {
        res.status(404).json({ success: false, message: "Associated user not found" });
        return;
      }

      if (email) user.email = email;
      if (password && password.trim().length >= 6) {
        user.password = password; // Will be hashed by pre-save hook
      }

      await user.save();
    }

    // Fetch updated doctor with user info for response
    const updatedDoctor = await Doctor.findById(doctorId).populate('user', 'email');
    const userEmail = (updatedDoctor?.user as unknown as IUser)?.email || email;

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: {
        id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
        phone: doctor.phone,
        experience: doctor.experience,
        qualification: doctor.qualification,
        email: userEmail,
      },
    });
  } catch (error) {
    console.error('Update doctor error:', error); // Debug log
    res.status(500).json({
      success: false,
      message: "Server error updating doctor",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createDoctor = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log('Create doctor request body:', req.body); // Debug log
    
    const {
      email,
      password,
      name,
      specialization,
      phone,
      experience,
      qualification,
    } = req.body;

    // Validate required fields
    if (!email || !password || !name || !specialization || !phone || !qualification) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    const user = new User({
      email,
      password,
      role: "doctor",
    });

    await user.save();

    // Create default availability (Monday to Friday, 9 AM to 5 PM)
    const defaultAvailability = [
      {
        day: "Monday",
        startTime: "09:00",
        endTime: "17:00",
        isAvailable: true,
      },
      {
        day: "Tuesday",
        startTime: "09:00",
        endTime: "17:00",
        isAvailable: true,
      },
      {
        day: "Wednesday",
        startTime: "09:00",
        endTime: "17:00",
        isAvailable: true,
      },
      {
        day: "Thursday",
        startTime: "09:00",
        endTime: "17:00",
        isAvailable: true,
      },
      {
        day: "Friday",
        startTime: "09:00",
        endTime: "17:00",
        isAvailable: true,
      },
      {
        day: "Saturday",
        startTime: "09:00",
        endTime: "17:00",
        isAvailable: false,
      },
      {
        day: "Sunday",
        startTime: "09:00",
        endTime: "17:00",
        isAvailable: false,
      },
    ];

    const doctor = new Doctor({
      user: user._id,
      name,
      specialization,
      phone,
      experience: experience || 0,
      qualification,
      availability: defaultAvailability,
    });

    await doctor.save();

    const token = generateToken({
      id: (user._id as string).toString(),
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: {
        user: {
          id: (user._id as string).toString(),
          email: user.email,
          role: user.role,
        },
        doctor: {
          id: doctor._id,
          name: doctor.name,
          specialization: doctor.specialization,
          phone: doctor.phone,
          experience: doctor.experience,
          qualification: doctor.qualification,
          isActive: doctor.isActive,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Create doctor error:', error); // Debug log
    res.status(500).json({
      success: false,
      message: "Server error creating doctor",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllDoctors = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const doctors = await Doctor.find()
      .populate("user", "email createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Doctor.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        doctors,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching doctors",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteDoctor = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      res.status(404).json({ success: false, message: "Doctor not found" });
      return;
    }

    await User.findByIdAndDelete(doctor.user);
    await Doctor.findByIdAndDelete(doctorId);

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error deleting doctor",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllPatients = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const patients = await Patient.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Patient.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        patients,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching patients",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updatePatient = async (req: AuthRequest, res: Response) => {
  try {
    const { patientId } = req.params;
    const updates = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      res.status(404).json({ success: false, message: "Patient not found" });
      return;
    }

    // Only update allowed fields
    const allowedFields = ["name", "email", "phone", "age", "gender", "description"];
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        (patient as unknown as Record<string, unknown>)[field] = updates[field];
      }
    });

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (err) {
    console.error("Update patient error:", err);
    res.status(500).json({
      success: false,
      message: "Server error updating patient",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};


export const getAllAppointments = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email phone medicalHistory")
      .populate("doctor", "name specialization")
      .sort({ appointmentDate: -1 }); // latest first

    res.status(200).json({
      success: true,
      data: { appointments },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching appointments",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const toggleDoctorStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
      return;
    }

    doctor.isActive = !doctor.isActive;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: `Doctor ${
        doctor.isActive ? "activated" : "deactivated"
      } successfully`,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating doctor status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const activeDoctors = await Doctor.countDocuments({ isActive: true });
    const totalPatients = await Patient.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({
      status: "pending",
    });
    const completedAppointments = await Appointment.countDocuments({
      status: "completed",
    });

    const recentAppointments = await Appointment.find()
      .populate("patient", "name email medicalHistory")
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalDoctors,
          activeDoctors,
          totalPatients,
          totalAppointments,
          pendingAppointments,
          completedAppointments,
        },
        recentAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching dashboard stats",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
