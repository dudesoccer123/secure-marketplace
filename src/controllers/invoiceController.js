const invoiceModel = require('../models/invoiceModel');

// Get all invoices
const getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceModel.getAllInvoices();
    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};

// Get invoices by vendor ID
const getInvoicesByVendorId = async (req, res, next) => {
  try {
    const invoices = await invoiceModel.getInvoicesByVendorId(req.params.vendorId);
    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};

// Get invoices by purchase order ID
const getInvoicesByPurchaseOrderId = async (req, res, next) => {
  try {
    const invoices = await invoiceModel.getInvoicesByPurchaseOrderId(req.params.purchaseOrderId);
    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};

// Get invoice by ID
const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceModel.getInvoiceById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

// Create new invoice
const createInvoice = async (req, res, next) => {
  try {
    const newInvoice = await invoiceModel.createInvoice(req.body);
    res.status(201).json({
      success: true,
      data: newInvoice
    });
  } catch (error) {
    next(error);
  }
};

// Update invoice
const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceModel.getInvoiceById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    
    const updatedInvoice = await invoiceModel.updateInvoice(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: updatedInvoice
    });
  } catch (error) {
    next(error);
  }
};

// Update invoice status
const updateInvoiceStatus = async (req, res, next) => {
  try {
    const { status, approved_by, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const invoice = await invoiceModel.getInvoiceById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    
    const approverData = {
      approved_by,
      notes
    };
    
    const updatedInvoice = await invoiceModel.updateInvoiceStatus(req.params.id, status, approverData);
    res.status(200).json({
      success: true,
      data: updatedInvoice
    });
  } catch (error) {
    next(error);
  }
};

// Delete invoice
const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceModel.getInvoiceById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    
    await invoiceModel.deleteInvoice(req.params.id);
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
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
