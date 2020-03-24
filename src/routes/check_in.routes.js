const router = require('express').Router();
const checkInController = require('../controllers/check_in.controller')
const auth = require("../controllers/auth.controller")
const gps = require("../controllers/gps.controller")

router.get('/', auth.validateToken, checkInController.getAllBranchesWithDepartmentsByUser);
router.post('/', auth.validateToken, gps.validateGPS, checkInController.postCheckIn);

module.exports = router;