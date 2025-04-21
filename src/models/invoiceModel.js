const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all invoices
const getAllInvoices = async () => {
  try {
    const result = await db.query(
      `SELECT i.*, v.company_name as vendor_name, po.po_number
       FROM invoices i
       JOIN vendors v ON i.vendor_id = v.id
       LEFT JOIN purchase_orders po ON i.purchase_order_id = po.id
       ORDER BY i.invoice_date DESC`
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get invoices by vendor ID
const getInvoicesByVendorId = async (vendorId) => {
  try {
    const result = await db.query(
      `SELECT i.*, po.po_number
       FROM invoices i
       LEFT JOIN purchase_orders po ON i.purchase_order_id = po.id
       WHERE i.vendor_id = $1
       ORDER BY i.invoice_date DESC`,
      [vendorId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get invoices by purchase order ID
const getInvoicesByPurchaseOrderId = async (purchaseOrderId) => {
  try {
    const result = await db.query(
      `SELECT i.*, v.company_name as vendor_name
       FROM invoices i
       JOIN vendors v ON i.vendor_id = v.id
       WHERE i.purchase_order_id = $1
       ORDER BY i.invoice_date DESC`,
      [purchaseOrderId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get invoice by ID
const getInvoiceById = async (id) => {
  try {
    const result = await db.query(
      `SELECT i.*, v.company_name as vendor_name, po.po_number
       FROM invoices i
       JOIN vendors v ON i.vendor_id = v.id
       LEFT JOIN purchase_orders po ON i.purchase_order_id = po.id
       WHERE i.id = $1`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Create new invoice
const createInvoice = async (invoiceData) => {
  const {
    invoice_number,
    vendor_id,
    purchase_order_id,
    invoice_date,
    due_date,
    total_amount,
    tax_amount,
    shipping_amount,
    grand_total,
    status,
    approved_by,
    approved_at,
    notes
  } = invoiceData;

  try {
    const result = await db.query(
      `INSERT INTO invoices (
        id, invoice_number, vendor_id, purchase_order_id, invoice_date, due_date,
        total_amount, tax_amount, shipping_amount, grand_total,
        status, approved_by, approved_at, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
      RETURNING *`,
      [
        uuidv4(), invoice_number, vendor_id, purchase_order_id, invoice_date, due_date,
        total_amount, tax_amount || 0, shipping_amount || 0, grand_total,
        status || 'pending', approved_by, approved_at, notes
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Update invoice
const updateInvoice = async (id, invoiceData) => {
  const {
    invoice_date,
    due_date,
    total_amount,
    tax_amount,
    shipping_amount,
    grand_total,
    status,
    approved_by,
    approved_at,
    notes
  } = invoiceData;

  try {
    const result = await db.query(
      `UPDATE invoices SET
        invoice_date = $1,
        due_date = $2,
        total_amount = $3,
        tax_amount = $4,
        shipping_amount = $5,
        grand_total = $6,
        status = $7,
        approved_by = $8,
        approved_at = $9,
        notes = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *`,
      [
        invoice_date, due_date, total_amount, tax_amount, shipping_amount,
        grand_total, status, approved_by, approved_at, notes, id
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Update invoice status
const updateInvoiceStatus = async (id, status, approverData) => {
  const { approved_by, notes } = approverData || {};
  
  try {
    const result = await db.query(
      `UPDATE invoices SET
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

// Delete invoice
const deleteInvoice = async (id) => {
  try {
    await db.query('DELETE FROM invoices WHERE id = $1', [id]);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllInvoices,
  getInvoicesByVendorId,
  getInvoicesByPurchaseOrderId,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice
};
