import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  exportProductsToExcel,
} from '../../controller/admin/productController.js';
import { authenticateToken, requireAdmin } from '../../middleware/auth.js';

const productRouter = Router();

productRouter.get('/export', authenticateToken, requireAdmin, exportProductsToExcel);
productRouter.get('/', authenticateToken, getProducts);
productRouter.get('/:id', authenticateToken, getProductById);

productRouter.post('/', authenticateToken, requireAdmin, createProduct);
productRouter.put('/:id', authenticateToken, requireAdmin, updateProduct);
productRouter.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

export default productRouter;
