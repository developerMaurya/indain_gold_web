import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutDashboard,
  Receipt,
  Package,
  Users,
  FileBarChart2,
  Shield,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Key,
  User as UserIcon,
  FileText,
  Loader2,
  RefreshCw,
  Printer,
  ChevronRight,
  ShoppingBag,
  Eye,
  TrendingUp,
  PieChart,
  Menu,
  Sun,
  Moon,
  X
} from 'lucide-react';

// Modular Views & Sub-Components
import InvoiceA4Template from './components/InvoiceA4Template';
import InvoiceThermalTemplate from './components/InvoiceThermalTemplate';
import SuperadminView from './views/SuperadminView';
import DashboardView from './views/DashboardView';
import BillingView from './views/BillingView';
import InventoryView from './views/InventoryView';
import CustomersView from './views/CustomersView';
import ReportsView from './views/ReportsView';
import AnalyticsView from './views/AnalyticsView';
import ProfileView from './views/ProfileView';

export default function App() {
  // Authentication & Global States
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Data lists
  const [admins, setAdmins] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  
  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Form states
  const isSuperadminMode = window.location.search.includes('superadmin') || window.location.pathname.includes('superadmin');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState('');
  const [resetPasswordVal, setResetPasswordVal] = useState('');
  
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '', phone: '', industryType: 'store' });
  const [editingAdminId, setEditingAdminId] = useState(null);
  
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', purchasePrice: '', minSellingPrice: '', stock: '', unit: 'pcs', dose: '', hsnCode: '', gstRate: 0, category: '' });
  const [editingProductId, setEditingProductId] = useState(null);
  
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', email: '', address: '', city: '', state: '', country: 'India', gstNumber: '', pincode: '' });
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  // Billing Terminal Cart States
  const [cart, setCart] = useState([]);
  const [billCustomer, setBillCustomer] = useState({ name: '', phone: '', address: '', city: '', state: '', country: 'India', gstNumber: '', pincode: '' });
  const [distinctShipping, setDistinctShipping] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({ name: '', phone: '', address: '', city: '', state: '', country: 'India', pincode: '', gstNumber: '' });
  const [printTemplate, setPrintTemplate] = useState('normal'); // 'normal' or 'thermal'
  
  // POS Specific States
  const [posSelectedCustomer, setPosSelectedCustomer] = useState(null);
  const [showQuickAddCustomer, setShowQuickAddCustomer] = useState(false);
  const [posProductSearch, setPosProductSearch] = useState('');
  const [posCategoryFilter, setPosCategoryFilter] = useState('');
  const [posPriceSort, setPosPriceSort] = useState('');
  const [posMinPrice, setPosMinPrice] = useState(0);
  const [posMaxPrice, setPosMaxPrice] = useState(10000);
  const [showProductCatalogModal, setShowProductCatalogModal] = useState(false);
  const [posSelectedProduct, setPosSelectedProduct] = useState(null);
  const [posProductQty, setPosProductQty] = useState(1);
  const [billDiscount, setBillDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [printInvoiceData, setPrintInvoiceData] = useState(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Profile Form States
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [analyticsTab, setAnalyticsTab] = useState('pl');

  // Company Info States (stored in localStorage)
  const [companyInfo, setCompanyInfo] = useState(() => {
    try { return JSON.parse(localStorage.getItem('companyInfo')) || {}; } catch { return {}; }
  });
  const [companyForm, setCompanyForm] = useState(() => {
    try { return JSON.parse(localStorage.getItem('companyInfo')) || { name: '', gst: '', address: '', pincode: '', state: '', country: 'India', website: '' }; } catch { return { name: '', gst: '', address: '', pincode: '', state: '', country: 'India', website: '' }; }
  });

  // Fetch initial data based on login state
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      if (user?.role === 'superadmin') {
        setCurrentView('admins');
        fetchAdmins();
      } else {
        setCurrentView('dashboard');
        fetchDashboardStats();
        fetchProducts();
        fetchCustomers();
        fetchInvoices();
      }
      setProfileName(user?.name || '');
      setProfilePhone(user?.phone || '');
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Flash messages helper
  const showFlash = (type, msg) => {
    if (type === 'success') {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // API Call Helpers
  const fetchAdmins = async () => {
    try {
      const res = await axios.get('/api/superadmin/admins');
      setAdmins(res.data);
    } catch (err) {
      showFlash('error', err.response?.data?.error || 'Failed to fetch admins.');
    }
  };

  const fetchProducts = async (search = '') => {
    try {
      const res = await axios.get(`/api/admin/products?search=${search}`);
      setProducts(res.data);
    } catch (err) {
      showFlash('error', 'Failed to fetch products.');
    }
  };

  const fetchCustomers = async (search = '') => {
    try {
      const res = await axios.get(`/api/admin/customers?search=${search}`);
      setCustomers(res.data);
    } catch (err) {
      showFlash('error', 'Failed to fetch customers.');
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`/api/admin/invoices?startDate=${startDate}&endDate=${endDate}`);
      setInvoices(res.data);
    } catch (err) {
      showFlash('error', 'Failed to fetch invoices.');
    }
  };

  // Calculate dynamic dashboard / analytics statistics
  const getAnalyticsData = () => {
    const today = new Date();
    const todayStr = today.toDateString();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let todaySales = 0;
    let todayProfit = 0;
    let todayInvoicesCount = 0;
    let todayItemsSoldCount = 0;
    let todayPurchaseCost = 0;
    let monthlySales = 0;
    let monthlyProfit = 0;

    // Map product cost
    const productCostMap = {};
    products.forEach(p => {
      productCostMap[p._id] = p.purchasePrice || 0;
    });

    invoices.forEach(inv => {
      const invDate = new Date(inv.createdAt);
      const isToday = invDate.toDateString() === todayStr;
      const isThisMonth = invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;

      let invoiceCost = 0;
      inv.items.forEach(item => {
        const itemCost = productCostMap[item.productId] || 0;
        invoiceCost += itemCost * item.quantity;
      });

      const invProfit = inv.subtotal - invoiceCost - (inv.discount || 0);

      if (isToday) {
        todaySales += inv.grandTotal;
        todayProfit += invProfit;
        todayInvoicesCount += 1;
        todayPurchaseCost += invoiceCost;
        inv.items.forEach(item => {
          todayItemsSoldCount += item.quantity || 0;
        });
      }
      if (isThisMonth) {
        monthlySales += inv.grandTotal;
        monthlyProfit += invProfit;
      }
    });

    // 7 days trend data for Area/Line chart
    const dailyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dStr = d.toDateString();
      const label = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      
      let salesAmount = 0;
      let profitAmount = 0;

      invoices.forEach(inv => {
        const invDate = new Date(inv.createdAt);
        if (invDate.toDateString() === dStr) {
          salesAmount += inv.grandTotal;
          let invoiceCost = 0;
          inv.items.forEach(item => {
            const itemCost = productCostMap[item.productId] || 0;
            invoiceCost += itemCost * item.quantity;
          });
          profitAmount += inv.subtotal - invoiceCost - (inv.discount || 0);
        }
      });

      dailyTrend.push({ label, sales: salesAmount, profit: profitAmount });
    }

    // Category distribution for Bar chart
    const categoryData = {};
    products.forEach(p => {
      const cat = p.category || 'General';
      if (!categoryData[cat]) {
        categoryData[cat] = { stock: 0, value: 0, count: 0 };
      }
      categoryData[cat].stock += p.stock || 0;
      categoryData[cat].value += (p.stock || 0) * (p.price || 0);
      categoryData[cat].count += 1;
    });

    const categorySummary = Object.keys(categoryData).map(cat => ({
      category: cat,
      stock: categoryData[cat].stock,
      value: categoryData[cat].value,
      count: categoryData[cat].count
    }));

    // Customer Billing Ledger
    const customerLedgerMap = {};
    invoices.forEach(inv => {
      const custPhone = inv.customerDetails?.phone || 'N/A';
      if (!customerLedgerMap[custPhone]) {
        customerLedgerMap[custPhone] = {
          name: inv.customerDetails?.name || 'Walk-in Customer',
          phone: custPhone,
          totalSpent: 0,
          ordersCount: 0,
          lastOrderDate: inv.createdAt
        };
      }
      customerLedgerMap[custPhone].totalSpent += inv.grandTotal;
      customerLedgerMap[custPhone].ordersCount += 1;
      if (new Date(inv.createdAt) > new Date(customerLedgerMap[custPhone].lastOrderDate)) {
        customerLedgerMap[custPhone].lastOrderDate = inv.createdAt;
      }
    });

    const customerLedger = Object.values(customerLedgerMap).sort((a, b) => b.totalSpent - a.totalSpent);

    // General Inventory stats
    const totalRemainingStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const totalStockValueCost = products.reduce((sum, p) => sum + (p.stock || 0) * (p.purchasePrice || 0), 0);
    const totalStockValueRetail = products.reduce((sum, p) => sum + (p.stock || 0) * (p.price || 0), 0);

    return {
      todaySales,
      todayProfit,
      todayInvoicesCount,
      todayItemsSoldCount,
      todayPurchaseCost,
      monthlySales,
      monthlyProfit,
      dailyTrend,
      categorySummary,
      customerLedger,
      totalRemainingStock,
      totalStockValueCost,
      totalStockValueRetail,
      totalRegisteredCustomers: customers.length
    };
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get('/api/admin/invoices/stats');
      setStats(res.data);
    } catch (err) {
      showFlash('error', 'Failed to load dashboard metrics.');
    }
  };

  // Auth Operations
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/auth/login', { email: loginEmail, password: loginPassword });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      showFlash('success', 'Logged in successfully!');
    } catch (err) {
      showFlash('error', err.response?.data?.error || 'Invalid credentials.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setCart([]);
    setAdmins([]);
    setProducts([]);
    setCustomers([]);
    setInvoices([]);
    setStats(null);
  };

  const handleForgotRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/auth/forgot-password', { email: forgotEmail });
      showFlash('success', `Reset Token generated for testing: ${res.data.resetToken}`);
      setRecoveryToken(res.data.resetToken);
    } catch (err) {
      showFlash('error', err.response?.data?.error || 'Failed to request password reset.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/admin/auth/reset-password/${recoveryToken}`, { password: resetPasswordVal });
      showFlash('success', 'Password reset successfully! You can log in now.');
      setShowForgotForm(false);
      setRecoveryToken('');
      setResetPasswordVal('');
    } catch (err) {
      showFlash('error', err.response?.data?.error || 'Failed to reset password.');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/admin/auth/profile', { name: profileName, phone: profilePhone });
      const updatedUser = { ...user, name: res.data.user.name, phone: res.data.user.phone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      showFlash('success', 'Profile updated successfully!');
    } catch (err) {
      showFlash('error', err.response?.data?.error || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/auth/change-password', { oldPassword, newPassword });
      setOldPassword('');
      setNewPassword('');
      showFlash('success', 'Password updated successfully!');
    } catch (err) {
      showFlash('error', err.response?.data?.error || 'Failed to change password.');
    }
  };

  // Superadmin: Admin Management
  const handleSaveAdmin = async (e) => {
    e.preventDefault();
    try {
      if (editingAdminId) {
        await axios.put(`/api/superadmin/admins/${editingAdminId}`, { name: adminForm.name, phone: adminForm.phone, industryType: adminForm.industryType });
        showFlash('success', 'Admin updated successfully.');
      } else {
        await axios.post('/api/superadmin/admins', adminForm);
        showFlash('success', 'Admin created successfully.');
      }
      setAdminForm({ name: '', email: '', password: '', phone: '', industryType: 'store' });
      setEditingAdminId(null);
      fetchAdmins();
    } catch (err) {
      showFlash('error', err.response?.data?.error || 'Failed to save admin.');
    }
  };

  const handleToggleAdmin = async (id) => {
    try {
      await axios.patch(`/api/superadmin/admins/${id}/status`);
      showFlash('success', 'Admin status toggled.');
      fetchAdmins();
    } catch (err) {
      showFlash('error', 'Failed to toggle admin status.');
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    try {
      await axios.delete(`/api/superadmin/admins/${id}`);
      showFlash('success', 'Admin deleted successfully.');
      fetchAdmins();
    } catch (err) {
      showFlash('error', 'Failed to delete admin.');
    }
  };

  // Admin: Product Management
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const data = { ...productForm };
      // Convert numeric fields
      data.price = parseFloat(data.price);
      data.purchasePrice = parseFloat(data.purchasePrice);
      data.minSellingPrice = parseFloat(data.minSellingPrice);
      data.stock = parseInt(data.stock);
      data.gstRate = parseFloat(data.gstRate || 0);

      if (editingProductId) {
        await axios.put(`/api/admin/products/${editingProductId}`, data);
        showFlash('success', 'Product updated successfully.');
      } else {
        await axios.post('/api/admin/products', data);
        showFlash('success', 'Product created successfully.');
      }
      resetProductForm();
      fetchProducts(productSearch);
      fetchDashboardStats();
    } catch (err) {
      showFlash('error', err.response?.data?.error || 'Failed to save product.');
    }
  };

  const resetProductForm = () => {
    const defaultUnit = user?.industryType === 'medical' ? 'patta'
      : user?.industryType === 'vegetable' ? 'kg'
      : user?.industryType === 'drinks' ? 'pcs'
      : user?.industryType === 'grocery' ? 'pcs'
      : 'pcs';
    setProductForm({ name: '', description: '', price: '', purchasePrice: '', minSellingPrice: '', stock: '', unit: defaultUnit, dose: '', hsnCode: '', gstRate: 0, category: '' });
    setEditingProductId(null);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`/api/admin/products/${id}`);
      showFlash('success', 'Product deleted.');
      fetchProducts(productSearch);
      fetchDashboardStats();
    } catch (err) {
      showFlash('error', 'Failed to delete product.');
    }
  };

  // Admin: Customer Management
  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomerId) {
        await axios.put(`/api/admin/customers/${editingCustomerId}`, customerForm);
        showFlash('success', 'Customer updated.');
      } else {
        await axios.post('/api/admin/customers', customerForm);
        showFlash('success', 'Customer registered.');
      }
      setCustomerForm({ name: '', phone: '', email: '', address: '', city: '', state: '', country: 'India', gstNumber: '', pincode: '' });
      setEditingCustomerId(null);
      fetchCustomers(customerSearch);
    } catch (err) {
      showFlash('error', err.response?.data?.error || 'Failed to save customer.');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await axios.delete(`/api/admin/customers/${id}`);
      showFlash('success', 'Customer deleted.');
      fetchCustomers(customerSearch);
    } catch (err) {
      showFlash('error', 'Failed to delete customer.');
    }
  };

  // Billing Operations (Cart)
  const addToCart = (prod) => {
    const existing = cart.find(item => item.productId === prod._id);
    if (existing) {
      if (existing.quantity >= prod.stock) {
        showFlash('error', 'Cannot add more. Insufficient stock.');
        return;
      }
      setCart(cart.map(item => item.productId === prod._id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      if (prod.stock < 1) {
        showFlash('error', 'Out of stock.');
        return;
      }
      setCart([...cart, {
        productId: prod._id,
        name: prod.name,
        price: prod.price,
        quantity: 1,
        gstRate: prod.gstRate || 0,
        unit: prod.unit,
        dose: prod.dose || '',
        hsnCode: prod.hsnCode || '',
        stockLimit: prod.stock
      }]);
    }
  };

  const updateCartQty = (id, newQty) => {
    const item = cart.find(i => i.productId === id);
    if (newQty > item.stockLimit) {
      showFlash('error', 'Exceeds available stock.');
      return;
    }
    if (newQty < 1) {
      setCart(cart.filter(i => i.productId !== id));
    } else {
      setCart(cart.map(i => i.productId === id ? { ...i, quantity: newQty } : i));
    }
  };

  const calculateCartTotal = () => {
    let subtotal = 0;
    let taxAmount = 0;
    cart.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      const itemTax = (itemSubtotal * item.gstRate) / 100;
      subtotal += itemSubtotal;
      taxAmount += itemTax;
    });
    const total = subtotal + taxAmount - billDiscount;
    return {
      subtotal,
      taxAmount,
      total: total < 0 ? 0 : total
    };
  };

  const handleQuickAddCustomer = async (e) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.phone) {
      showFlash('error', 'Name and Phone are required.');
      return;
    }
    try {
      const res = await axios.post('/api/admin/customers', customerForm);
      showFlash('success', 'Customer registered and selected!');
      const newCust = res.data.customer;
      fetchCustomers();
      setPosSelectedCustomer(newCust);
      setBillCustomer({
        name: newCust.name,
        phone: newCust.phone,
        address: newCust.address || '',
        city: newCust.city || '',
        state: newCust.state || '',
        country: newCust.country || 'India',
        gstNumber: newCust.gstNumber || '',
        pincode: newCust.pincode || ''
      });
      setShowQuickAddCustomer(false);
      setCustomerForm({ name: '', phone: '', email: '', address: '', city: '', state: '', country: 'India', gstNumber: '', pincode: '' });
    } catch (err) {
      showFlash('error', err.response?.data?.error || 'Failed to register customer.');
    }
  };

  const handleAddProductToCart = () => {
    if (!posSelectedProduct) return;
    if (posProductQty <= 0) return;
    if (posProductQty > posSelectedProduct.stock) {
      showFlash('error', `Cannot exceed available stock (${posSelectedProduct.stock}).`);
      return;
    }
    const existingIdx = cart.findIndex(item => item.productId === posSelectedProduct._id);
    if (existingIdx > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIdx].quantity = posProductQty;
      setCart(updatedCart);
    } else {
      setCart([...cart, {
        productId: posSelectedProduct._id,
        name: posSelectedProduct.name,
        price: posSelectedProduct.price,
        quantity: posProductQty,
        gstRate: posSelectedProduct.gstRate || 0,
        unit: posSelectedProduct.unit,
        dose: posSelectedProduct.dose || '',
        hsnCode: posSelectedProduct.hsnCode || ''
      }]);
    }
    showFlash('success', `${posSelectedProduct.name} added to cart.`);
    setPosSelectedProduct(null);
    setPosProductQty(1);
  };

  const handlePreviewCheckout = () => {
    if (cart.length === 0) {
      showFlash('error', 'Cart is empty.');
      return;
    }
    if (!billCustomer.phone || !billCustomer.name) {
      showFlash('error', 'Customer name and phone are required.');
      return;
    }

    const { subtotal, taxAmount, total } = calculateCartTotal();
    const tempInvoice = {
      _id: 'preview_temp_id',
      invoiceNumber: 'PREVIEW-TEMP',
      createdAt: new Date().toISOString(),
      customerDetails: {
        name: billCustomer.name,
        phone: billCustomer.phone,
        email: billCustomer.email || '',
        address: billCustomer.address || '',
        city: billCustomer.city || '',
        state: billCustomer.state || '',
        pincode: billCustomer.pincode || '',
        gstNumber: billCustomer.gstNumber || ''
      },
      shippingDetails: distinctShipping ? shippingDetails : {
        name: billCustomer.name,
        phone: billCustomer.phone,
        address: billCustomer.address || '',
        city: billCustomer.city || '',
        state: billCustomer.state || '',
        pincode: billCustomer.pincode || '',
        gstNumber: billCustomer.gstNumber || ''
      },
      items: cart.map((i, index) => ({
        _id: index.toString(),
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        gstRate: i.gstRate || 0,
        total: (i.price * i.quantity) + ((i.price * i.quantity * (i.gstRate || 0)) / 100),
        dose: i.dose,
        hsnCode: i.hsnCode
      })),
      subtotal,
      taxAmount,
      discount: parseFloat(billDiscount || 0),
      grandTotal: total - parseFloat(billDiscount || 0),
      paymentStatus,
      paymentMethod,
      isPreview: true
    };

    setPrintInvoiceData(tempInvoice);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showFlash('error', 'Cart is empty.');
      return;
    }
    if (!billCustomer.phone || !billCustomer.name) {
      showFlash('error', 'Customer name and phone are required.');
      return;
    }

    try {
      const payload = {
        customerPhone: billCustomer.phone,
        customerName: billCustomer.name,
        customerAddress: billCustomer.address,
        customerCity: billCustomer.city,
        customerState: billCustomer.state,
        customerCountry: billCustomer.country,
        customerGst: billCustomer.gstNumber,
        customerPincode: billCustomer.pincode,
        shippingDetails: distinctShipping ? shippingDetails : {
          name: billCustomer.name,
          phone: billCustomer.phone,
          address: billCustomer.address,
          city: billCustomer.city,
          state: billCustomer.state,
          country: billCustomer.country,
          pincode: billCustomer.pincode,
          gstNumber: billCustomer.gstNumber
        },
        items: cart.map(i => ({ productId: i.productId, quantity: i.quantity })),
        discount: parseFloat(billDiscount || 0),
        paymentStatus,
        paymentMethod
      };

      const res = await axios.post('/api/admin/invoices', payload);
      showFlash('success', 'Sale transaction completed successfully!');
      setPrintInvoiceData(res.data.invoice);
      setCart([]);
      setBillCustomer({ name: '', phone: '', address: '', city: '', state: '', country: 'India', gstNumber: '', pincode: '' });
      setShippingDetails({ name: '', phone: '', address: '', city: '', state: '', country: 'India', pincode: '', gstNumber: '' });
      setDistinctShipping(false);
      setPosSelectedCustomer(null);
      setShowProductCatalogModal(false);
      setBillDiscount(0);
      
      // Refresh lists
      fetchProducts(productSearch);
      fetchDashboardStats();
      fetchCustomers();
      fetchInvoices();
    } catch (err) {
      showFlash('error', err.response?.data?.error || 'Checkout failed.');
    }
  };

  // Download Reports
  const downloadInvoicesExcel = () => {
    window.open(`/api/admin/invoices/export?token=${token}`);
  };

  const downloadProductsExcel = () => {
    window.open(`/api/admin/products/export?token=${token}`);
  };

  const analytics = getAnalyticsData();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Alert Modals */}
      {successMsg && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'var(--success-color)', color: '#fff', padding: '12px 24px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'var(--danger-color)', color: '#fff', padding: '12px 24px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          <XCircle size={18} /> {errorMsg}
        </div>
      )}

      {/* 1. Login State vs Logged In View */}
      {!token ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '20px', background: `radial-gradient(circle at 50% 50%, ${isSuperadminMode ? 'hsl(275, 25%, 11%)' : 'hsl(220, 25%, 12%)'}, hsl(222, 25%, 8%))` }}>
          
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '40px', border: `1px solid ${isSuperadminMode ? 'hsla(280, 20%, 30%, 0.4)' : 'var(--border-color)'}` }}>
            
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'inline-flex', background: isSuperadminMode ? 'linear-gradient(135deg, hsl(275, 75%, 55%), hsl(300, 75%, 50%))' : 'var(--primary-gradient)', padding: '14px', borderRadius: '16px', marginBottom: '14px', boxShadow: isSuperadminMode ? '0 0 20px hsla(275, 75%, 60%, 0.2)' : 'var(--shadow-glow)' }}>
                {isSuperadminMode ? <Shield size={32} color="#fff" /> : <Receipt size={32} color="#fff" />}
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, background: isSuperadminMode ? 'linear-gradient(135deg, hsl(275, 75%, 55%), hsl(300, 75%, 50%))' : 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                {isSuperadminMode ? 'Superadmin Portal' : 'Billing Software'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                {isSuperadminMode ? 'Access the master controller settings' : 'Log in to access your dashboard'}
              </p>
            </div>

            {!showForgotForm ? (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder={isSuperadminMode ? "Enter superadmin email e.g. superadmin@gmail.com" : "Enter email e.g. admin@business.com"}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '8px' }}>
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                  <button type="button" onClick={() => setShowForgotForm(true)} style={{ background: 'none', border: 'none', color: isSuperadminMode ? 'hsl(275, 75%, 65%)' : 'var(--primary-color)', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
                    Forgot Password?
                  </button>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', background: isSuperadminMode ? 'linear-gradient(135deg, hsl(275, 75%, 55%), hsl(300, 75%, 50%))' : 'var(--primary-gradient)' }}>
                  Sign In
                </button>

                <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  {isSuperadminMode ? (
                    <a href={window.location.origin} style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }} onClick={(e) => { e.preventDefault(); window.history.replaceState({}, '', '/'); window.location.reload(); }}>
                      ← Business Admin login
                    </a>
                  ) : (
                    <a href="?superadmin" style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }} onClick={(e) => { e.preventDefault(); window.history.replaceState({}, '', '?superadmin'); window.location.reload(); }}>
                      Superadmin Control Center →
                    </a>
                  )}
                </div>
              </form>
            ) : (
              <div>
                {!recoveryToken ? (
                  <form onSubmit={handleForgotRequest}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>Enter your email to retrieve your password reset token.</p>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        required
                        className="form-input"
                        placeholder="Enter email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                      <button type="button" className="btn btn-secondary" onClick={() => setShowForgotForm(false)} style={{ flex: 1 }}>
                        Back
                      </button>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                        Get Token
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>Provide the generated token and your new password.</p>
                    <div className="form-group">
                      <label className="form-label">Verification Token</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="Paste verification token here"
                        value={recoveryToken}
                        onChange={(e) => setRecoveryToken(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        required
                        className="form-input"
                        placeholder="••••••••"
                        value={resetPasswordVal}
                        onChange={(e) => setResetPasswordVal(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                      Reset Password
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

        </div>
      ) : (
        /* 2. Main Dashboard Panel */
        <div className="dashboard-layout">
          
          {/* Mobile Top Header Bar */}
          <div className="mobile-top-bar no-print">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center' }}
            >
              <Menu size={24} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: 'var(--primary-gradient)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                <Receipt size={16} color="#fff" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                {companyInfo?.name || user?.name || 'McZen Billing'}
              </span>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center' }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Sidebar Backdrop Overlay */}
          <div
            className={`sidebar-backdrop ${isMobileSidebarOpen ? 'mobile-open' : ''}`}
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className={`sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <div style={{ background: 'var(--primary-gradient)', padding: '8px', borderRadius: '10px', flexShrink: 0 }}>
                  <Receipt size={20} color="#fff" />
                </div>
                <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {companyInfo?.name || user?.name || 'McZen Billing'}
                </span>
              </div>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-main)',
                  padding: '6px', borderRadius: '50%', cursor: 'pointer',
                  alignItems: 'center', justifyContent: 'center'
                }}
                className="mobile-close-btn"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              {user?.role === 'superadmin' ? (
                <button
                  className={`btn ${currentView === 'admins' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', padding: '10px 16px' }}
                  onClick={() => { setCurrentView('admins'); setIsMobileSidebarOpen(false); }}
                >
                  <Shield size={18} /> Admin Accounts
                </button>
              ) : (
                <>
                  <button
                    className={`btn ${currentView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'flex-start', padding: '10px 16px' }}
                    onClick={() => { setCurrentView('dashboard'); fetchDashboardStats(); setIsMobileSidebarOpen(false); }}
                  >
                    <LayoutDashboard size={18} /> Dashboard
                  </button>
                  <button
                    className={`btn ${currentView === 'billing' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'flex-start', padding: '10px 16px' }}
                    onClick={() => { setCurrentView('billing'); fetchProducts(); setIsMobileSidebarOpen(false); }}
                  >
                    <Receipt size={18} /> Billing Terminal
                  </button>
                  <button
                    className={`btn ${currentView === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'flex-start', padding: '10px 16px' }}
                    onClick={() => { setCurrentView('inventory'); fetchProducts(); setIsMobileSidebarOpen(false); }}
                  >
                    <Package size={18} /> Inventory Items
                  </button>
                  <button
                    className={`btn ${currentView === 'customers' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'flex-start', padding: '10px 16px' }}
                    onClick={() => { setCurrentView('customers'); fetchCustomers(); setIsMobileSidebarOpen(false); }}
                  >
                    <Users size={18} /> Customers
                  </button>
                  <button
                    className={`btn ${currentView === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'flex-start', padding: '10px 16px' }}
                    onClick={() => { setCurrentView('reports'); fetchInvoices(); setIsMobileSidebarOpen(false); }}
                  >
                    <FileBarChart2 size={18} /> Reports Terminal
                  </button>
                  <button
                    className={`btn ${currentView === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'flex-start', padding: '10px 16px' }}
                    onClick={() => { setCurrentView('analytics'); fetchInvoices(); fetchProducts(); setIsMobileSidebarOpen(false); }}
                  >
                    <TrendingUp size={18} /> Analytics Center
                  </button>
                </>
              )}

              <button
                className={`btn ${currentView === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', padding: '10px 16px', marginTop: 'auto' }}
                onClick={() => { setCurrentView('profile'); setIsMobileSidebarOpen(false); }}
              >
                <UserIcon size={18} /> My Settings
              </button>
            </div>

            {/* User details at bottom */}
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                {user?.role} {user?.role === 'admin' && `(${user?.industryType})`}
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="btn btn-secondary no-print"
                style={{ padding: '6px 12px', fontSize: '12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />} Theme: {theme === 'dark' ? 'Bright' : 'Dark'}
              </button>
              <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px', width: '100%', marginTop: '4px' }}>
                <LogOut size={12} /> Sign Out
              </button>
            </div>

          </div>

          {/* Main Content Area */}
          <div className="main-content">
            
            {/* Superadmin Screen: Manage Admin CRUD */}
            {currentView === 'admins' && (
              <SuperadminView
                admins={admins}
                adminForm={adminForm}
                setAdminForm={setAdminForm}
                editingAdminId={editingAdminId}
                setEditingAdminId={setEditingAdminId}
                handleSaveAdmin={handleSaveAdmin}
                handleToggleAdmin={handleToggleAdmin}
                handleDeleteAdmin={handleDeleteAdmin}
              />
            )}

            {/* Admin View: Dashboard */}
            {currentView === 'dashboard' && (
              <DashboardView
                analytics={analytics}
                stats={stats}
                fetchDashboardStats={fetchDashboardStats}
                fetchInvoices={fetchInvoices}
                fetchProducts={fetchProducts}
                setPrintInvoiceData={setPrintInvoiceData}
              />
            )}

            {/* Admin View: Billing Terminal */}
            {currentView === 'billing' && (
              <BillingView
                showProductCatalogModal={showProductCatalogModal}
                setShowProductCatalogModal={setShowProductCatalogModal}
                posSelectedCustomer={posSelectedCustomer}
                setPosSelectedCustomer={setPosSelectedCustomer}
                showQuickAddCustomer={showQuickAddCustomer}
                setShowQuickAddCustomer={setShowQuickAddCustomer}
                customers={customers}
                billCustomer={billCustomer}
                setBillCustomer={setBillCustomer}
                customerForm={customerForm}
                setCustomerForm={setCustomerForm}
                handleQuickAddCustomer={handleQuickAddCustomer}
                cart={cart}
                setCart={setCart}
                distinctShipping={distinctShipping}
                setDistinctShipping={setDistinctShipping}
                shippingDetails={shippingDetails}
                setShippingDetails={setShippingDetails}
                updateCartQty={updateCartQty}
                calculateCartTotal={calculateCartTotal}
                billDiscount={billDiscount}
                setBillDiscount={setBillDiscount}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                paymentStatus={paymentStatus}
                setPaymentStatus={setPaymentStatus}
                handlePreviewCheckout={handlePreviewCheckout}
                handleCheckout={handleCheckout}
                posProductSearch={posProductSearch}
                setPosProductSearch={setPosProductSearch}
                posCategoryFilter={posCategoryFilter}
                setPosCategoryFilter={setPosCategoryFilter}
                posPriceSort={posPriceSort}
                setPosPriceSort={setPosPriceSort}
                posMinPrice={posMinPrice}
                setPosMinPrice={setPosMinPrice}
                posMaxPrice={posMaxPrice}
                setPosMaxPrice={setPosMaxPrice}
                products={products}
                setPosSelectedProduct={setPosSelectedProduct}
                setPosProductQty={setPosProductQty}
              />
            )}

            {/* Admin View: Inventory/Products Management */}
            {currentView === 'inventory' && (
              <InventoryView
                user={user}
                resetProductForm={resetProductForm}
                editingProductId={editingProductId}
                setEditingProductId={setEditingProductId}
                productForm={productForm}
                setProductForm={setProductForm}
                handleSaveProduct={handleSaveProduct}
                productSearch={productSearch}
                setProductSearch={setProductSearch}
                fetchProducts={fetchProducts}
                products={products}
                handleDeleteProduct={handleDeleteProduct}
              />
            )}

            {/* Admin View: Customer Directory */}
            {currentView === 'customers' && (
              <CustomersView
                editingCustomerId={editingCustomerId}
                setEditingCustomerId={setEditingCustomerId}
                customerForm={customerForm}
                setCustomerForm={setCustomerForm}
                handleSaveCustomer={handleSaveCustomer}
                customerSearch={customerSearch}
                setCustomerSearch={setCustomerSearch}
                fetchCustomers={fetchCustomers}
                customers={customers}
                handleDeleteCustomer={handleDeleteCustomer}
              />
            )}

            {/* Admin View: Reports Terminal */}
            {currentView === 'reports' && (
              <ReportsView
                downloadInvoicesExcel={downloadInvoicesExcel}
                downloadProductsExcel={downloadProductsExcel}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                invoiceSearch={invoiceSearch}
                setInvoiceSearch={setInvoiceSearch}
                fetchInvoices={fetchInvoices}
                invoices={invoices}
                setPrintInvoiceData={setPrintInvoiceData}
              />
            )}

            {/* Analytics Center Panel */}
            {currentView === 'analytics' && (
              <AnalyticsView
                fetchInvoices={fetchInvoices}
                fetchProducts={fetchProducts}
                analyticsTab={analyticsTab}
                setAnalyticsTab={setAnalyticsTab}
                analytics={analytics}
                products={products}
              />
            )}

            {/* Profile Settings Panel */}
            {currentView === 'profile' && (
              <ProfileView
                handleProfileUpdate={handleProfileUpdate}
                profileName={profileName}
                setProfileName={setProfileName}
                profilePhone={profilePhone}
                setProfilePhone={setProfilePhone}
                handleChangePassword={handleChangePassword}
                oldPassword={oldPassword}
                setOldPassword={setOldPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                companyForm={companyForm}
                setCompanyForm={setCompanyForm}
                setCompanyInfo={setCompanyInfo}
                showFlash={showFlash}
              />
            )}

          </div>

          {/* Root-Level Overlays to prevent stacking context leaks */}
          {posSelectedProduct && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px', color: 'var(--text-main)' }}>Add Item to Invoice</h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>{posSelectedProduct.name}</h4>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Category: {posSelectedProduct.category || 'General'} | Unit: {posSelectedProduct.unit || 'pcs'}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-main)', marginTop: '8px', fontWeight: 600 }}>
                    Selling Price: <span style={{ color: 'var(--success-color)' }}>₹{posSelectedProduct.price.toFixed(2)}</span> (GST Rate: {posSelectedProduct.gstRate}%)
                  </div>
                  <div style={{ fontSize: '12px', color: posSelectedProduct.stock < 5 ? 'var(--danger-color)' : 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                    Available Stock: {posSelectedProduct.stock} {posSelectedProduct.unit || 'pcs'}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Select Quantity</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700 }}
                      onClick={() => setPosProductQty(prev => Math.max(1, prev - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-input"
                      style={{ textAlign: 'center', width: '100px', fontSize: '16px', fontWeight: 700 }}
                      value={posProductQty}
                      onChange={(e) => setPosProductQty(Math.min(posSelectedProduct.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                      min="1"
                      max={posSelectedProduct.stock}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700 }}
                      onClick={() => setPosProductQty(prev => Math.min(posSelectedProduct.stock, prev + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Real-time total multiplication display */}
                <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '24px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Net Subtotal:</span>
                    <span>₹{(posSelectedProduct.price * posProductQty).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>GST Tax Amount ({posSelectedProduct.gstRate}%):</span>
                    <span>₹{((posSelectedProduct.price * posProductQty * (posSelectedProduct.gstRate || 0)) / 100).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px dashed var(--border-color)', paddingTop: '6px', fontSize: '16px', marginTop: '6px' }}>
                    <span>Total Price:</span>
                    <span className="gradient-text">₹{((posSelectedProduct.price * posProductQty) + ((posSelectedProduct.price * posProductQty * (posSelectedProduct.gstRate || 0)) / 100)).toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => { setPosSelectedProduct(null); setPosProductQty(1); }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    style={{ flex: 1 }}
                    onClick={handleAddProductToCart}
                  >
                    Add to Invoice
                  </button>
                </div>

              </div>
            </div>
          )}



          {printInvoiceData && (
            <div className="no-print-bg" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
              
              <div className="print-modal-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: printTemplate === 'normal' ? '780px' : '400px', position: 'relative' }}>
                
                {/* Floating Close X Button */}
                <button
                  className="no-print"
                  onClick={() => setPrintInvoiceData(null)}
                  style={{
                    position: 'absolute', top: '-12px', right: '-12px', zIndex: 9999,
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: '#ef4444', color: '#fff', border: '2px solid #fff',
                    fontSize: '18px', fontWeight: 900, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)', lineHeight: 1
                  }}
                  title="Close Invoice"
                >
                  ✕
                </button>

                {/* Control Panel (Hidden during printing) */}
                <div className="glass-panel no-print" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                    <button
                      className="btn"
                      style={{ flex: 1, padding: '10px', fontSize: '13px', background: printTemplate === 'normal' ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                      onClick={() => setPrintTemplate('normal')}
                    >
                      Normal A4 Layout
                    </button>
                    <button
                      className="btn"
                      style={{ flex: 1, padding: '10px', fontSize: '13px', background: printTemplate === 'thermal' ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                      onClick={() => setPrintTemplate('thermal')}
                    >
                      Thermal (80mm)
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {printInvoiceData.isPreview ? (
                      <>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                          onClick={() => setPrintInvoiceData(null)}
                        >
                          ← Back to Edit
                        </button>
                        <button
                          className="btn btn-success"
                          style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--success-color)', border: 'none' }}
                          onClick={async () => { await handleCheckout(); }}
                        >
                          <Printer size={16} /> Finalize & Save Invoice
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-secondary" style={{ padding: '10px' }} onClick={() => setPrintInvoiceData(null)}>
                          Close
                        </button>
                        <button className="btn btn-success" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => window.print()}>
                          <Printer size={16} /> Print Receipt
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="print-area-wrapper" style={{ background: '#fff', color: '#000', padding: printTemplate === 'normal' ? '40px' : '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
                  {printTemplate === 'normal' ? (
                    /* ----------------- NORMAL A4 TEMPLATE ----------------- */
                    <InvoiceA4Template
                      printInvoiceData={printInvoiceData}
                      user={user}
                      companyInfo={companyInfo}
                    />
                  ) : (
                    /* ----------------- THERMAL 80MM TEMPLATE ----------------- */
                    <InvoiceThermalTemplate
                      printInvoiceData={printInvoiceData}
                      user={user}
                      companyInfo={companyInfo}
                    />
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
