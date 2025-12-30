import { Router } from 'express';
import {
  updateAvailability,
  getMyAppointments,
  updateAppointmentStatus,
  getMyPatients,
  addPatientRecord,
  getDoctorStats,
  updatePatientRecord,
  updatePatientBilling
} from '../controllers/doctorController';
import { authenticate, authorize } from '../middleware/auth';
import { validatePatientUpdate } from '../middleware/validation';

const router = Router();

router.use(authenticate);
router.use(authorize('doctor'));

router.put('/availability', updateAvailability);
router.get('/appointments', getMyAppointments);
router.patch('/appointments/:appointmentId', updateAppointmentStatus);
router.get('/patients', getMyPatients);
router.post('/patients/:patientId/records', validatePatientUpdate, addPatientRecord);
router.put('/patients/:patientId/records/:recordIndex', updatePatientRecord);
router.put('/patients/:patientId/billing', updatePatientBilling);
router.get('/stats', getDoctorStats);

export default router;
