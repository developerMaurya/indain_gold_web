import React from 'react';
import { RefreshCw, Eye } from 'lucide-react';
import AreaTrendChart from '../components/charts/AreaTrendChart';
import RadialProgressGauge from '../components/charts/RadialProgressGauge';
import CategoryBarChart from '../components/charts/CategoryBarChart';

export default function DashboardView({
  analytics,
  stats,
  fetchDashboardStats,
  fetchInvoices,
  fetchProducts,
  setPrintInvoiceData
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px' }}>Overview Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time summaries of transactions, sales analysis, and stock levels.</p>
        </div>
        <button onClick={async () => { await fetchDashboardStats(); await fetchInvoices(); await fetchProducts(); }} className="btn btn-secondary" style={{ padding: '10px' }}>
          <RefreshCw size={16} /> Reload Metrics
        </button>
      </div>

      {/* Dashboard Stats Row */}
      <div className="grid-4" style={{ marginBottom: '30px' }}>
        <div className="glass-panel" style={{ borderLeft: '4px solid var(--success-color)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Today's Sales</div>
          <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: 'var(--success-color)' }}>
            ₹{analytics.todaySales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Net Profit: <span style={{ color: 'hsl(145, 80%, 50%)', fontWeight: 700 }}>₹{analytics.todayProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="glass-panel" style={{ borderLeft: '4px solid hsl(200, 85%, 55%)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>This Month's Sales</div>
          <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: 'hsl(200, 85%, 55%)' }}>
            ₹{analytics.monthlySales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Net Profit: <span style={{ color: 'hsl(145, 80%, 50%)', fontWeight: 700 }}>₹{analytics.monthlyProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="glass-panel" style={{ borderLeft: '4px solid hsl(265, 80%, 65%)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Remaining Inventory</div>
          <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: 'hsl(265, 80%, 65%)' }}>
            {analytics.totalRemainingStock} Items
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Valued: <span style={{ fontWeight: 700 }}>₹{analytics.totalStockValueRetail.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="glass-panel" style={{ borderLeft: stats?.summary?.lowStockCount > 0 ? '4px solid var(--danger-color)' : '4px solid var(--border-color)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Critical Stock Warnings</div>
          <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: stats?.summary?.lowStockCount > 0 ? 'var(--danger-color)' : 'var(--text-main)' }}>
            {stats?.summary?.lowStockCount || 0} Low Items
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Needs urgent reorder
          </div>
        </div>
      </div>

      {/* Dashboard Secondary Stats Row */}
      <div className="grid-3" style={{ marginBottom: '30px' }}>
        <div className="glass-panel" style={{ borderLeft: '4px solid hsl(320, 80%, 60%)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Registered Customers</div>
          <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: 'hsl(320, 80%, 60%)' }}>
            {analytics.totalRegisteredCustomers} Clients
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Active buyer directory profiles
          </div>
        </div>
        <div className="glass-panel" style={{ borderLeft: '4px solid hsl(45, 90%, 50%)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Today's Bills Paid</div>
          <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: 'hsl(45, 90%, 50%)' }}>
            {analytics.todayInvoicesCount} Invoices
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Transactions completed today
          </div>
        </div>
        <div className="glass-panel" style={{ borderLeft: '4px solid hsl(175, 80%, 45%)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Today's Items Sold</div>
          <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: 'hsl(175, 80%, 45%)' }}>
            {analytics.todayItemsSoldCount} Units
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Stock Purchase Cost: ₹{analytics.todayPurchaseCost.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* SVG Charts Row */}
      <div className="grid-3" style={{ gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '30px', alignItems: 'start' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0 }}>Sales & Profit Weekly Trend</h3>
            <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: 700 }}>
              <span style={{ color: 'hsl(200, 85%, 55%)' }}>● Sales</span>
              <span style={{ color: 'hsl(145, 80%, 50%)' }}>● Profit</span>
            </div>
          </div>
          <AreaTrendChart data={analytics.dailyTrend} />
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RadialProgressGauge
            value={analytics.monthlySales}
            total={100000}
            label="Monthly Sales Target"
            colorGrad="hsl(200, 85%, 55%)"
          />
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '30px' }}>
        {/* Left Column: Category Bar Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '14px' }}>Inventory Stock per Category</h3>
          <CategoryBarChart data={analytics.categorySummary} />
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

      {/* Recent Sales Table */}
      <div className="glass-panel" style={{ marginBottom: '30px' }}>
        <h3>Recent Transactions Ledger</h3>
        <div className="custom-table-container" style={{ marginTop: '20px' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Bill #</th>
                <th>Customer</th>
                <th>Total Amount</th>
                <th>Payment</th>
                <th>Date & Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentInvoices.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No invoices generated yet.</td>
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
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(inv.createdAt).toLocaleString()}
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
    </div>
  );
}
