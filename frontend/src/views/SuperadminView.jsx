import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function SuperadminView({
  admins,
  adminForm,
  setAdminForm,
  editingAdminId,
  setEditingAdminId,
  handleSaveAdmin,
  handleToggleAdmin,
  handleDeleteAdmin
}) {
  return (
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
  );
}
