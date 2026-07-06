import { Router } from 'express';
import {
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
} from '../../controller/admin/authController.js';
import { authenticateToken } from '../../middleware/auth.js';

const authRouter = Router();

// Public routes
authRouter.post('/login', login);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', resetPassword);

// Protected routes
authRouter.post('/change-password', authenticateToken, changePassword);
authRouter.put('/profile', authenticateToken, updateProfile);

export default authRouter;
