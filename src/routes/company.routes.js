const router = require('express').Router();
const companyController = require('../controllers/company.controller')
const auth = require("../controllers/auth.controller")


router.get("/domains", companyController.getAllDomains)

module.exports = router;
