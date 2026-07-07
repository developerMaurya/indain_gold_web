import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function AnalyticsView({
  fetchInvoices,
  fetchProducts,
  analyticsTab,
  setAnalyticsTab,
  analytics,
  products
}) {
  return (
    <div>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px' }}>Analytics & Reports Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>Accounting audits, inventory balance sheets, and customer ledger statistics.</p>
        </div>
        <button onClick={async () => { await fetchInvoices(); await fetchProducts(); }} className="btn btn-secondary" style={{ padding: '10px' }}>
          <RefreshCw size={16} /> Refresh Reports
        </button>
      </div>

      {/* Tab Selector Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          className={`btn ${analyticsTab === 'pl' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
          onClick={() => setAnalyticsTab('pl')}
        >
          📈 Profit & Loss (P&L)
        </button>
        <button
          className={`btn ${analyticsTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
          onClick={() => setAnalyticsTab('inventory')}
        >
          📦 Stock balance sheet
        </button>
        <button
          className={`btn ${analyticsTab === 'customer' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
          onClick={() => setAnalyticsTab('customer')}
        >
          👥 Customer billing report
        </button>
      </div>

      {/* TAB 1: P&L Statement */}
      {analyticsTab === 'pl' && (
        <div>
          <div className="grid-3" style={{ marginBottom: '24px' }}>
            <div className="glass-panel" style={{ borderLeft: '4px solid var(--success-color)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Revenue</div>
              <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: 'var(--success-color)' }}>
                ₹{analytics.monthlySales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Gross compiled turnover (this month)</div>
            </div>
            <div className="glass-panel" style={{ borderLeft: '4px solid var(--danger-color)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Cost of Goods Sold (COGS)</div>
              <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: 'var(--danger-color)' }}>
                ₹{(analytics.monthlySales - analytics.monthlyProfit).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Purchase price of items sold</div>
            </div>
            <div className="glass-panel" style={{ borderLeft: '4px solid hsl(200, 85%, 55%)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Net Monthly Profit</div>
              <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: 'hsl(200, 85%, 55%)' }}>
                ₹{analytics.monthlyProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Deductions & discounts accounted</div>
            </div>
          </div>

          <div className="glass-panel">
            <h3>Detailed P&L Statement</h3>
            <div style={{ marginTop: '20px' }}>
              <table className="custom-table">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.015)' }}>
                    <th style={{ textAlign: 'left' }}>Accounting Ledger Entity</th>
                    <th style={{ textAlign: 'right' }}>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>Gross Sales / Turnover (Monthly)</b></td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--success-color)' }}>
                      ₹{analytics.monthlySales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td>Cost of Goods Sold (Purchase Value)</td>
                    <td style={{ textAlign: 'right', color: 'var(--danger-color)' }}>
                      - ₹{(analytics.monthlySales - analytics.monthlyProfit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr style={{ borderTop: '2px solid var(--border-color)', fontWeight: 700 }}>
                    <td><b>Estimated Net Profit margin</b></td>
                    <td style={{ textAlign: 'right', color: 'hsl(200, 85%, 55%)' }}>
                      ₹{analytics.monthlyProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Stock Balance Sheet */}
      {analyticsTab === 'inventory' && (
        <div>
          <div className="grid-4" style={{ marginBottom: '24px' }}>
            <div className="glass-panel">
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Unique Items</div>
              <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px' }}>{products.length} Products</div>
            </div>
            <div className="glass-panel">
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Remaining Units</div>
              <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: 'hsl(265, 80%, 65%)' }}>{analytics.totalRemainingStock} pcs</div>
            </div>
            <div className="glass-panel">
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Inventory Cost Value</div>
              <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: 'var(--danger-color)' }}>
                ₹{analytics.totalStockValueCost.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="glass-panel">
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Projected Selling Value</div>
              <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: 'var(--success-color)' }}>
                ₹{analytics.totalStockValueRetail.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ marginBottom: '24px' }}>
            <h3>Inventory Stock Category Valuation</h3>
            <div className="custom-table-container" style={{ marginTop: '20px' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Products count</th>
                    <th>Total units in stock</th>
                    <th>Estimated Value (Selling Price)</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.categorySummary.map(row => (
                    <tr key={row.category}>
                      <td style={{ fontWeight: 600 }}>{row.category}</td>
                      <td>{row.count} products</td>
                      <td>{row.stock} units</td>
                      <td style={{ fontWeight: 700, color: 'var(--success-color)' }}>₹{row.value.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Customer Spent Ledger */}
      {analyticsTab === 'customer' && (
        <div className="glass-panel">
          <h3>Customer Billing Spent Ranking</h3>
          <div className="custom-table-container" style={{ marginTop: '20px' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Client Details</th>
                  <th>Mobile Number</th>
                  <th>Total Orders count</th>
                  <th>Total Billed spent</th>
                  <th>Last transaction date</th>
                </tr>
              </thead>
              <tbody>
                {analytics.customerLedger.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No customer invoices generated yet.</td>
                  </tr>
                ) : (
                  analytics.customerLedger.map((row, idx) => (
                    <tr key={row.phone}>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {idx === 0 && '👑 '} {row.name}
                        </div>
                      </td>
                      <td>{row.phone}</td>
                      <td>{row.ordersCount} invoices</td>
                      <td style={{ fontWeight: 700, color: 'var(--success-color)' }}>₹{row.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td style={{ fontSize: '13px' }}>{new Date(row.lastOrderDate).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
