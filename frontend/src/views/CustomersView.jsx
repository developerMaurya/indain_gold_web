import React from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';

export default function CustomersView({
  editingCustomerId,
  setEditingCustomerId,
  customerForm,
  setCustomerForm,
  handleSaveCustomer,
  customerSearch,
  setCustomerSearch,
  fetchCustomers,
  customers,
  handleDeleteCustomer
}) {
  return (
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
  );
}
