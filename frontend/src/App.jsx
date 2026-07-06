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
  Eye
} from 'lucide-react';

// Set up default axios base url or interceptors
axios.defaults.baseURL = ''; // Handled by Vite server proxy to localhost:5000

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
  const [shippingDetails, setShippingDetails] = useState({ name: '', phone: '', address: '', city: '', state: '', country: 'India', pincode: '' });
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

  // Profile Form States
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

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
    setProductForm({ name: '', description: '', price: '', purchasePrice: '', minSellingPrice: '', stock: '', unit: 'pcs', dose: '', hsnCode: '', gstRate: 0, category: '' });
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
        unit: posSelectedProduct.unit
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
        pincode: billCustomer.pincode || ''
      },
      items: cart.map((i, index) => ({
        _id: index.toString(),
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        gstRate: i.gstRate || 0,
        total: (i.price * i.quantity) + ((i.price * i.quantity * (i.gstRate || 0)) / 100),
        dose: i.dose
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
          pincode: billCustomer.pincode
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
      setDistinctShipping(false);
      setShippingDetails({ name: '', phone: '', address: '', city: '', state: '', country: 'India', pincode: '' });
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
          
          {/* Sidebar */}
          <div className="sidebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
              <div style={{ background: 'var(--primary-gradient)', padding: '8px', borderRadius: '10px' }}>
                <Receipt size={20} color="#fff" />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>McZen Billing</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              {user?.role === 'superadmin' ? (
                <button
                  className={`btn ${currentView === 'admins' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', padding: '10px 16px' }}
                  onClick={() => setCurrentView('admins')}
                >
                  <Shield size={18} /> Admin Accounts
                </button>
              ) : (
                <>
                  <button
                    className={`btn ${currentView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'flex-start', padding: '10px 16px' }}
                    onClick={() => { setCurrentView('dashboard'); fetchDashboardStats(); }}
                  >
                    <LayoutDashboard size={18} /> Dashboard
                  </button>
                  <button
                    className={`btn ${currentView === 'billing' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'flex-start', padding: '10px 16px' }}
                    onClick={() => { setCurrentView('billing'); fetchProducts(); }}
                  >
                    <Receipt size={18} /> Billing Terminal
                  </button>
                  <button
                    className={`btn ${currentView === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'flex-start', padding: '10px 16px' }}
                    onClick={() => { setCurrentView('inventory'); fetchProducts(); }}
                  >
                    <Package size={18} /> Inventory Items
                  </button>
                  <button
                    className={`btn ${currentView === 'customers' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'flex-start', padding: '10px 16px' }}
                    onClick={() => { setCurrentView('customers'); fetchCustomers(); }}
                  >
                    <Users size={18} /> Customers
                  </button>
                  <button
                    className={`btn ${currentView === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'flex-start', padding: '10px 16px' }}
                    onClick={() => { setCurrentView('reports'); fetchInvoices(); }}
                  >
                    <FileBarChart2 size={18} /> Reports Terminal
                  </button>
                </>
              )}

              <button
                className={`btn ${currentView === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', padding: '10px 16px', marginTop: 'auto' }}
                onClick={() => setCurrentView('profile')}
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
              <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px', width: '100%', marginTop: '4px' }}>
                <LogOut size={12} /> Sign Out
              </button>
            </div>

          </div>

          {/* Main Content Area */}
          <div className="main-content">
            
            {/* Superadmin Screen: Manage Admin CRUD */}
            {currentView === 'admins' && (
              <div>
                <div style={{ marginBottom: '30px' }}>
                  <h1 style={{ fontSize: '28px' }}>Admin Accounts Directory</h1>
                  <p style={{ color: 'var(--text-muted)' }}>Superadmin portal to create, configure, and toggle active status of client business logins.</p>
                </div>

                <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr', alignItems: 'start' }}>
                  
                  {/* Create / Edit Panel */}
                  <div className="glass-panel">
                    <h3>{editingAdminId ? 'Modify Admin Settings' : 'Provision New Admin'}</h3>
                    <form onSubmit={handleSaveAdmin} style={{ marginTop: '20px' }}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Tata Kirana"
                          value={adminForm.name}
                          onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                        />
                      </div>
                      {!editingAdminId && (
                        <>
                          <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                              type="email"
                              required
                              className="form-input"
                              placeholder="tata@kirana.com"
                              value={adminForm.email}
                              onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                              type="password"
                              required
                              className="form-input"
                              placeholder="••••••••"
                              value={adminForm.password}
                              onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                            />
                          </div>
                        </>
                      )}
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. +91 9999988888"
                          value={adminForm.phone}
                          onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Business Sector / Industry</label>
                        <select
                          className="form-select"
                          value={adminForm.industryType}
                          onChange={(e) => setAdminForm({ ...adminForm, industryType: e.target.value })}
                        >
                          <option value="store">Retail / General Store</option>
                          <option value="medical">Medical / Pharmacy</option>
                          <option value="grocery">Kirana / Grocery Shop</option>
                          <option value="vegetable">Vegetable / Fruits Shop</option>
                          <option value="drinks">Beverage / Juice Bar</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                        {editingAdminId && (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              setEditingAdminId(null);
                              setAdminForm({ name: '', email: '', password: '', phone: '', industryType: 'store' });
                            }}
                            style={{ flex: 1 }}
                          >
                            Cancel
                          </button>
                        )}
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                          Save Admin
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Admins Grid List */}
                  <div className="glass-panel">
                    <h3>Registered Business Admins</h3>
                    <div className="custom-table-container" style={{ marginTop: '20px' }}>
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Business Details</th>
                            <th>Sector</th>
                            <th>Status</th>
                            <th>Joined Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {admins.length === 0 ? (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No admin accounts registered yet.</td>
                            </tr>
                          ) : (
                            admins.map(adm => (
                              <tr key={adm._id}>
                                <td>
                                  <div style={{ fontWeight: 600 }}>{adm.name}</div>
                                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{adm.email}</div>
                                  {adm.phone && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tel: {adm.phone}</div>}
                                </td>
                                <td>
                                  <span className="badge badge-role">{adm.industryType}</span>
                                </td>
                                <td>
                                  <button
                                    onClick={() => handleToggleAdmin(adm._id)}
                                    className={`badge ${adm.status === 'active' ? 'badge-active' : 'badge-inactive'}`}
                                    style={{ border: 'none', cursor: 'pointer' }}
                                  >
                                    {adm.status}
                                  </button>
                                </td>
                                <td style={{ fontSize: '13px' }}>{new Date(adm.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                      className="btn btn-secondary"
                                      style={{ padding: '6px' }}
                                      onClick={() => {
                                        setEditingAdminId(adm._id);
                                        setAdminForm({ name: adm.name, email: adm.email, password: '', phone: adm.phone || '', industryType: adm.industryType });
                                      }}
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button
                                      className="btn btn-danger"
                                      style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.1)' }}
                                      onClick={() => handleDeleteAdmin(adm._id)}
                                    >
                                      <Trash2 size={14} color="var(--danger-color)" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Admin View: Dashboard */}
            {currentView === 'dashboard' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <div>
                    <h1 style={{ fontSize: '28px' }}>Overview Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time summaries of transactions, sales analysis, and stock levels.</p>
                  </div>
                  <button onClick={fetchDashboardStats} className="btn btn-secondary" style={{ padding: '10px' }}>
                    <RefreshCw size={16} /> Reload Metrics
                  </button>
                </div>

                {/* Dashboard Stats Row */}
                {stats && (
                  <>
                    <div className="grid-4" style={{ marginBottom: '30px' }}>
                      <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Revenue</div>
                        <div style={{ fontSize: '26px', fontWeight: 700, marginTop: '8px', color: 'var(--success-color)' }}>
                          ₹{stats.summary.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="glass-panel">
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Estimated Net Profit</div>
                        <div style={{ fontSize: '26px', fontWeight: 700, marginTop: '8px', color: 'hsl(200, 80%, 55%)' }}>
                          ₹{stats.summary.totalProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="glass-panel">
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Sales Orders</div>
                        <div style={{ fontSize: '26px', fontWeight: 700, marginTop: '8px' }}>
                          {stats.summary.invoicesCount} Invoices
                        </div>
                      </div>
                      <div className="glass-panel" style={{ borderLeft: stats.summary.lowStockCount > 0 ? '4px solid var(--warning-color)' : '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Critical Stock Warnings</div>
                        <div style={{ fontSize: '26px', fontWeight: 700, marginTop: '8px', color: stats.summary.lowStockCount > 0 ? 'var(--warning-color)' : 'var(--text-main)' }}>
                          {stats.summary.lowStockCount} Items Low
                        </div>
                      </div>
                    </div>

                    <div className="grid-3" style={{ marginBottom: '30px' }}>
                      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Registered Customers</div>
                        <div style={{ fontSize: '26px', fontWeight: 700, marginTop: '8px', color: 'hsl(145, 80%, 50%)' }}>
                          {customers.length} Clients
                        </div>
                      </div>
                      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Catalog Products</div>
                        <div style={{ fontSize: '26px', fontWeight: 700, marginTop: '8px', color: 'hsl(265, 80%, 65%)' }}>
                          {products.length} Items
                        </div>
                      </div>
                      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Stock Volume</div>
                        <div style={{ fontSize: '26px', fontWeight: 700, marginTop: '8px', color: 'hsl(35, 90%, 55%)' }}>
                          {products.reduce((acc, curr) => acc + (curr.stock || 0), 0)} Pieces
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="grid-2">
                  {/* Left Column: Recent Sales */}
                  <div className="glass-panel">
                    <h3>Recent Transactions</h3>
                    <div className="custom-table-container" style={{ marginTop: '20px' }}>
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Bill #</th>
                            <th>Customer</th>
                            <th>Total Amount</th>
                            <th>Payment</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats?.recentInvoices.length === 0 ? (
                            <tr>
                              <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No invoices generated yet.</td>
                            </tr>
                          ) : (
                            stats?.recentInvoices.map(inv => (
                              <tr key={inv._id}>
                                <td style={{ fontWeight: 600 }}>{inv.invoiceNumber}</td>
                                <td>{inv.customerDetails.name}</td>
                                <td>₹{inv.grandTotal.toFixed(2)}</td>
                                <td>
                                  <span className="badge badge-active" style={{ fontSize: '10px' }}>{inv.paymentMethod}</span>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-secondary"
                                    style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    onClick={() => setPrintInvoiceData(inv)}
                                  >
                                    <Eye size={12} /> View
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column: Low Stock Panel */}
                  <div className="glass-panel">
                    <h3 style={{ color: 'var(--warning-color)' }}>Low Stock Checklist</h3>
                    <div className="custom-table-container" style={{ marginTop: '20px' }}>
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Current Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats?.lowStockProducts.length === 0 ? (
                            <tr>
                              <td colSpan="4" style={{ textAlign: 'center', color: 'var(--success-color)' }}>All items have adequate inventory!</td>
                            </tr>
                          ) : (
                            stats?.lowStockProducts.map(prod => (
                              <tr key={prod._id}>
                                <td style={{ fontWeight: 600 }}>{prod.name} {prod.dose && `(${prod.dose})`}</td>
                                <td>{prod.category || 'General'}</td>
                                <td>₹{prod.price.toFixed(2)}</td>
                                <td style={{ color: 'var(--danger-color)', fontWeight: 700 }}>
                                  {prod.stock} {prod.unit}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* Admin View: Billing Terminal */}
            {currentView === 'billing' && (
              <div>
                <div style={{ marginBottom: '30px' }}>
                  <h1 style={{ fontSize: '28px' }}>Checkout Billing Terminal</h1>
                  <p style={{ color: 'var(--text-muted)' }}>Quick sales calculator with automatic inventory deduction and receipt preview.</p>
                </div>

                {!showProductCatalogModal ? (
                  <div className="grid-2" style={{ gridTemplateColumns: '1.2fr 1fr', alignItems: 'start' }}>
                  
                  {/* Left Column: POS Customer & Product Selection */}
                  <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Section 1: Customer Selection */}
                    <div>
                      <h3 style={{ fontSize: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px' }}>1. Customer Profile Selection</h3>
                      
                      {!posSelectedCustomer ? (
                        <div>
                          {!showQuickAddCustomer ? (
                            <div>
                              <div className="form-group">
                                <label className="form-label">Search Registered Customers</label>
                                <select
                                  className="form-select"
                                  value=""
                                  onChange={(e) => {
                                    const selected = customers.find(c => c._id === e.target.value);
                                    if (selected) {
                                      setPosSelectedCustomer(selected);
                                      setBillCustomer({
                                        name: selected.name,
                                        phone: selected.phone,
                                        address: selected.address || '',
                                        city: selected.city || '',
                                        state: selected.state || '',
                                        country: selected.country || 'India',
                                        gstNumber: selected.gstNumber || '',
                                        pincode: selected.pincode || ''
                                      });
                                    }
                                  }}
                                >
                                  <option value="">-- Click to search & select customer --</option>
                                  {customers.map(c => (
                                    <option key={c._id} value={c._id}>{c.name} ({c.phone})</option>
                                  ))}
                                </select>
                              </div>
                              
                              <div style={{ textAlign: 'center', margin: '14px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                                — or —
                              </div>
                              
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '10px' }}
                                onClick={() => setShowQuickAddCustomer(true)}
                              >
                                <Plus size={16} /> Register New Customer
                              </button>
                            </div>
                          ) : (
                            /* Quick Register Customer Form */
                            <form onSubmit={handleQuickAddCustomer} style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                              <h4 style={{ marginBottom: '14px', fontSize: '14px' }}>Quick Customer Registration</h4>
                              <div className="grid-2">
                                <div className="form-group">
                                  <label className="form-label">Full Name *</label>
                                  <input
                                    type="text"
                                    required
                                    className="form-input"
                                    value={customerForm.name}
                                    onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Phone Number *</label>
                                  <input
                                    type="text"
                                    required
                                    className="form-input"
                                    value={customerForm.phone}
                                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                  type="email"
                                  className="form-input"
                                  value={customerForm.email}
                                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Street Address</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={customerForm.address}
                                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                                />
                              </div>
                              <div className="grid-3">
                                <div className="form-group">
                                  <label className="form-label">City</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={customerForm.city}
                                    onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">State</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={customerForm.state}
                                    onChange={(e) => setCustomerForm({ ...customerForm, state: e.target.value })}
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Pincode</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={customerForm.pincode}
                                    onChange={(e) => setCustomerForm({ ...customerForm, pincode: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div className="grid-2">
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label className="form-label">Country</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={customerForm.country || 'India'}
                                    onChange={(e) => setCustomerForm({ ...customerForm, country: e.target.value })}
                                  />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label className="form-label">GST Number</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={customerForm.gstNumber}
                                    onChange={(e) => setCustomerForm({ ...customerForm, gstNumber: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  style={{ flex: 1 }}
                                  onClick={() => setShowQuickAddCustomer(false)}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                  style={{ flex: 1 }}
                                >
                                  Register & Select
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      ) : (
                        /* Customer Info Card */
                        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '16px', borderRadius: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '12px', background: 'rgba(16,185,129,0.15)', color: 'var(--success-color)', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>Active Customer</span>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '12px' }}
                              onClick={() => {
                                setPosSelectedCustomer(null);
                                setBillCustomer({ name: '', phone: '', address: '', city: '', state: '', country: 'India', gstNumber: '', pincode: '' });
                                setCart([]);
                              }}
                            >
                              Change Client
                            </button>
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{posSelectedCustomer.name}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Phone: {posSelectedCustomer.phone} | Email: {posSelectedCustomer.email || 'N/A'}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            Address: {posSelectedCustomer.address || 'N/A'}{posSelectedCustomer.city && `, ${posSelectedCustomer.city}`}{posSelectedCustomer.state && `, ${posSelectedCustomer.state}`}{posSelectedCustomer.pincode && ` - ${posSelectedCustomer.pincode}`}
                          </div>
                          {posSelectedCustomer.gstNumber && (
                            <div style={{ fontSize: '12px', color: 'var(--success-color)', fontWeight: 600, marginTop: '4px' }}>GSTIN: {posSelectedCustomer.gstNumber}</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Section 2: Product Catalogue Selector Link */}
                    {posSelectedCustomer && (
                      <div>
                        <h3 style={{ fontSize: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px' }}>2. Select Products</h3>
                        
                        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', borderRadius: '12px', padding: '30px 20px', textAlign: 'center' }}>
                          <ShoppingBag size={32} style={{ color: 'var(--primary-color)', marginBottom: '12px' }} />
                          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Product Catalog Browser</h4>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                            {cart.length > 0
                              ? `You have added ${cart.reduce((a, b) => a + b.quantity, 0)} items to this invoice.`
                              : "No items added yet. Click browse to open the catalog selector."
                            }
                          </p>
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--primary-gradient)', border: 'none' }}
                            onClick={() => setShowProductCatalogModal(true)}
                          >
                            <Plus size={16} /> Browse & Add Products
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Checkout Invoice Drawer */}
                  <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Header Details */}
                    <div>
                      <h3 style={{ fontSize: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px' }}>Invoice Summary</h3>
                      
                      {posSelectedCustomer ? (
                        <div style={{ fontSize: '13px', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div><b>Client:</b> {billCustomer.name} ({billCustomer.phone})</div>
                          <div><b>Billing Address:</b> {billCustomer.address || 'N/A'}{billCustomer.city && `, ${billCustomer.city}`}{billCustomer.state && `, ${billCustomer.state}`}{billCustomer.pincode && ` - ${billCustomer.pincode}`}{billCustomer.country && `, ${billCustomer.country}`}</div>
                          {billCustomer.gstNumber && <div><b>GSTIN:</b> {billCustomer.gstNumber}</div>}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px dashed var(--border-color)', color: 'var(--text-muted)', fontSize: '13px' }}>
                          Please select or register a customer on the left to begin compiling invoice orders.
                        </div>
                      )}
                    </div>

                    {/* Distinct Shipping Details toggle */}
                    {posSelectedCustomer && (
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                            <input
                              type="checkbox"
                              checked={distinctShipping}
                              onChange={(e) => setDistinctShipping(e.target.checked)}
                              style={{ accentColor: 'var(--primary-color)', width: '16px', height: '16px' }}
                            />
                            Ship to a different address?
                          </label>
                        </div>

                        {distinctShipping && (
                          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '13px' }}>
                            <h4 style={{ marginBottom: '10px', fontSize: '13px' }}>Shipping Address details</h4>
                            <div className="grid-2">
                              <div className="form-group">
                                <label className="form-label">Recipient Name</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={shippingDetails.name || ''}
                                  onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Recipient Phone</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={shippingDetails.phone || ''}
                                  onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Street Address</label>
                              <input
                                type="text"
                                className="form-input"
                                value={shippingDetails.address || ''}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                              />
                            </div>
                            <div className="grid-3">
                              <div className="form-group">
                                <label className="form-label">City</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={shippingDetails.city || ''}
                                  onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">State</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={shippingDetails.state || ''}
                                  onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Pincode</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={shippingDetails.pincode || ''}
                                  onChange={(e) => setShippingDetails({ ...shippingDetails, pincode: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cart Items list */}
                    {posSelectedCustomer && (
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '10px' }}>Items Added to Invoice</h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '120px', maxHeight: '250px', overflowY: 'auto' }}>
                          {cart.length === 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: 'var(--text-muted)', fontSize: '13px' }}>
                              Cart is empty. Select item(s) on the left.
                            </div>
                          ) : (
                            cart.map(item => (
                              <div key={item.productId} style={{ padding: '10px', background: 'rgba(255,255,255,0.015)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '160px' }} title={item.name}>{item.name}</span>
                                  <span style={{ color: 'var(--success-color)' }}>₹{((item.price * item.quantity) + ((item.price * item.quantity * item.gstRate) / 100)).toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                  <span>₹{item.price.toFixed(2)} each (GST {item.gstRate}%)</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <button type="button" className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => updateCartQty(item.productId, item.quantity - 1)}>-</button>
                                    <span style={{ fontWeight: 700, minWidth: '16px', textAlign: 'center', color: 'var(--text-main)' }}>{item.quantity}</span>
                                    <button type="button" className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => updateCartQty(item.productId, item.quantity + 1)}>+</button>
                                  </div>
                                  <button type="button" className="btn btn-danger" style={{ padding: '4px', background: 'rgba(239,68,68,0.1)' }} onClick={() => updateCartQty(item.productId, 0)}>
                                    <Trash2 size={11} color="var(--danger-color)" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* Total computations & Finalize */}
                    {posSelectedCustomer && cart.length > 0 && (
                      <div style={{ background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Net Price:</span>
                          <span>₹{calculateCartTotal().subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Total GST Tax:</span>
                          <span>₹{calculateCartTotal().taxAmount.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '8px 0', borderTop: '1px dashed var(--border-color)', borderBottom: '1px dashed var(--border-color)', margin: '8px 0' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Discount (INR):</span>
                          <input
                            type="number"
                            className="form-input"
                            style={{ width: '80px', padding: '4px 8px', textAlign: 'right', fontSize: '13px' }}
                            value={billDiscount}
                            onChange={(e) => setBillDiscount(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px', marginBottom: '16px' }}>
                          <span>Grand Total:</span>
                          <span className="gradient-text">₹{calculateCartTotal().total.toFixed(2)}</span>
                        </div>

                        <div className="grid-2" style={{ marginBottom: '16px' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '12px' }}>Payment Mode</label>
                            <select className="form-select" style={{ padding: '8px', fontSize: '13px' }} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                              <option value="cash">Cash</option>
                              <option value="upi">UPI / Scanner</option>
                              <option value="card">Card Payment</option>
                            </select>
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '12px' }}>Status</label>
                            <select className="form-select" style={{ padding: '8px', fontSize: '13px' }} value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                              <option value="paid">Paid</option>
                              <option value="unpaid">Unpaid</option>
                              <option value="partial">Partial</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                          <button
                            type="button"
                            onClick={handlePreviewCheckout}
                            className="btn btn-secondary"
                            style={{ flex: 1, padding: '12px', fontSize: '14px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                          >
                            <Eye size={16} /> Preview Bill
                          </button>
                          <button
                            type="button"
                            onClick={handleCheckout}
                            className="btn btn-success"
                            style={{ flex: 1.5, padding: '12px', fontSize: '14px', background: 'var(--success-color)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                          >
                            <Printer size={16} /> Finalize & Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                ) : (
                  /* Catalogue Sub-View */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Header Controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                      <div>
                        <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }} className="gradient-text">Select Products Catalogue</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0 0' }}>Add items to invoice. Selected customer: <b>{billCustomer.name}</b></p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-success"
                        style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, background: 'var(--success-color)', border: 'none' }}
                        onClick={() => setShowProductCatalogModal(false)}
                      >
                        Continue to Checkout / Invoice ({cart.reduce((acc, curr) => acc + curr.quantity, 0)} Items Added)
                      </button>
                    </div>

                    {/* Filters Row */}
                    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px', padding: '20px' }}>
                      <div className="grid-3" style={{ gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
                        <div style={{ position: 'relative' }}>
                          <Search size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                          <input
                            type="text"
                            className="form-input"
                            style={{ paddingLeft: '40px' }}
                            placeholder="Search items by name, description, category or dosage..."
                            value={posProductSearch}
                            onChange={(e) => setPosProductSearch(e.target.value)}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <select className="form-select" value={posCategoryFilter} onChange={(e) => setPosCategoryFilter(e.target.value)}>
                            <option value="">All Categories</option>
                            {Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <select className="form-select" value={posPriceSort} onChange={(e) => setPosPriceSort(e.target.value)}>
                            <option value="">Sort by Price</option>
                            <option value="asc">Rate: Low to High</option>
                            <option value="desc">Rate: High to Low</option>
                          </select>
                        </div>
                      </div>

                      {/* Dynamic Price Range Selector */}
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '14px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.5fr', gap: '20px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Max Price Range Slider</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                              type="range"
                              min="0"
                              max="10000"
                              step="50"
                              value={posMaxPrice}
                              onChange={(e) => setPosMaxPrice(parseInt(e.target.value))}
                              style={{ flex: 1, accentColor: 'var(--primary-color)', height: '4px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--success-color)', minWidth: '70px', textAlign: 'right' }}>≤ ₹{posMaxPrice}</span>
                          </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Min Price (INR)</label>
                          <input
                            type="number"
                            className="form-input"
                            value={posMinPrice}
                            onChange={(e) => setPosMinPrice(Math.max(0, parseInt(e.target.value) || 0))}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Max Price (INR)</label>
                          <input
                            type="number"
                            className="form-input"
                            value={posMaxPrice}
                            onChange={(e) => setPosMaxPrice(Math.max(0, parseInt(e.target.value) || 0))}
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ height: '42px', marginTop: '16px', fontSize: '12px' }}
                          onClick={() => { setPosMinPrice(0); setPosMaxPrice(10000); setPosCategoryFilter(''); setPosProductSearch(''); setPosPriceSort(''); }}
                        >
                          Reset Filters
                        </button>
                      </div>
                    </div>

                    {/* Split Layout: Catalog Grid + Temporary Live Cart Summary */}
                    <div style={{ display: 'flex', gap: '24px', flex: 1, overflow: 'hidden' }}>
                      
                      {/* Left Side: Product Cards Grid */}
                      <div style={{ flex: 1.8, overflowY: 'auto', paddingRight: '10px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                          {(() => {
                            const list = products.filter(p => {
                              const s = posProductSearch.toLowerCase();
                              const nameMatch = p.name.toLowerCase().includes(s) || (p.description && p.description.toLowerCase().includes(s));
                              const catMatch = posCategoryFilter ? p.category === posCategoryFilter : true;
                              const priceMatch = p.price >= posMinPrice && p.price <= posMaxPrice;
                              return nameMatch && catMatch && priceMatch;
                            });
                            if (posPriceSort === 'asc') list.sort((a, b) => a.price - b.price);
                            if (posPriceSort === 'desc') list.sort((a, b) => b.price - a.price);

                            if (list.length === 0) {
                              return (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0', fontSize: '15px' }}>
                                  No products match the selected price, search query, or category filters.
                                </div>
                              );
                            }

                            return list.map(prod => (
                              <div
                                key={prod._id}
                                className="glass-panel"
                                style={{
                                  padding: '18px',
                                  borderRadius: '14px',
                                  background: 'rgba(255,255,255,0.02)',
                                  border: '1px solid var(--border-color)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  gap: '14px',
                                  transition: 'var(--transition-all)',
                                  cursor: 'pointer',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                                onClick={() => {
                                  if (prod.stock > 0) {
                                    setPosSelectedProduct(prod);
                                    setPosProductQty(1);
                                  }
                                }}
                              >
                                <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                                      {prod.category || 'General'}
                                    </span>
                                    {prod.stock === 0 ? (
                                      <span style={{ fontSize: '9px', background: 'rgba(239,68,68,0.15)', color: 'var(--danger-color)', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                                        OUT OF STOCK
                                      </span>
                                    ) : (
                                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                        In Stock
                                      </span>
                                    )}
                                  </div>
                                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginTop: '10px', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={prod.name}>
                                    {prod.name}
                                  </h4>
                                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    {prod.dose && `Dose: ${prod.dose}`} {prod.hsnCode && `| HSN: ${prod.hsnCode}`}
                                  </p>
                                </div>
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px', marginTop: 'auto' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                      <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--success-color)' }}>₹{prod.price.toFixed(2)}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: prod.stock < 5 ? 'var(--danger-color)' : 'var(--text-muted)', fontWeight: 600 }}>
                                      Stock: {prod.stock} {prod.unit}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '8px', fontSize: '13px', marginTop: '12px', background: 'var(--primary-gradient)', border: 'none' }}
                                    disabled={prod.stock <= 0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPosSelectedProduct(prod);
                                      setPosProductQty(1);
                                    }}
                                  >
                                    {prod.stock <= 0 ? 'Out of Stock' : 'Select Item'}
                                  </button>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Right Side: Temporary Cart Preview Panel */}
                      <div className="glass-panel" style={{ flex: 0.8, display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '14px', overflowY: 'auto' }}>
                        <h3 style={{ fontSize: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', margin: 0, fontWeight: 700 }}>
                          Current Invoice Items
                        </h3>
                        
                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {cart.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '150px', color: 'var(--text-muted)', fontSize: '13px' }}>
                              <ShoppingBag size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                              No items added yet.
                            </div>
                          ) : (
                            cart.map(item => (
                              <div key={item.productId} style={{ padding: '10px', background: 'rgba(255,255,255,0.015)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }} title={item.name}>{item.name}</span>
                                  <span style={{ color: 'var(--success-color)' }}>₹{((item.price * item.quantity) + ((item.price * item.quantity * item.gstRate) / 100)).toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                  <span>₹{item.price.toFixed(2)} each</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <button type="button" className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => updateCartQty(item.productId, item.quantity - 1)}>-</button>
                                    <span style={{ fontWeight: 700, minWidth: '16px', textAlign: 'center', color: 'var(--text-main)' }}>{item.quantity}</span>
                                    <button type="button" className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => updateCartQty(item.productId, item.quantity + 1)}>+</button>
                                  </div>
                                  <button type="button" className="btn btn-danger" style={{ padding: '4px', background: 'rgba(239,68,68,0.1)' }} onClick={() => updateCartQty(item.productId, 0)}>
                                    <Trash2 size={11} color="var(--danger-color)" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {cart.length > 0 && (
                          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                              <span>₹{calculateCartTotal().subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px' }}>
                              <span style={{ color: 'var(--text-muted)' }}>GST Taxes:</span>
                              <span>₹{calculateCartTotal().taxAmount.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, borderTop: '1px dashed var(--border-color)', paddingTop: '8px', marginBottom: '14px' }}>
                              <span>Invoice Total:</span>
                              <span className="gradient-text">₹{calculateCartTotal().total.toFixed(2)}</span>
                            </div>
                            <button
                              type="button"
                              className="btn btn-success"
                              style={{ width: '100%', padding: '10px', fontWeight: 600, background: 'var(--success-color)', border: 'none' }}
                              onClick={() => setShowProductCatalogModal(false)}
                            >
                              Continue to Checkout / Invoice
                            </button>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                )}
              </div>
            )}

            {/* Admin View: Inventory/Products Management */}
            {currentView === 'inventory' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <div>
                    <h1 style={{ fontSize: '28px' }}>Inventory stock control</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Dynamically configured input fields customized for your industry branch: <b>{user?.industryType}</b>.</p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => { resetProductForm(); setEditingProductId(null); }}
                  >
                    <Plus size={16} /> Reset Form
                  </button>
                </div>

                <div className="grid-3" style={{ gridTemplateColumns: '1.1fr 2fr', alignItems: 'start' }}>
                  
                  {/* Dynamic Product Form */}
                  <div className="glass-panel">
                    <h3>{editingProductId ? 'Edit Stock Item' : 'Add Stock Item'}</h3>
                    <form onSubmit={handleSaveProduct} style={{ marginTop: '20px' }}>
                      
                      <div className="form-group">
                        <label className="form-label">Item / Product Name *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Paracetamol"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        />
                      </div>

                      {/* Conditional Fields based on Industry Sector */}
                      {user?.industryType === 'medical' && (
                        <>
                          <div className="grid-2">
                            <div className="form-group">
                              <label className="form-label">HSN Code</label>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. 3004"
                                value={productForm.hsnCode}
                                onChange={(e) => setProductForm({ ...productForm, hsnCode: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Dose (Strength)</label>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. 500mg / 5ml"
                                value={productForm.dose}
                                onChange={(e) => setProductForm({ ...productForm, dose: e.target.value })}
                              />
                            </div>
                          </div>
                          
                          <div className="form-group">
                            <label className="form-label">Packaging Unit</label>
                            <select
                              className="form-select"
                              value={productForm.unit}
                              onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                            >
                              <option value="patta">Patta / Strip</option>
                              <option value="box">Box</option>
                              <option value="tablet">Tablet</option>
                              <option value="syrup">Syrup Bottle</option>
                              <option value="set">Set</option>
                            </select>
                          </div>
                        </>
                      )}

                      {user?.industryType === 'vegetable' && (
                        <div className="form-group">
                          <label className="form-label">Unit of Measure</label>
                          <select
                            className="form-select"
                            value={productForm.unit}
                            onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                          >
                            <option value="kg">Kilo (kg)</option>
                            <option value="dozen">Dozen</option>
                            <option value="gram">Gram (g)</option>
                            <option value="bora">Bora / Sack</option>
                          </select>
                        </div>
                      )}

                      {user?.industryType === 'drinks' && (
                        <div className="form-group">
                          <label className="form-label">Packaging Unit</label>
                          <select
                            className="form-select"
                            value={productForm.unit}
                            onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                          >
                            <option value="ml">Milliliter (ml)</option>
                            <option value="liter">Liter (L)</option>
                            <option value="gallon">Gallon</option>
                            <option value="pcs">Bottle / Pcs</option>
                          </select>
                        </div>
                      )}

                      {user?.industryType === 'grocery' && (
                        <div className="form-group">
                          <label className="form-label">Packaging / Weight Unit</label>
                          <select
                            className="form-select"
                            value={productForm.unit}
                            onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                          >
                            <option value="pcs">Piece (pcs)</option>
                            <option value="kg">Kilogram (kg)</option>
                            <option value="gram">Gram (g)</option>
                            <option value="liter">Liter (L)</option>
                            <option value="bora">Bora / Sack</option>
                          </select>
                        </div>
                      )}

                      {user?.industryType === 'store' && (
                        <div className="form-group">
                          <label className="form-label">Unit</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. pcs, box, packet"
                            value={productForm.unit}
                            onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                          />
                        </div>
                      )}

                      <div className="grid-2">
                        <div className="form-group">
                          <label className="form-label">Purchase Cost *</label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            className="form-input"
                            placeholder="₹"
                            value={productForm.purchasePrice}
                            onChange={(e) => setProductForm({ ...productForm, purchasePrice: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Selling Price *</label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            className="form-input"
                            placeholder="₹"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid-2">
                        <div className="form-group">
                          <label className="form-label">Min Sell Limit *</label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            className="form-input"
                            placeholder="₹"
                            value={productForm.minSellingPrice}
                            onChange={(e) => setProductForm({ ...productForm, minSellingPrice: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">GST Tax (%)</label>
                          <select
                            className="form-select"
                            value={productForm.gstRate}
                            onChange={(e) => setProductForm({ ...productForm, gstRate: e.target.value })}
                          >
                            <option value={0}>0% Tax</option>
                            <option value={5}>5% GST</option>
                            <option value={12}>12% GST</option>
                            <option value={18}>18% GST</option>
                            <option value={28}>28% GST</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid-2">
                        <div className="form-group">
                          <label className="form-label">Current Stock *</label>
                          <input
                            type="number"
                            required
                            className="form-input"
                            placeholder="Units in stock"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Category</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Tablets, Juices"
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Short Description</label>
                        <textarea
                          className="form-textarea"
                          rows="2"
                          placeholder="Inventory notes"
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        />
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                        Save Product
                      </button>
                    </form>
                  </div>

                  {/* Products Grid List */}
                  <div className="glass-panel">
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
                      <h3 style={{ marginRight: 'auto' }}>Product Inventory</h3>
                      <div style={{ position: 'relative', width: '220px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '6px 10px 6px 30px', fontSize: '13px' }}
                          placeholder="Search items..."
                          value={productSearch}
                          onChange={(e) => { setProductSearch(e.target.value); fetchProducts(e.target.value); }}
                        />
                      </div>
                    </div>

                    <div className="custom-table-container">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Product Details</th>
                            <th>Pricing (INR)</th>
                            <th>Stock</th>
                            <th>Tax</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.length === 0 ? (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No inventory records found.</td>
                            </tr>
                          ) : (
                            products.map(prod => (
                              <tr key={prod._id}>
                                <td>
                                  <div style={{ fontWeight: 600 }}>{prod.name}</div>
                                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    Category: {prod.category || 'General'} {prod.dose && `| Dose: ${prod.dose}`} {prod.hsnCode && `| HSN: ${prod.hsnCode}`}
                                  </div>
                                </td>
                                <td>
                                  <div>Sell: <b>₹{prod.price}</b></div>
                                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cost: ₹{prod.purchasePrice}</div>
                                </td>
                                <td style={{ fontWeight: 600, color: prod.stock < 5 ? 'var(--danger-color)' : 'var(--text-main)' }}>
                                  {prod.stock} {prod.unit}
                                </td>
                                <td style={{ fontSize: '13px' }}>{prod.gstRate}%</td>
                                <td>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                      className="btn btn-secondary"
                                      style={{ padding: '6px' }}
                                      onClick={() => {
                                        setEditingProductId(prod._id);
                                        setProductForm({
                                          name: prod.name,
                                          description: prod.description || '',
                                          price: prod.price,
                                          purchasePrice: prod.purchasePrice,
                                          minSellingPrice: prod.minSellingPrice,
                                          stock: prod.stock,
                                          unit: prod.unit,
                                          dose: prod.dose || '',
                                          hsnCode: prod.hsnCode || '',
                                          gstRate: prod.gstRate,
                                          category: prod.category || ''
                                        });
                                      }}
                                    >
                                      <Edit size={13} />
                                    </button>
                                    <button
                                      className="btn btn-danger"
                                      style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.1)' }}
                                      onClick={() => handleDeleteProduct(prod._id)}
                                    >
                                      <Trash2 size={13} color="var(--danger-color)" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Admin View: Customer Directory */}
            {currentView === 'customers' && (
              <div>
                <div style={{ marginBottom: '30px' }}>
                  <h1 style={{ fontSize: '28px' }}>Customer Directory</h1>
                  <p style={{ color: 'var(--text-muted)' }}>Register and update profile details of buyers.</p>
                </div>

                <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr', alignItems: 'start' }}>
                  
                  {/* Customer register panel */}
                  <div className="glass-panel">
                    <h3>{editingCustomerId ? 'Edit Profile' : 'Register Customer'}</h3>
                    <form onSubmit={handleSaveCustomer} style={{ marginTop: '20px' }}>
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. John Doe"
                          value={customerForm.name}
                          onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. 9876543210"
                          value={customerForm.phone}
                          onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="john@doe.com"
                          value={customerForm.email}
                          onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Street Address details"
                          value={customerForm.address || ''}
                          onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                        />
                      </div>
                      <div className="grid-2">
                        <div className="form-group">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="City"
                            value={customerForm.city || ''}
                            onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">State</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="State"
                            value={customerForm.state || ''}
                            onChange={(e) => setCustomerForm({ ...customerForm, state: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid-3">
                        <div className="form-group">
                          <label className="form-label">Country</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Country"
                            value={customerForm.country || 'India'}
                            onChange={(e) => setCustomerForm({ ...customerForm, country: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Pincode</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Pincode"
                            value={customerForm.pincode || ''}
                            onChange={(e) => setCustomerForm({ ...customerForm, pincode: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">GST Number (Optional)</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="GSTIN"
                            value={customerForm.gstNumber || ''}
                            onChange={(e) => setCustomerForm({ ...customerForm, gstNumber: e.target.value })}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                        {editingCustomerId && (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              setEditingCustomerId(null);
                              setCustomerForm({ name: '', phone: '', email: '', address: '', city: '', state: '', country: 'India', gstNumber: '', pincode: '' });
                            }}
                            style={{ flex: 1 }}
                          >
                            Cancel
                          </button>
                        )}
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                          Save Customer
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Customers directory table */}
                  <div className="glass-panel">
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
                      <h3 style={{ marginRight: 'auto' }}>Registered Clients</h3>
                      <div style={{ position: 'relative', width: '220px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '6px 10px 6px 30px', fontSize: '13px' }}
                          placeholder="Search customer..."
                          value={customerSearch}
                          onChange={(e) => { setCustomerSearch(e.target.value); fetchCustomers(e.target.value); }}
                        />
                      </div>
                    </div>

                    <div className="custom-table-container">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers.length === 0 ? (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No customers matching queries.</td>
                            </tr>
                          ) : (
                            customers.map(cust => (
                              <tr key={cust._id}>
                                <td style={{ fontWeight: 600 }}>{cust.name}</td>
                                <td>{cust.phone}</td>
                                <td>{cust.email || '-'}</td>
                                <td>
                                  <div>{cust.address || '-'}</div>
                                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                    {cust.city && `${cust.city}, `}{cust.state && `${cust.state} `}
                                    {cust.pincode && `- ${cust.pincode}, `}{cust.country || 'India'}
                                  </div>
                                  {cust.gstNumber && <div style={{ fontSize: '11px', color: 'var(--success-color)', fontWeight: 600, marginTop: '2px' }}>GST: {cust.gstNumber}</div>}
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                      className="btn btn-secondary"
                                      style={{ padding: '6px' }}
                                      onClick={() => {
                                        setEditingCustomerId(cust._id);
                                        setCustomerForm({
                                          name: cust.name,
                                          phone: cust.phone,
                                          email: cust.email || '',
                                          address: cust.address || '',
                                          city: cust.city || '',
                                          state: cust.state || '',
                                          country: cust.country || 'India',
                                          gstNumber: cust.gstNumber || '',
                                          pincode: cust.pincode || '',
                                        });
                                      }}
                                    >
                                      <Edit size={13} />
                                    </button>
                                    <button
                                      className="btn btn-danger"
                                      style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.1)' }}
                                      onClick={() => handleDeleteCustomer(cust._id)}
                                    >
                                      <Trash2 size={13} color="var(--danger-color)" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* Admin View: Reports Terminal */}
            {currentView === 'reports' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <div>
                    <h1 style={{ fontSize: '28px' }}>Reports Terminal</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Track past invoices, filter sales transactions by dates, and download spreadsheet sheets.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={downloadInvoicesExcel} className="btn btn-success" style={{ padding: '12px 24px' }}>
                      <Download size={16} /> Sales Report
                    </button>
                    <button onClick={downloadProductsExcel} className="btn btn-secondary" style={{ padding: '12px 24px' }}>
                      <Download size={16} /> Inventory Report
                    </button>
                  </div>
                </div>

                <div className="glass-panel" style={{ marginBottom: '30px' }}>
                  <h3>Search & Filter Criteria</h3>
                  <div className="grid-4" style={{ marginTop: '20px', alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Invoice Number</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Search invoice #"
                        value={invoiceSearch}
                        onChange={(e) => setInvoiceSearch(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => { setStartDate(''); setEndDate(''); setInvoiceSearch(''); fetchInvoices(); }}
                        style={{ flex: 1 }}
                      >
                        Reset
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={fetchInvoices}
                        style={{ flex: 1 }}
                      >
                        Filter
                      </button>
                    </div>
                  </div>
                </div>

                <div className="glass-panel">
                  <h3>Transaction Ledger</h3>
                  <div className="custom-table-container" style={{ marginTop: '20px' }}>
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Invoice #</th>
                          <th>Customer Details</th>
                          <th>Payment Status</th>
                          <th>Payment Mode</th>
                          <th>Subtotal</th>
                          <th>GST Tax</th>
                          <th>Grand Total</th>
                          <th>Created Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.length === 0 ? (
                          <tr>
                            <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No invoices matched criteria.</td>
                          </tr>
                        ) : (
                          invoices.map(inv => (
                            <tr key={inv._id}>
                              <td style={{ fontWeight: 600 }}>{inv.invoiceNumber}</td>
                              <td>
                                <div style={{ fontWeight: 600 }}>{inv.customerDetails.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>📞 {inv.customerDetails.phone}</div>
                                {inv.customerDetails.city && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{inv.customerDetails.city}</div>}
                              </td>
                              <td>
                                <span className={`badge ${inv.paymentStatus === 'paid' ? 'badge-active' : inv.paymentStatus === 'partial' ? 'badge-role' : 'badge-inactive'}`}>
                                  {inv.paymentStatus}
                                </span>
                              </td>
                              <td>
                                <span className="badge badge-role" style={{ fontSize: '10px' }}>{inv.paymentMethod}</span>
                              </td>
                              <td>₹{inv.subtotal.toFixed(2)}</td>
                              <td>₹{inv.taxAmount.toFixed(2)}</td>
                              <td style={{ fontWeight: 700 }}>₹{inv.grandTotal.toFixed(2)}</td>
                              <td style={{ fontSize: '13px' }}>{new Date(inv.createdAt).toLocaleString()}</td>
                              <td>
                                <button
                                  className="btn btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
                                  onClick={() => setPrintInvoiceData(inv)}
                                >
                                  <Eye size={13} /> View / Print
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* Profile Settings Panel */}
            {currentView === 'profile' && (
              <div>
                <div style={{ marginBottom: '30px' }}>
                  <h1 style={{ fontSize: '28px' }}>Security & Profile Settings</h1>
                  <p style={{ color: 'var(--text-muted)' }}>Update contact info and change account passwords.</p>
                </div>

                <div className="grid-2">
                  
                  {/* Profile Edit Panel */}
                  <div className="glass-panel">
                    <h3>Update Profile Info</h3>
                    <form onSubmit={handleProfileUpdate} style={{ marginTop: '20px' }}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="text"
                          className="form-input"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                        Save Info
                      </button>
                    </form>
                  </div>

                  {/* Password Change Panel */}
                  <div className="glass-panel">
                    <h3>Modify Login Password</h3>
                    <form onSubmit={handleChangePassword} style={{ marginTop: '20px' }}>
                      <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <input
                          type="password"
                          required
                          className="form-input"
                          placeholder="••••••••"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          required
                          className="form-input"
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                        Update Password
                      </button>
                    </form>
                  </div>

                </div>

              </div>
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
            <div className="no-print-bg" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
              
              <div className="print-modal-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: printTemplate === 'normal' ? '780px' : '400px' }}>
                
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
                    <div style={{ fontFamily: 'Inter, sans-serif' }}>
                      
                      {/* Header Logo & Info */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px' }}>
                        <div>
                          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px 0', color: '#0f172a' }}>{user?.name || 'Business Name'}</h1>
                          <div style={{ fontSize: '13px', color: '#64748b', textTransform: 'capitalize' }}>Category: {user?.industryType}</div>
                          {user?.phone && <div style={{ fontSize: '13px', color: '#64748b' }}>Phone: {user.phone}</div>}
                          {user?.email && <div style={{ fontSize: '13px', color: '#64748b' }}>Email: {user.email}</div>}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--primary-color)' }}>TAX INVOICE</h2>
                          <div style={{ fontSize: '13px', color: '#475569' }}>Invoice #: <span style={{ fontWeight: 600 }}>{printInvoiceData.invoiceNumber}</span></div>
                          <div style={{ fontSize: '13px', color: '#475569' }}>Date: {new Date(printInvoiceData.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>

                      {/* Billing & Shipping Details */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontWeight: 700, fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Billed To:</div>
                          <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{printInvoiceData.customerDetails.name}</div>
                          <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>📞 {printInvoiceData.customerDetails.phone}</div>
                          {printInvoiceData.customerDetails.email && <div style={{ fontSize: '13px', color: '#475569' }}>✉ {printInvoiceData.customerDetails.email}</div>}
                          {printInvoiceData.customerDetails.address && (
                            <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                              {[printInvoiceData.customerDetails.address, printInvoiceData.customerDetails.city, printInvoiceData.customerDetails.state].filter(Boolean).join(', ')}{printInvoiceData.customerDetails.pincode ? ' - ' + printInvoiceData.customerDetails.pincode : ''}
                            </div>
                          )}
                          {printInvoiceData.customerDetails.gstNumber && <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600, marginTop: '6px' }}>GSTIN: {printInvoiceData.customerDetails.gstNumber}</div>}
                          {printInvoiceData.paymentStatus && <div style={{ marginTop: '6px', display: 'inline-block', padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, background: printInvoiceData.paymentStatus === 'paid' ? '#dcfce7' : printInvoiceData.paymentStatus === 'partial' ? '#fef9c3' : '#fee2e2', color: printInvoiceData.paymentStatus === 'paid' ? '#15803d' : printInvoiceData.paymentStatus === 'partial' ? '#854d0e' : '#b91c1c' }}>{printInvoiceData.paymentStatus.toUpperCase()}</div>}
                        </div>

                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontWeight: 700, fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Shipped To:</div>
                          {printInvoiceData.shippingDetails ? (
                            <>
                              <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{printInvoiceData.shippingDetails.name}</div>
                              <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>📞 {printInvoiceData.shippingDetails.phone}</div>
                              {printInvoiceData.shippingDetails.address && (
                                <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                                  {[printInvoiceData.shippingDetails.address, printInvoiceData.shippingDetails.city, printInvoiceData.shippingDetails.state].filter(Boolean).join(', ')}{printInvoiceData.shippingDetails.pincode ? ' - ' + printInvoiceData.shippingDetails.pincode : ''}
                                </div>
                              )}
                            </>
                          ) : (
                            <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', marginTop: '10px' }}>Same as Billing Details</div>
                          )}
                        </div>
                      </div>

                      {/* Items Table */}
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                        <thead>
                          <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                            <th style={{ textAlign: 'left', padding: '10px', fontSize: '12px', color: '#475569', fontWeight: 700 }}>Item Description</th>
                            <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px', color: '#475569', fontWeight: 700 }}>Rate</th>
                            <th style={{ textAlign: 'center', padding: '10px', fontSize: '12px', color: '#475569', fontWeight: 700 }}>Qty</th>
                            <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px', color: '#475569', fontWeight: 700 }}>GST %</th>
                            <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px', color: '#475569', fontWeight: 700 }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {printInvoiceData.items.map(item => (
                            <tr key={item._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <td style={{ padding: '12px 10px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                                {item.name}
                                {item.dose && <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>Dose: {item.dose}</div>}
                              </td>
                              <td style={{ textAlign: 'right', padding: '12px 10px', fontSize: '13px', color: '#334155' }}>₹{item.price.toFixed(2)}</td>
                              <td style={{ textAlign: 'center', padding: '12px 10px', fontSize: '13px', color: '#334155' }}>{item.quantity}</td>
                              <td style={{ textAlign: 'right', padding: '12px 10px', fontSize: '13px', color: '#334155' }}>{item.gstRate}%</td>
                              <td style={{ textAlign: 'right', padding: '12px 10px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>₹{item.total.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Totals Section */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          <div style={{ fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Terms & Info:</div>
                          <div>1. Payment Method: <span style={{ textTransform: 'uppercase', fontWeight: 600, color: '#000' }}>{printInvoiceData.paymentMethod}</span></div>
                          <div>2. Payment Status: <span style={{ textTransform: 'uppercase', fontWeight: 600, color: '#000' }}>{printInvoiceData.paymentStatus}</span></div>
                          <div style={{ marginTop: '10px' }}>Thank you for doing business with us!</div>
                        </div>
                        
                        <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                            <span>Subtotal:</span>
                            <span>₹{printInvoiceData.subtotal.toFixed(2)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                            <span>GST Tax Amount:</span>
                            <span>₹{printInvoiceData.taxAmount.toFixed(2)}</span>
                          </div>
                          {printInvoiceData.discount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'red', fontWeight: 600 }}>
                              <span>Discount:</span>
                              <span>-₹{printInvoiceData.discount.toFixed(2)}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #000', paddingTop: '8px', fontWeight: 800, fontSize: '17px', color: 'var(--primary-color)' }}>
                            <span>Grand Total:</span>
                            <span>₹{printInvoiceData.grandTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Signature space */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '60px' }}>
                        <div style={{ textAlign: 'center', width: '200px', borderTop: '1px solid #94a3b8', paddingTop: '6px', fontSize: '12px', color: '#475569' }}>
                          Authorized Signature
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ----------------- THERMAL 80MM TEMPLATE ----------------- */
                    <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: '13px', color: '#000', lineHeight: '1.4' }}>
                      <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0' }}>{user?.name}</h2>
                        <div style={{ textTransform: 'capitalize' }}>Sector: {user?.industryType}</div>
                        {user?.phone && <div>Tel: {user.phone}</div>}
                        <div>================================</div>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '6px 0' }}>INVOICE RECEIPT</h3>
                        <div>================================</div>
                      </div>

                      <div style={{ marginBottom: '12px', fontSize: '12px' }}>
                        <div>INV #: {printInvoiceData.invoiceNumber}</div>
                        <div>Date: {new Date(printInvoiceData.createdAt).toLocaleString()}</div>
                        <div>Pay Method: {printInvoiceData.paymentMethod.toUpperCase()}</div>
                        <div>Pay Status: {printInvoiceData.paymentStatus.toUpperCase()}</div>
                      </div>

                      <div style={{ marginBottom: '12px', fontSize: '12px' }}>
                        <div style={{ fontWeight: 'bold' }}>CUSTOMER INFO:</div>
                        <div style={{ fontWeight: 700 }}>{printInvoiceData.customerDetails.name}</div>
                        <div>Ph: {printInvoiceData.customerDetails.phone}</div>
                        {printInvoiceData.customerDetails.email && <div>Em: {printInvoiceData.customerDetails.email}</div>}
                        {printInvoiceData.customerDetails.address && (
                          <div>{[printInvoiceData.customerDetails.address, printInvoiceData.customerDetails.city, printInvoiceData.customerDetails.state].filter(Boolean).join(', ')}{printInvoiceData.customerDetails.pincode ? '-' + printInvoiceData.customerDetails.pincode : ''}</div>
                        )}
                        {printInvoiceData.customerDetails.gstNumber && <div>GSTIN: {printInvoiceData.customerDetails.gstNumber}</div>}
                        <div>Status: {printInvoiceData.paymentStatus?.toUpperCase()}</div>
                        
                        {printInvoiceData.shippingDetails && (
                          <div style={{ marginTop: '6px' }}>
                            <div style={{ fontWeight: 'bold' }}>SHIPPING TO:</div>
                            <div>{printInvoiceData.shippingDetails.name}</div>
                            <div>Ph: {printInvoiceData.shippingDetails.phone}</div>
                            {printInvoiceData.shippingDetails.address && (
                              <div>{[printInvoiceData.shippingDetails.address, printInvoiceData.shippingDetails.city, printInvoiceData.shippingDetails.state].filter(Boolean).join(', ')}{printInvoiceData.shippingDetails.pincode ? '-' + printInvoiceData.shippingDetails.pincode : ''}</div>
                            )}
                          </div>
                        )}
                      </div>

                      <div>--------------------------------</div>
                      {/* Table Headers */}
                      <div style={{ display: 'flex', fontWeight: 'bold', fontSize: '12px' }}>
                        <div style={{ flex: 2 }}>Item</div>
                        <div style={{ flex: 1, textAlign: 'center' }}>Qty</div>
                        <div style={{ flex: 1, textAlign: 'right' }}>Total</div>
                      </div>
                      <div>--------------------------------</div>

                      {/* Table Body */}
                      {printInvoiceData.items.map(item => (
                        <div key={item._id} style={{ display: 'flex', padding: '4px 0', fontSize: '12px' }}>
                          <div style={{ flex: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                          <div style={{ flex: 1, textAlign: 'center' }}>{item.quantity}</div>
                          <div style={{ flex: 1, textAlign: 'right' }}>₹{item.total.toFixed(2)}</div>
                        </div>
                      ))}
                      <div>--------------------------------</div>

                      {/* Summary */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', width: '180px', marginLeft: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Subtotal:</span>
                          <span>₹{printInvoiceData.subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>GST Tax:</span>
                          <span>₹{printInvoiceData.taxAmount.toFixed(2)}</span>
                        </div>
                        {printInvoiceData.discount > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'red' }}>
                            <span>Discount:</span>
                            <span>-₹{printInvoiceData.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px dashed #000', paddingTop: '4px', fontSize: '14px' }}>
                          <span>TOTAL:</span>
                          <span>₹{printInvoiceData.grandTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px' }}>
                        <div>*** THANK YOU ***</div>
                        <div>Please Visit Again</div>
                      </div>
                    </div>
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
