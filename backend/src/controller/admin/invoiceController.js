import Invoice from '../../model/Invoice.js';
import Product from '../../model/Product.js';
import Customer from '../../model/Customer.js';
import XLSX from 'xlsx';

export const createInvoice = async (req, res) => {
  try {
    const { customerPhone, customerName, customerAddress, customerCity, customerState, customerCountry, customerGst, customerPincode, shippingDetails, items, discount = 0, paymentStatus = 'paid', paymentMethod = 'cash' } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Invoice must contain at least one item.' });
    }

    if (!customerPhone || !customerName) {
      return res.status(400).json({ error: 'Customer name and phone number are required.' });
    }

    let customer = await Customer.findOne({ phone: customerPhone.trim() });
    if (!customer) {
      customer = await Customer.create({
        name: customerName,
        phone: customerPhone.trim(),
        address: customerAddress,
        city: customerCity,
        state: customerState,
        country: customerCountry,
        gstNumber: customerGst,
        pincode: customerPincode,
        createdBy: req.user.id,
      });
    } else {
      if (customerAddress && !customer.address) customer.address = customerAddress;
      if (customerCity && !customer.city) customer.city = customerCity;
      if (customerState && !customer.state) customer.state = customerState;
      if (customerCountry && !customer.country) customer.country = customerCountry;
      if (customerGst && !customer.gstNumber) customer.gstNumber = customerGst;
      if (customerPincode && !customer.pincode) customer.pincode = customerPincode;
      await customer.save();
    }

    const processedItems = [];
    let calculatedSubtotal = 0;
    let calculatedTaxAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${item.productId} not found.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product "${product.name}". Available: ${product.stock}, requested: ${item.quantity}.` });
      }

      product.stock -= item.quantity;
      await product.save();

      const itemPrice = product.price;
      const itemGstRate = product.gstRate || 0;
      const itemSubtotal = itemPrice * item.quantity;
      const itemGstAmount = (itemSubtotal * itemGstRate) / 100;
      const itemTotal = itemSubtotal + itemGstAmount;

      calculatedSubtotal += itemSubtotal;
      calculatedTaxAmount += itemGstAmount;

      processedItems.push({
        productId: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        gstRate: itemGstRate,
        gstAmount: itemGstAmount,
        total: itemTotal,
        unit: product.unit,
      });
    }

    const grandTotal = calculatedSubtotal + calculatedTaxAmount - discount;

    const uniqueId = Date.now().toString().slice(-6) + Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-${uniqueId}`;

    const newInvoice = await Invoice.create({
      invoiceNumber,
      customerId: customer._id,
      customerDetails: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address || customerAddress,
        city: customer.city || customerCity,
        state: customer.state || customerState,
        country: customer.country || customerCountry,
        gstNumber: customer.gstNumber || customerGst,
        pincode: customer.pincode || customerPincode,
      },
      shippingDetails: shippingDetails || {
        name: customer.name,
        phone: customer.phone,
        address: customer.address || customerAddress,
        city: customer.city || customerCity,
        state: customer.state || customerState,
        country: customer.country || customerCountry,
        pincode: customer.pincode || customerPincode,
      },
      items: processedItems,
      subtotal: calculatedSubtotal,
      discount,
      taxAmount: calculatedTaxAmount,
      grandTotal: grandTotal < 0 ? 0 : grandTotal,
      paymentStatus,
      paymentMethod,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: 'Invoice created successfully.',
      invoice: newInvoice,
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({ error: 'An error occurred during invoice creation.' });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const { startDate, endDate, phone, invoiceNumber } = req.query;
    const query = {};

    if (phone) {
      query['customerDetails.phone'] = phone.trim();
    }
    if (invoiceNumber) {
      query.invoiceNumber = { $regex: invoiceNumber, $options: 'i' };
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    return res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({ error: 'An error occurred while fetching invoices.' });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    return res.status(200).json(invoice);
  } catch (error) {
    console.error('Error fetching invoice details:', error);
    return res.status(500).json({ error: 'An error occurred while fetching invoice details.' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const invoices = await Invoice.find({});
    let totalSales = 0;
    let totalTaxCollected = 0;
    let profit = 0;

    for (const inv of invoices) {
      totalSales += inv.grandTotal;
      totalTaxCollected += inv.taxAmount;

      for (const item of inv.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          const itemCost = product.purchasePrice || 0;
          const itemProfit = (item.price - itemCost) * item.quantity;
          profit += itemProfit;
        }
      }
    }

    const invoicesCount = invoices.length;
    const lowStockCount = await Product.countDocuments({ stock: { $lt: 5 } });
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } }).limit(5);
    const recentInvoices = await Invoice.find({}).sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
      summary: {
        totalSales,
        totalTaxCollected,
        totalProfit: profit,
        invoicesCount,
        lowStockCount,
      },
      lowStockProducts,
      recentInvoices,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: 'An error occurred while fetching dashboard statistics.' });
  }
};

export const exportInvoicesToExcel = async (req, res) => {
  try {
    const invoices = await Invoice.find({}).sort({ createdAt: -1 });

    const formattedData = invoices.map(inv => ({
      'Invoice Number': inv.invoiceNumber,
      'Customer Name': inv.customerDetails.name,
      'Customer Phone': inv.customerDetails.phone,
      'Subtotal (INR)': inv.subtotal,
      'Discount (INR)': inv.discount,
      'Tax Amount (INR)': inv.taxAmount,
      'Grand Total (INR)': inv.grandTotal,
      'Payment Status': inv.paymentStatus,
      'Payment Method': inv.paymentMethod,
      'Created Date': inv.createdAt.toISOString().split('T')[0],
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices Report');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=invoices_report.xlsx');
    return res.send(buffer);
  } catch (error) {
    console.error('Error exporting invoices:', error);
    return res.status(500).json({ error: 'An error occurred while exporting reports.' });
  }
};
