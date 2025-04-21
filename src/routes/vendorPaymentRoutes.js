const express = require('express');
const router = express.Router();
const vendorPaymentController = require('../controllers/vendorPaymentController');

// Get all vendor payments
router.get('/', vendorPaymentController.getAllVendorPayments);

// Get vendor payments by invoice ID
router.get('/invoice/:invoiceId', vendorPaymentController.getVendorPaymentsByInvoiceId);

// Get vendor payments by vendor ID
router.get('/vendor/:vendorId', vendorPaymentController.getVendorPaymentsByVendorId);

// Get vendor payment by ID
router.get('/:id', vendorPaymentController.getVendorPaymentById);

// Create new vendor payment
router.post('/', vendorPaymentController.createVendorPayment);

// Update vendor payment
router.put('/:id', vendorPaymentController.updateVendorPayment);

// Update payment status
router.patch('/:id/status', vendorPaymentController.updatePaymentStatus);

// Delete vendor payment
router.delete('/:id', vendorPaymentController.deleteVendorPayment);

module.exports = router;
