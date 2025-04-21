const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all vendors
const getAllVendors = async () => {
  try {
    const result = await db.query(
      `SELECT * FROM vendors
       ORDER BY company_name`
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get active vendors
const getActiveVendors = async () => {
  try {
    const result = await db.query(
      `SELECT * FROM vendors
       WHERE is_active = true
       ORDER BY company_name`
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get vendor by ID
const getVendorById = async (id) => {
  try {
    const result = await db.query(
      `SELECT * FROM vendors
       WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Create new vendor
const createVendor = async (vendorData) => {
  const {
    user_id,
    vendor_code,
    company_name,
    contact_person,
    email,
    phone,
    address,
    tax_id,
    bank_account_name,
    bank_account_number,
    bank_name,
    bank_branch,
    payment_terms,
    is_active
  } = vendorData;

  try {
    const result = await db.query(
      `INSERT INTO vendors (
        id, user_id, vendor_code, company_name, contact_person,
        email, phone, address, tax_id, bank_account_name,
        bank_account_number, bank_name, bank_branch, payment_terms, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
      RETURNING *`,
      [
        uuidv4(), user_id, vendor_code, company_name, contact_person,
        email, phone, address, tax_id, bank_account_name,
        bank_account_number, bank_name, bank_branch, payment_terms, is_active || true
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Update vendor
const updateVendor = async (id, vendorData) => {
  const {
    company_name,
    contact_person,
    email,
    phone,
    address,
    tax_id,
    bank_account_name,
    bank_account_number,
    bank_name,
    bank_branch,
    payment_terms,
    is_active
  } = vendorData;

  try {
    const result = await db.query(
      `UPDATE vendors SET
        company_name = $1,
        contact_person = $2,
        email = $3,
        phone = $4,
        address = $5,
        tax_id = $6,
        bank_account_name = $7,
        bank_account_number = $8,
        bank_name = $9,
        bank_branch = $10,
        payment_terms = $11,
        is_active = $12,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING *`,
      [
        company_name, contact_person, email, phone, address,
        tax_id, bank_account_name, bank_account_number, bank_name,
        bank_branch, payment_terms, is_active, id
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Delete vendor
const deleteVendor = async (id) => {
  try {
    await db.query('DELETE FROM vendors WHERE id = $1', [id]);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllVendors,
  getActiveVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor
};
