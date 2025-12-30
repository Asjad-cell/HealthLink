import { Request, Response } from 'express';
import { User, Doctor } from '../models';
import { generateToken } from '../utils/jwt';
import { AuthRequest, UserData } from '../types';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    const token = generateToken({
      id: (user._id as string).toString(),
      role: user.role
    });

    const userData: UserData = {
      id: (user._id as string).toString(),
      email: user.email,
      role: user.role
    };

    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: user._id });
      if (doctor) {
        userData.doctorProfile = {
          id: (doctor._id as string).toString(),
          name: doctor.name,
          specialization: doctor.specialization,
          phone: doctor.phone,
          experience: doctor.experience,
          qualification: doctor.qualification,
          availability: doctor.availability,
          isActive: doctor.isActive
        };
      }
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const userData: UserData = {
      id: (user._id as string).toString(),
      email: user.email,
      role: user.role
    };

    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: user._id });
      if (doctor) {
        userData.doctorProfile = {
          id: (doctor._id as string).toString(),
          name: doctor.name,
          specialization: doctor.specialization,
          phone: doctor.phone,
          experience: doctor.experience,
          qualification: doctor.qualification,
          availability: doctor.availability,
          isActive: doctor.isActive
        };
      }
    }

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
