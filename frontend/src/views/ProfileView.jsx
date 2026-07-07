import React from 'react';

export default function ProfileView({
  handleProfileUpdate,
  profileName,
  setProfileName,
  profilePhone,
  setProfilePhone,
  handleChangePassword,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  companyForm,
  setCompanyForm,
  setCompanyInfo,
  showFlash
}) {
  return (
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

        {/* Company Profile Details */}
        <div className="glass-panel" style={{ gridColumn: 'span 2', marginTop: '20px' }}>
          <h3>Company / Business Profile Details</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>Specify company details that will print on your Tax Invoices.</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            localStorage.setItem('companyInfo', JSON.stringify(companyForm));
            setCompanyInfo(companyForm);
            showFlash('success', 'Company details saved successfully!');
          }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group" style={{ marginBottom: '5px' }}>
              <label className="form-label">Company / Business Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. McZen Indian Gold"
                value={companyForm.name || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
              />
            </div>
            <div className="grid-3">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Company GSTIN</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 27AAAAA1111A1Z1"
                  value={companyForm.gst || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, gst: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 400001"
                  value={companyForm.pincode || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, pincode: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Website</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. www.indiangold.com"
                  value={companyForm.website || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                />
              </div>
            </div>
            <div className="grid-3">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Hathibazar, Varanasi"
                  value={companyForm.address || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Uttar Pradesh"
                  value={companyForm.state || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, state: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. India"
                  value={companyForm.country || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, country: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success" style={{ alignSelf: 'flex-start', padding: '10px 20px' }}>
              Save Company Details
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
