import { Router } from 'express';
import {
  createDoctor,
  getAllDoctors,
  getAllPatients,
  toggleDoctorStatus,
  getDashboardStats,
  getAllAppointments,
  updateDoctor,
  deleteDoctor,
  updatePatient
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';
import { validateDoctorCreation } from '../middleware/validation';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/appointments', getAllAppointments);
router.post('/doctors', validateDoctorCreation, createDoctor);
router.patch('/doctors/:doctorId', updateDoctor);
router.delete("/doctors/:doctorId", deleteDoctor);

router.get('/doctors', getAllDoctors);
router.get('/patients', getAllPatients);
router.patch('/patients/:patientId', updatePatient);
router.patch('/doctors/:doctorId/toggle-status', toggleDoctorStatus);
router.get('/dashboard/stats', getDashboardStats);

export default router;
