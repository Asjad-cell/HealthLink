import { Request, Response } from 'express';
import { Doctor, Patient, Appointment } from '../models';
import { IAvailability } from '../types';
import { IDoctor } from '../types';

export const bookAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      patientName,
      patientEmail,
      patientPhone,
      patientAge,
      patientGender,
      patientDescription,
      doctorId,
      appointmentDate,
      timeSlot,
      reason
    } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      res.status(404).json({
        success: false,
        message: 'Doctor not found or not available'
      });
      return;
    }

    const appointmentDateTime = new Date(appointmentDate);
    if (appointmentDateTime <= new Date()) {
      res.status(400).json({
        success: false,
        message: 'Appointment date must be in the future'
      });
      return;
    }

    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: appointmentDateTime,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
      return;
    }

    let patient = await Patient.findOne({ email: patientEmail });
    
    if (!patient) {
      patient = new Patient({
        name: patientName,
        email: patientEmail,
        phone: patientPhone,
        age: patientAge,
        gender: patientGender,
        description: patientDescription,
        medicalHistory: []
      });
      await patient.save();
    }

    const appointment = new Appointment({
      patient: patient._id,
      doctor: doctorId,
      appointmentDate: appointmentDateTime,
      timeSlot,
      reason,
      status: 'pending'
    });

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: populatedAppointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error booking appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAvailableDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { specialization } = req.query;

    const query: { isActive: boolean; specialization?: string } = { isActive: true };
    if (specialization && typeof specialization === 'string') {
      query.specialization = specialization;
    }

    const doctors = await Doctor.find(query)
      .select('name specialization experience qualification availability')
      .sort({ name: 1 });

    // Transform the data to include id field for frontend compatibility
    const transformedDoctors = doctors.map((doctor: IDoctor) => ({
      id: (doctor._id as string).toString(),
      name: doctor.name,
      specialization: doctor.specialization,
      experience: doctor.experience,
      qualification: doctor.qualification,
      availability: doctor.availability
    }));

    res.status(200).json({
      success: true,
      data: transformedDoctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctors',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getDoctorAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    // Validate ObjectId format
    if (!doctorId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({
        success: false,
        message: 'Invalid doctor ID format'
      });
      return;
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      res.status(404).json({
        success: false,
        message: 'Doctor not found or not available'
      });
      return;
    }

    let availableSlots: string[] = [];
    
    if (date) {
      const appointmentDate = new Date(date as string);
      const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      let dayAvailability: IAvailability | undefined = doctor.availability.find(
        (avail) => avail.day === dayName && avail.isAvailable
      );

      // If no availability is set for this doctor, provide default working hours
      if (!dayAvailability && doctor.availability.length === 0) {
        // Default availability: Monday to Friday, 9 AM to 5 PM
        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        if (weekdays.includes(dayName)) {
          dayAvailability = {
            day: dayName as IAvailability['day'],
            startTime: '09:00',
            endTime: '17:00',
            isAvailable: true
          };
        }
      }

      if (dayAvailability) {
        const bookedSlots = await Appointment.find({
          doctor: doctorId,
          appointmentDate,
          status: { $in: ['pending', 'confirmed'] }
        }).select('timeSlot');

        const bookedTimes = bookedSlots.map(slot => slot.timeSlot);
        
        const startTime = dayAvailability.startTime;
        const endTime = dayAvailability.endTime;
        
        const slots = generateTimeSlots(startTime, endTime);
        availableSlots = slots.filter(slot => !bookedTimes.includes(slot));
      }
    }

    res.status(200).json({
      success: true,
      data: {
        doctor: {
          id: doctor._id,
          name: doctor.name,
          specialization: doctor.specialization
        },
        availability: doctor.availability,
        availableSlots
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching availability',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .sort({ appointmentDate: -1 }); // latest first

    res.status(200).json({
      success: true,
      data: { appointments },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAppointmentsByDoctor = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;

    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('patient', 'name email phone medicalHistory')
      .populate('doctor', 'name specialization');

    res.status(200).json({
      success: true,
      data: { appointments },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching appointments',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};


const generateTimeSlots = (startTime: string, endTime: string): string[] => {
  const slots: string[] = [];
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  
  const current = new Date(start);
  
  while (current < end) {
    slots.push(current.toTimeString().slice(0, 5));
    current.setMinutes(current.getMinutes() + 30);
  }
  
  return slots;
};
