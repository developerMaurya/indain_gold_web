import React from 'react';

export default function InvoiceThermalTemplate({ printInvoiceData, user }) {
  return (
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
            {printInvoiceData.shippingDetails.gstNumber && <div>GSTIN: {printInvoiceData.shippingDetails.gstNumber}</div>}
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
  );
}
