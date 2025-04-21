const purchaseOrderModel = require('../models/purchaseOrderModel');

// Get all purchase orders
const getAllPurchaseOrders = async (req, res, next) => {
  try {
    const purchaseOrders = await purchaseOrderModel.getAllPurchaseOrders();
    res.status(200).json({
      success: true,
      count: purchaseOrders.length,
      data: purchaseOrders
    });
  } catch (error) {
    next(error);
  }
};

// Get purchase orders by vendor ID
const getPurchaseOrdersByVendorId = async (req, res, next) => {
  try {
    const purchaseOrders = await purchaseOrderModel.getPurchaseOrdersByVendorId(req.params.vendorId);
    res.status(200).json({
      success: true,
      count: purchaseOrders.length,
      data: purchaseOrders
    });
  } catch (error) {
    next(error);
  }
};

// Get purchase orders by department ID
const getPurchaseOrdersByDepartmentId = async (req, res, next) => {
  try {
    const purchaseOrders = await purchaseOrderModel.getPurchaseOrdersByDepartmentId(req.params.departmentId);
    res.status(200).json({
      success: true,
      count: purchaseOrders.length,
      data: purchaseOrders
    });
  } catch (error) {
    next(error);
  }
};

// Get purchase order by ID
const getPurchaseOrderById = async (req, res, next) => {
  try {
    const purchaseOrder = await purchaseOrderModel.getPurchaseOrderById(req.params.id);
    
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }
    
    // Get purchase order items
    const items = await purchaseOrderModel.getPurchaseOrderItems(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {
        ...purchaseOrder,
        items
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new purchase order
const createPurchaseOrder = async (req, res, next) => {
  try {
    const { items, ...purchaseOrderData } = req.body;
    const newPurchaseOrder = await purchaseOrderModel.createPurchaseOrder(purchaseOrderData, items);
    res.status(201).json({
      success: true,
      data: newPurchaseOrder
    });
  } catch (error) {
    next(error);
  }
};

// Update purchase order
const updatePurchaseOrder = async (req, res, next) => {
  try {
    const purchaseOrder = await purchaseOrderModel.getPurchaseOrderById(req.params.id);
    
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }
    
    const updatedPurchaseOrder = await purchaseOrderModel.updatePurchaseOrder(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: updatedPurchaseOrder
    });
  } catch (error) {
    next(error);
  }
};

// Update purchase order status
const updatePurchaseOrderStatus = async (req, res, next) => {
  try {
    const { status, approved_by, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const purchaseOrder = await purchaseOrderModel.getPurchaseOrderById(req.params.id);
    
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }
    
    const approverData = {
      approved_by,
      notes
    };
    
    const updatedPurchaseOrder = await purchaseOrderModel.updatePurchaseOrderStatus(req.params.id, status, approverData);
    res.status(200).json({
      success: true,
      data: updatedPurchaseOrder
    });
  } catch (error) {
    next(error);
  }
};

// Delete purchase order
const deletePurchaseOrder = async (req, res, next) => {
  try {
    const purchaseOrder = await purchaseOrderModel.getPurchaseOrderById(req.params.id);
    
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }
    
    await purchaseOrderModel.deletePurchaseOrder(req.params.id);
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPurchaseOrders,
  getPurchaseOrdersByVendorId,
  getPurchaseOrdersByDepartmentId,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  updatePurchaseOrderStatus,
  deletePurchaseOrder
};
