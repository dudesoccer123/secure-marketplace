const express = require('express');
const router = express.Router();
const purchaseOrderController = require('../controllers/purchaseOrderController');

// Get all purchase orders
router.get('/', purchaseOrderController.getAllPurchaseOrders);

// Get purchase orders by vendor ID
router.get('/vendor/:vendorId', purchaseOrderController.getPurchaseOrdersByVendorId);

// Get purchase orders by department ID
router.get('/department/:departmentId', purchaseOrderController.getPurchaseOrdersByDepartmentId);

// Get purchase order by ID
router.get('/:id', purchaseOrderController.getPurchaseOrderById);

// Create new purchase order
router.post('/', purchaseOrderController.createPurchaseOrder);

// Update purchase order
router.put('/:id', purchaseOrderController.updatePurchaseOrder);

// Update purchase order status
router.patch('/:id/status', purchaseOrderController.updatePurchaseOrderStatus);

// Delete purchase order
router.delete('/:id', purchaseOrderController.deletePurchaseOrder);

module.exports = router;
