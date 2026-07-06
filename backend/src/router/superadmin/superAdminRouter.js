import { Router } from 'express';
import {
  createAdmin,
  getAdmins,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
} from '../../controller/superadmin/superAdminController.js';
import { authenticateToken, requireSuperAdmin } from '../../middleware/auth.js';

const superAdminRouter = Router();

superAdminRouter.use(authenticateToken, requireSuperAdmin);

superAdminRouter.get('/', getAdmins);
superAdminRouter.post('/', createAdmin);
superAdminRouter.put('/:id', updateAdmin);
superAdminRouter.patch('/:id/status', toggleAdminStatus);
superAdminRouter.delete('/:id', deleteAdmin);

export default superAdminRouter;
