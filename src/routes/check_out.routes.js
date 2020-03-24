const router = require('express').Router();
const checkOutController = require('../controllers/check_out.controller')
const auth = require("../controllers/auth.controller")

router.patch('/', auth.validateToken, checkOutController.postCheckOut);

module.exports = router;
