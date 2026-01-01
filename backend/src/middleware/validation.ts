import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { SPECIALIZATIONS } from '../types';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }
  next();
};

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

export const validateDoctorCreation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('specialization')
    .isIn(SPECIALIZATIONS)
    .withMessage('Please select a valid specialization'),
  body('phone')
    .matches(/^(0[0-9]{10}|\+92[0-9]{10})$/)
    .withMessage('Phone number must be in this format (e.g., 03001234567 or +923001234567)'),
  body('experience')
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience must be between 0 and 50 years'),
  body('qualification')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Qualification must be between 2 and 200 characters'),
  handleValidationErrors
];

export const validateAppointmentBooking = [
  body('patientName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Patient name must be between 2 and 100 characters'),
  body('patientEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('patientPhone')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  body('patientAge')
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),
  body('patientGender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Please select a valid gender'),
  body('doctorId')
    .isMongoId()
    .withMessage('Please provide a valid doctor ID'),
  body('appointmentDate')
    .isISO8601()
    .toDate()
    .withMessage('Please provide a valid date'),
  body('timeSlot')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide time in HH:MM format'),
  body('reason')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Reason must be between 5 and 500 characters'),
  handleValidationErrors
];

export const validatePatientUpdate = [
  body('disease')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Disease must be between 2 and 100 characters'),
  body('diagnosis')
    .trim()
    .isLength({ min: 2, max: 500 })
    .withMessage('Diagnosis must be between 2 and 500 characters'),
  body('treatment')
    .trim()
    .isLength({ min: 2, max: 500 })
    .withMessage('Treatment must be between 2 and 500 characters'),
  body('billingAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Billing amount must be a positive number'),
  handleValidationErrors
];
