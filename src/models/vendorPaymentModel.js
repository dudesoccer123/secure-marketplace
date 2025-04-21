const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all vendor payments
const getAllVendorPayments = async () => {
  try {
    const result = await db.query(
      `SELECT vp.*, i.invoice_number, i.vendor_id, v.company_name as vendor_name
       FROM vendor_payments vp
       JOIN invoices i ON vp.invoice_id = i.id
       JOIN vendors v ON i.vendor_id = v.id
       ORDER BY vp.payment_date DESC`
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get vendor payments by invoice ID
const getVendorPaymentsByInvoiceId = async (invoiceId) => {
  try {
    const result = await db.query(
      `SELECT * FROM vendor_payments
       WHERE invoice_id = $1
       ORDER BY payment_date DESC`,
      [invoiceId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get vendor payments by vendor ID
const getVendorPaymentsByVendorId = async (vendorId) => {
  try {
    const result = await db.query(
      `SELECT vp.*, i.invoice_number
       FROM vendor_payments vp
       JOIN invoices i ON vp.invoice_id = i.id
       WHERE i.vendor_id = $1
       ORDER BY vp.payment_date DESC`,
      [vendorId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get vendor payment by ID
const getVendorPaymentById = async (id) => {
  try {
    const result = await db.query(
      `SELECT vp.*, i.invoice_number, i.vendor_id, v.company_name as vendor_name
       FROM vendor_payments vp
       JOIN invoices i ON vp.invoice_id = i.id
       JOIN vendors v ON i.vendor_id = v.id
       WHERE vp.id = $1`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Create new vendor payment
const createVendorPayment = async (paymentData) => {
  const {
    invoice_id,
    payment_date,
    payment_amount,
    payment_method,
    transaction_reference,
    status,
    processed_by,
    notes
  } = paymentData;

  try {
    const result = await db.query(
      `INSERT INTO vendor_payments (
        id, invoice_id, payment_date, payment_amount,
        payment_method, transaction_reference, status, processed_by, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`,
      [
        uuidv4(), invoice_id, payment_date || new Date(), payment_amount,
        payment_method, transaction_reference, status || 'pending', processed_by, notes
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Update vendor payment
const updateVendorPayment = async (id, paymentData) => {
  const {
    payment_date,
    payment_amount,
    payment_method,
    transaction_reference,
    status,
    processed_by,
    notes
  } = paymentData;

  try {
    const result = await db.query(
      `UPDATE vendor_payments SET
        payment_date = $1,
        payment_amount = $2,
        payment_method = $3,
        transaction_reference = $4,
        status = $5,
        processed_by = $6,
        notes = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *`,
      [
        payment_date, payment_amount, payment_method,
        transaction_reference, status, processed_by, notes, id
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Update payment status
const updatePaymentStatus = async (id, status, processorData) => {
  const { processed_by, notes } = processorData || {};
  
  try {
    const result = await db.query(
      `UPDATE vendor_payments SET
        status = $1,
        processed_by = $2,
        notes = CASE WHEN $3 IS NOT NULL THEN $3 ELSE notes END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *`,
      [status, processed_by, notes, id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Delete vendor payment
const deleteVendorPayment = async (id) => {
  try {
    await db.query('DELETE FROM vendor_payments WHERE id = $1', [id]);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllVendorPayments,
  getVendorPaymentsByInvoiceId,
  getVendorPaymentsByVendorId,
  getVendorPaymentById,
  createVendorPayment,
  updateVendorPayment,
  updatePaymentStatus,
  deleteVendorPayment
};
