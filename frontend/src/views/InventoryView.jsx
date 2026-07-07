import React from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function InventoryView({
  user,
  resetProductForm,
  editingProductId,
  setEditingProductId,
  productForm,
  setProductForm,
  handleSaveProduct,
  productSearch,
  setProductSearch,
  fetchProducts,
  products,
  handleDeleteProduct
}) {
  return (
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

      <div className="grid-2" style={{ alignItems: 'start' }}>
        
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
                    <option value="patta">💊 Patta / Strip</option>
                    <option value="tablet">🔵 Single Tablet (Tablet)</option>
                    <option value="bottle">🍾 Bottle (Liquid / Syrup)</option>
                    <option value="dabba">📦 Dabba / Box (Carton)</option>
                    <option value="syrup">🧴 Syrup Bottle</option>
                    <option value="box">🗃️ Box</option>
                    <option value="vial">💉 Vial / Injection</option>
                    <option value="sachet">🫙 Sachet / Powder</option>
                    <option value="set">🎁 Set</option>
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
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Added: {prod.createdAt ? new Date(prod.createdAt).toLocaleString() : 'N/A'}
                          {prod.updatedAt && Math.abs(new Date(prod.updatedAt) - new Date(prod.createdAt)) > 1000 && (
                            <span style={{ marginLeft: '8px', color: 'hsl(200, 85%, 55%)', fontWeight: 600 }}>
                              (Updated: {new Date(prod.updatedAt).toLocaleString()})
                            </span>
                          )}
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
  );
}
