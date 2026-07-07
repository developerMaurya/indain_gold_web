import React from 'react';
import { Plus, Trash2, Eye, Printer, ShoppingBag, Search } from 'lucide-react';

export default function BillingView({
  showProductCatalogModal,
  setShowProductCatalogModal,
  posSelectedCustomer,
  setPosSelectedCustomer,
  showQuickAddCustomer,
  setShowQuickAddCustomer,
  customers,
  billCustomer,
  setBillCustomer,
  customerForm,
  setCustomerForm,
  handleQuickAddCustomer,
  cart,
  setCart,
  distinctShipping,
  setDistinctShipping,
  shippingDetails,
  setShippingDetails,
  updateCartQty,
  calculateCartTotal,
  billDiscount,
  setBillDiscount,
  paymentMethod,
  setPaymentMethod,
  paymentStatus,
  setPaymentStatus,
  handlePreviewCheckout,
  handleCheckout,
  posProductSearch,
  setPosProductSearch,
  posCategoryFilter,
  setPosCategoryFilter,
  posPriceSort,
  setPosPriceSort,
  posMinPrice,
  setPosMinPrice,
  posMaxPrice,
  setPosMaxPrice,
  products,
  setPosSelectedProduct,
  setPosProductQty
}) {
  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px' }}>Checkout Billing Terminal</h1>
        <p style={{ color: 'var(--text-muted)' }}>Quick sales calculator with automatic inventory deduction and receipt preview.</p>
      </div>

      {!showProductCatalogModal ? (
        <div className="grid-2" style={{ alignItems: 'start' }}>
        
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
                  <div className="grid-4">
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
                    <div className="form-group">
                      <label className="form-label">GSTIN (Optional)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={shippingDetails.gstNumber || ''}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, gstNumber: e.target.value })}
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
            <div className="grid-3" style={{ gap: '16px' }}>
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
            <div className="grid-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '14px', alignItems: 'center' }}>
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
          <div className="responsive-flex" style={{ gap: '24px', flex: 1, overflow: 'hidden' }}>
            
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
  );
}
