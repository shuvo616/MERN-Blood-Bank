const express = require('express')
const { testController } = require('../controllers/testController')

//Router object
const router = express.Router();

//Routes
router.get('/', testController);

//Export
module.exports = router;