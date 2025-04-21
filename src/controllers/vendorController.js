const vendorModel = require('../models/vendorModel');

// Get all vendors
const getAllVendors = async (req, res, next) => {
  try {
    const vendors = await vendorModel.getAllVendors();
    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors
    });
  } catch (error) {
    next(error);
  }
};

// Get active vendors
const getActiveVendors = async (req, res, next) => {
  try {
    const vendors = await vendorModel.getActiveVendors();
    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors
    });
  } catch (error) {
    next(error);
  }
};

// Get vendor by ID
const getVendorById = async (req, res, next) => {
  try {
    const vendor = await vendorModel.getVendorById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// Create new vendor
const createVendor = async (req, res, next) => {
  try {
    const newVendor = await vendorModel.createVendor(req.body);
    res.status(201).json({
      success: true,
      data: newVendor
    });
  } catch (error) {
    next(error);
  }
};

// Update vendor
const updateVendor = async (req, res, next) => {
  try {
    const vendor = await vendorModel.getVendorById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    
    const updatedVendor = await vendorModel.updateVendor(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: updatedVendor
    });
  } catch (error) {
    next(error);
  }
};

// Delete vendor
const deleteVendor = async (req, res, next) => {
  try {
    const vendor = await vendorModel.getVendorById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    
    await vendorModel.deleteVendor(req.params.id);
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
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
