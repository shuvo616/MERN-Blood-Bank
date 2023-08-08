const express = require('express');
const { route } = require('./inventoryRoutes');
const authMiddleware = require('../middlewares/authMiddleware');
const {
    getDonarListController,
    getHospitalListController,
    getOrganizationListController,
    deleteDonarController,
    deleteHospitalController,
    deleteOrgController
} = require('../controllers/adminController');
const adminMiddleware = require('../middlewares/adminMiddleware');

//Router Object
const router = express.Router();

//All Admin Routes

// 1. GET || Get donar list
router.get('/donar-list', authMiddleware, adminMiddleware, getDonarListController);

// 2. GET || Get hospital list
router.get('/hospital-list', authMiddleware, adminMiddleware, getHospitalListController);

// 3. GET || Get organization list
router.get('/organization-list', authMiddleware, adminMiddleware, getOrganizationListController);


// All Admin Action Operation Routes
//Delete Donar
router.delete('/delete-donar/:id', authMiddleware, adminMiddleware, deleteDonarController);

//Delete Hospital
router.delete('/delete-hospital/:id', authMiddleware, adminMiddleware, deleteHospitalController);

//Delete Hospital
router.delete('/delete-organization/:id', authMiddleware, adminMiddleware, deleteOrgController);

// Export
module.exports = router; 