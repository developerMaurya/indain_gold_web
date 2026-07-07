import React from 'react';

export default function InvoiceA4Template({ printInvoiceData, user, companyInfo }) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header Logo & Company Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, margin: '0 0 2px 0', color: '#0f172a', letterSpacing: '-0.02em' }}>{user?.name || 'Business Name'}</h1>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '8px' }}>Category: {user?.industryType}</div>
          <div style={{ fontSize: '12px', color: '#475569' }}>Company Mobile: {user?.phone || 'N/A'}</div>
          {user?.email && <div style={{ fontSize: '12px', color: '#475569' }}>Company Email: {user.email}</div>}
          {companyInfo.address && <div style={{ fontSize: '12px', color: '#475569' }}>Company Address: {companyInfo.address}</div>}
          {(companyInfo.state || companyInfo.country) && (
            <div style={{ fontSize: '12px', color: '#475569' }}>
              State: {companyInfo.state || 'N/A'}, Country: {companyInfo.country || 'India'}
            </div>
          )}
          {companyInfo.pincode && <div style={{ fontSize: '12px', color: '#475569' }}>Company Pincode: {companyInfo.pincode}</div>}
          {companyInfo.gst && <div style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>Company GST: {companyInfo.gst}</div>}
          {companyInfo.website && <div style={{ fontSize: '12px', color: '#475569' }}>Company Website: {companyInfo.website}</div>}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--primary-color)' }}>TAX INVOICE</h2>
          <div style={{ fontSize: '13px', color: '#475569' }}>Invoice #: <span style={{ fontWeight: 600 }}>{printInvoiceData.invoiceNumber}</span></div>
          <div style={{ fontSize: '13px', color: '#475569' }}>Date & Time: {new Date(printInvoiceData.createdAt).toLocaleString()}</div>
        </div>
      </div>

      {/* Billing & Shipping Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Billed To:</div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{printInvoiceData.customerDetails.name}</div>
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Customer Mobile: {printInvoiceData.customerDetails.phone}</div>
          {printInvoiceData.customerDetails.email && <div style={{ fontSize: '12px', color: '#475569' }}>Customer Email: {printInvoiceData.customerDetails.email}</div>}
          {printInvoiceData.customerDetails.address && <div style={{ fontSize: '12px', color: '#475569' }}>Customer Address: {printInvoiceData.customerDetails.address}{printInvoiceData.customerDetails.city ? ', ' + printInvoiceData.customerDetails.city : ''}</div>}
          {(printInvoiceData.customerDetails.state || printInvoiceData.customerDetails.country) && (
            <div style={{ fontSize: '12px', color: '#475569' }}>
              State: {printInvoiceData.customerDetails.state || 'N/A'}, Country: {printInvoiceData.customerDetails.country || 'India'}
            </div>
          )}
          {printInvoiceData.customerDetails.pincode && <div style={{ fontSize: '12px', color: '#475569' }}>Customer Pincode: {printInvoiceData.customerDetails.pincode}</div>}
          {printInvoiceData.customerDetails.gstNumber && <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 600, marginTop: '4px' }}>Customer GST: {printInvoiceData.customerDetails.gstNumber}</div>}
        </div>

        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Shipped To:</div>
          {(() => {
            const ship = printInvoiceData.shippingDetails || printInvoiceData.customerDetails;
            return (
              <>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{ship.name}</div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Customer Mobile: {ship.phone}</div>
                {ship.address && <div style={{ fontSize: '12px', color: '#475569' }}>Customer Address: {ship.address}{ship.city ? ', ' + ship.city : ''}</div>}
                {(ship.state || ship.country) && (
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    State: {ship.state || 'N/A'}, Country: {ship.country || 'India'}
                  </div>
                )}
                {ship.pincode && <div style={{ fontSize: '12px', color: '#475569' }}>Customer Pincode: {ship.pincode}</div>}
                {(ship.gstNumber || ship.gst || printInvoiceData.customerDetails.gstNumber || printInvoiceData.customerDetails.gst) && (
                  <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 600, marginTop: '4px' }}>
                    Customer GST: {ship.gstNumber || ship.gst || printInvoiceData.customerDetails.gstNumber || printInvoiceData.customerDetails.gst}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
            <th style={{ textAlign: 'left', padding: '10px', fontSize: '12px', color: '#475569', fontWeight: 700 }}>Item Description</th>
            <th style={{ textAlign: 'left', padding: '10px', fontSize: '12px', color: '#475569', fontWeight: 700 }}>HSN</th>
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
              <td style={{ padding: '12px 10px', fontSize: '13px', color: '#334155' }}>
                {item.hsnCode || 'N/A'}
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
  );
}
