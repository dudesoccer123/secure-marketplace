const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Get all invoices
router.get('/', invoiceController.getAllInvoices);

// Get invoices by vendor ID
router.get('/vendor/:vendorId', invoiceController.getInvoicesByVendorId);

// Get invoices by purchase order ID
router.get('/purchase-order/:purchaseOrderId', invoiceController.getInvoicesByPurchaseOrderId);

// Get invoice by ID
router.get('/:id', invoiceController.getInvoiceById);

// Create new invoice
router.post('/', invoiceController.createInvoice);

// Update invoice
router.put('/:id', invoiceController.updateInvoice);

// Update invoice status
router.patch('/:id/status', invoiceController.updateInvoiceStatus);

// Delete invoice
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;
