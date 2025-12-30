import { Router } from 'express';
import authRoutes from './auth';
import adminRoutes from './admin';
import doctorRoutes from './doctor';
import appointmentRoutes from './appointment';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/doctor', doctorRoutes);
router.use('/appointments', appointmentRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HealthLink API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
