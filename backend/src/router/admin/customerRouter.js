import { Router } from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '../../controller/admin/customerController.js';
import { authenticateToken, requireAdmin } from '../../middleware/auth.js';

const customerRouter = Router();

customerRouter.use(authenticateToken, requireAdmin);

customerRouter.get('/', getCustomers);
customerRouter.get('/:id', getCustomerById);
customerRouter.post('/', createCustomer);
customerRouter.put('/:id', updateCustomer);
customerRouter.delete('/:id', deleteCustomer);

export default customerRouter;
