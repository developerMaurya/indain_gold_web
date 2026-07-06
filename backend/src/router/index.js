import { Router } from 'express';
import superAdminRouter from './superadmin/superAdminRouter.js';
import authRouter from './admin/authRouter.js';
import productRouter from './admin/productRouter.js';
import customerRouter from './admin/customerRouter.js';
import invoiceRouter from './admin/invoiceRouter.js';

const router = Router();

// Superadmin routes
router.use('/superadmin/admins', superAdminRouter);

// Admin routes
router.use('/admin/auth', authRouter);
router.use('/admin/products', productRouter);
router.use('/admin/customers', customerRouter);
router.use('/admin/invoices', invoiceRouter);

export default router;
