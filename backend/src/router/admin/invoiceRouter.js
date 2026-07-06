import { Router } from 'express';
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  getDashboardStats,
  exportInvoicesToExcel,
} from '../../controller/admin/invoiceController.js';
import { authenticateToken, requireAdmin } from '../../middleware/auth.js';

const invoiceRouter = Router();

invoiceRouter.use(authenticateToken, requireAdmin);

invoiceRouter.get('/stats', getDashboardStats);
invoiceRouter.get('/export', exportInvoicesToExcel);
invoiceRouter.get('/:id', getInvoiceById);
invoiceRouter.get('/', getInvoices);
invoiceRouter.post('/', createInvoice);

export default invoiceRouter;
