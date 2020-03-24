const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller')
const auth = require("../controllers/auth.controller")

router.get('/', auth.validateToken, employeeController.getEmployeeById);

module.exports = router;