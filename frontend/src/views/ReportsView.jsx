import React from 'react';
import { Download, Search, Eye } from 'lucide-react';

export default function ReportsView({
  downloadInvoicesExcel,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  invoiceSearch,
  setInvoiceSearch,
  fetchInvoices,
  invoices,
  setPrintInvoiceData
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px' }}>Reports Terminal</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track past invoices, filter sales transactions by dates, and download spreadsheet sheets.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={downloadInvoicesExcel} className="btn btn-success" style={{ padding: '12px 24px' }}>
            <Download size={16} /> Download Sales Spreadsheet
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ marginBottom: '30px', padding: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Filter Ledger Registers</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
            <label className="form-label">Search Client Name or Bill Number</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ padding: '6px 10px 6px 30px', fontSize: '13px' }}
                placeholder="e.g. John, INV-38472"
                value={invoiceSearch}
                onChange={(e) => { setInvoiceSearch(e.target.value); fetchInvoices(); }}
              />
            </div>
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: '150px', marginBottom: 0 }}>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: '150px', marginBottom: 0 }}>
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '200px' }}>
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
  );
}
