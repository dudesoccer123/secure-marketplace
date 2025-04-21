const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

// Get all vendors
router.get('/', vendorController.getAllVendors);

// Get active vendors
router.get('/active', vendorController.getActiveVendors);

// Get vendor by ID
router.get('/:id', vendorController.getVendorById);

// Create new vendor
router.post('/', vendorController.createVendor);

// Update vendor
router.put('/:id', vendorController.updateVendor);

// Delete vendor
router.delete('/:id', vendorController.deleteVendor);

module.exports = router;
