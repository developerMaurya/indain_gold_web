import Product from '../../model/Product.js';
import XLSX from 'xlsx';

export const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const products = await Product.find(query).sort({ name: 1 });
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({ error: 'An error occurred while fetching the product.' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, purchasePrice, minSellingPrice, stock, unit, dose, hsnCode, gstRate, category } = req.body;

    if (!name || price === undefined || purchasePrice === undefined || minSellingPrice === undefined) {
      return res.status(400).json({ error: 'Product name, purchase price, selling price, and minimum selling price are required.' });
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      purchasePrice,
      minSellingPrice,
      stock: stock || 0,
      unit: unit || 'pcs',
      dose,
      hsnCode,
      gstRate: gstRate || 0,
      category,
    });

    return res.status(201).json({
      message: 'Product created successfully.',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'An error occurred during product creation.' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, purchasePrice, minSellingPrice, stock, unit, dose, hsnCode, gstRate, category } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (purchasePrice !== undefined) product.purchasePrice = purchasePrice;
    if (minSellingPrice !== undefined) product.minSellingPrice = minSellingPrice;
    if (stock !== undefined) product.stock = stock;
    if (unit !== undefined) product.unit = unit;
    if (dose !== undefined) product.dose = dose;
    if (hsnCode !== undefined) product.hsnCode = hsnCode;
    if (gstRate !== undefined) product.gstRate = gstRate;
    if (category !== undefined) product.category = category;

    const updatedProduct = await product.save();

    return res.status(200).json({
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ error: 'An error occurred during product update.' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    
    return res.status(200).json({
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'An error occurred during product deletion.' });
  }
};

export const exportProductsToExcel = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ name: 1 });

    const formattedData = products.map(prod => ({
      'Product Name': prod.name,
      'Description': prod.description || '',
      'Category': prod.category || '',
      'Purchase Price (INR)': prod.purchasePrice,
      'Selling Price (INR)': prod.price,
      'Min Selling Price (INR)': prod.minSellingPrice,
      'GST Rate (%)': prod.gstRate,
      'Dose': prod.dose || '',
      'HSN Code': prod.hsnCode || '',
      'Stock Level': prod.stock,
      'Unit': prod.unit,
      'Last Updated': prod.updatedAt.toISOString().split('T')[0],
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Report');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory_report.xlsx');
    return res.send(buffer);
  } catch (error) {
    console.error('Error exporting inventory:', error);
    return res.status(500).json({ error: 'An error occurred while exporting inventory report.' });
  }
};
