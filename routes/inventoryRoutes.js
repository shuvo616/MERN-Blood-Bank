const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
    createInventoryController,
    getInventoryController,
    getDonarController,
    getHospitalController,
    getOrganizationController,
    getOrganizationForHospitalController,
    getInventoryHospitalController,
    getRecentInventoryController
} = require('../controllers/inventoryController');

const router = express.Router();

//Routes

//Add Inventory || POST
router.post('/create-inventory', authMiddleware, createInventoryController);

//Get Inventory || GET
router.get('/get-inventory', authMiddleware, getInventoryController);

//Get Hospital Blood Records || POST
router.post('/get-inventory-hospital', authMiddleware, getInventoryHospitalController);

//Get Donar || GET
router.get('/get-donar', authMiddleware, getDonarController);

//Get Hospital || GET
router.get('/get-hospital', authMiddleware, getHospitalController);

//Get Organization || GET
router.get('/get-organization', authMiddleware, getOrganizationController);

//Get Organization for Hospital || GET
router.get('/get-organization-for-hospital', authMiddleware, getOrganizationForHospitalController);

//Get Recent Inventory - For Analytics Page || GET
router.get('/get-recent-inventory', authMiddleware, getRecentInventoryController);

module.exports = router;