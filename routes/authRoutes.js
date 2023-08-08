const express = require('express');
const { registerController, loginController, currentUserController } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
//Router object
const router = express.Router();

//All Routes
//Register || POST
router.post('/register', registerController);

//Login || POST
router.post('/login', loginController);

// Get current users || GET
router.get('/current-user', authMiddleware, currentUserController);

module.exports = router;