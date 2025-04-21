const vendorPaymentModel = require('../models/vendorPaymentModel');

// Get all vendor payments
const getAllVendorPayments = async (req, res, next) => {
  try {
    const vendorPayments = await vendorPaymentModel.getAllVendorPayments();
    res.status(200).json({
      success: true,
      count: vendorPayments.length,
      data: vendorPayments
    });
  } catch (error) {
    next(error);
  }
};

// Get vendor payments by invoice ID
const getVendorPaymentsByInvoiceId = async (req, res, next) => {
  try {
    const vendorPayments = await vendorPaymentModel.getVendorPaymentsByInvoiceId(req.params.invoiceId);
    res.status(200).json({
      success: true,
      count: vendorPayments.length,
      data: vendorPayments
    });
  } catch (error) {
    next(error);
  }
};

// Get vendor payments by vendor ID
const getVendorPaymentsByVendorId = async (req, res, next) => {
  try {
    const vendorPayments = await vendorPaymentModel.getVendorPaymentsByVendorId(req.params.vendorId);
    res.status(200).json({
      success: true,
      count: vendorPayments.length,
      data: vendorPayments
    });
  } catch (error) {
    next(error);
  }
};

// Get vendor payment by ID
const getVendorPaymentById = async (req, res, next) => {
  try {
    const vendorPayment = await vendorPaymentModel.getVendorPaymentById(req.params.id);
    
    if (!vendorPayment) {
      return res.status(404).json({
        success: false,
        message: 'Vendor payment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: vendorPayment
    });
  } catch (error) {
    next(error);
  }
};

// Create new vendor payment
const createVendorPayment = async (req, res, next) => {
  try {
    const newVendorPayment = await vendorPaymentModel.createVendorPayment(req.body);
    res.status(201).json({
      success: true,
      data: newVendorPayment
    });
  } catch (error) {
    next(error);
  }
};

// Update vendor payment
const updateVendorPayment = async (req, res, next) => {
  try {
    const vendorPayment = await vendorPaymentModel.getVendorPaymentById(req.params.id);
    
    if (!vendorPayment) {
      return res.status(404).json({
        success: false,
        message: 'Vendor payment not found'
      });
    }
    
    const updatedVendorPayment = await vendorPaymentModel.updateVendorPayment(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: updatedVendorPayment
    });
  } catch (error) {
    next(error);
  }
};

// Update payment status
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { status, processed_by, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const vendorPayment = await vendorPaymentModel.getVendorPaymentById(req.params.id);
    
    if (!vendorPayment) {
      return res.status(404).json({
        success: false,
        message: 'Vendor payment not found'
      });
    }
    
    const processorData = {
      processed_by,
      notes
    };
    
    const updatedVendorPayment = await vendorPaymentModel.updatePaymentStatus(req.params.id, status, processorData);
    res.status(200).json({
      success: true,
      data: updatedVendorPayment
    });
  } catch (error) {
    next(error);
  }
};

// Delete vendor payment
const deleteVendorPayment = async (req, res, next) => {
  try {
    const vendorPayment = await vendorPaymentModel.getVendorPaymentById(req.params.id);
    
    if (!vendorPayment) {
      return res.status(404).json({
        success: false,
        message: 'Vendor payment not found'
      });
    }
    
    await vendorPaymentModel.deleteVendorPayment(req.params.id);
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
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
