const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all purchase orders
const getAllPurchaseOrders = async () => {
  try {
    const result = await db.query(
      `SELECT po.*, v.company_name as vendor_name, d.name as department_name
       FROM purchase_orders po
       JOIN vendors v ON po.vendor_id = v.id
       JOIN departments d ON po.department_id = d.id
       ORDER BY po.order_date DESC`
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get purchase orders by vendor ID
const getPurchaseOrdersByVendorId = async (vendorId) => {
  try {
    const result = await db.query(
      `SELECT po.*, d.name as department_name
       FROM purchase_orders po
       JOIN departments d ON po.department_id = d.id
       WHERE po.vendor_id = $1
       ORDER BY po.order_date DESC`,
      [vendorId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get purchase orders by department ID
const getPurchaseOrdersByDepartmentId = async (departmentId) => {
  try {
    const result = await db.query(
      `SELECT po.*, v.company_name as vendor_name
       FROM purchase_orders po
       JOIN vendors v ON po.vendor_id = v.id
       WHERE po.department_id = $1
       ORDER BY po.order_date DESC`,
      [departmentId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get purchase order by ID
const getPurchaseOrderById = async (id) => {
  try {
    const result = await db.query(
      `SELECT po.*, v.company_name as vendor_name, d.name as department_name
       FROM purchase_orders po
       JOIN vendors v ON po.vendor_id = v.id
       JOIN departments d ON po.department_id = d.id
       WHERE po.id = $1`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get purchase order items by purchase order ID
const getPurchaseOrderItems = async (purchaseOrderId) => {
  try {
    const result = await db.query(
      `SELECT * FROM purchase_order_items
       WHERE purchase_order_id = $1
       ORDER BY id`,
      [purchaseOrderId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Create new purchase order
const createPurchaseOrder = async (purchaseOrderData, items) => {
  const {
    po_number,
    vendor_id,
    department_id,
    order_date,
    delivery_date,
    total_amount,
    tax_amount,
    shipping_amount,
    grand_total,
    status,
    approved_by,
    approved_at,
    notes
  } = purchaseOrderData;

  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Insert purchase order
    const poResult = await client.query(
      `INSERT INTO purchase_orders (
        id, po_number, vendor_id, department_id, order_date, delivery_date,
        total_amount, tax_amount, shipping_amount, grand_total,
        status, approved_by, approved_at, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
      RETURNING *`,
      [
        uuidv4(), po_number, vendor_id, department_id, order_date || new Date(), delivery_date,
        total_amount, tax_amount || 0, shipping_amount || 0, grand_total,
        status || 'pending', approved_by, approved_at, notes
      ]
    );
    
    const purchaseOrderId = poResult.rows[0].id;
    
    // Insert purchase order items
    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO purchase_order_items (
            id, purchase_order_id, item_description, quantity, unit_price, total_price
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            uuidv4(), purchaseOrderId, item.item_description, 
            item.quantity, item.unit_price, item.total_price
          ]
        );
      }
    }
    
    await client.query('COMMIT');
    
    return {
      ...poResult.rows[0],
      items: items || []
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Update purchase order
const updatePurchaseOrder = async (id, purchaseOrderData) => {
  const {
    delivery_date,
    total_amount,
    tax_amount,
    shipping_amount,
    grand_total,
    status,
    approved_by,
    approved_at,
    notes
  } = purchaseOrderData;

  try {
    const result = await db.query(
      `UPDATE purchase_orders SET
        delivery_date = $1,
        total_amount = $2,
        tax_amount = $3,
        shipping_amount = $4,
        grand_total = $5,
        status = $6,
        approved_by = $7,
        approved_at = $8,
        notes = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *`,
      [
        delivery_date, total_amount, tax_amount, shipping_amount,
        grand_total, status, approved_by, approved_at, notes, id
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Update purchase order status
const updatePurchaseOrderStatus = async (id, status, approverData) => {
  const { approved_by, notes } = approverData || {};
  
  try {
    const result = await db.query(
      `UPDATE purchase_orders SET
        status = $1,
        approved_by = $2,
        approved_at = CURRENT_TIMESTAMP,
        notes = CASE WHEN $3 IS NOT NULL THEN $3 ELSE notes END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *`,
      [status, approved_by, notes, id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Delete purchase order
const deletePurchaseOrder = async (id) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Delete purchase order items first
    await client.query(
      'DELETE FROM purchase_order_items WHERE purchase_order_id = $1',
      [id]
    );
    
    // Delete purchase order
    await client.query(
      'DELETE FROM purchase_orders WHERE id = $1',
      [id]
    );
    
    await client.query('COMMIT');
    
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getAllPurchaseOrders,
  getPurchaseOrdersByVendorId,
  getPurchaseOrdersByDepartmentId,
  getPurchaseOrderById,
  getPurchaseOrderItems,
  createPurchaseOrder,
  updatePurchaseOrder,
  updatePurchaseOrderStatus,
  deletePurchaseOrder
};
