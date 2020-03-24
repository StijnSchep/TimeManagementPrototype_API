const router = require('express').Router();
const workedHoursController = require('../controllers/worked_hours.controller')
const auth = require("../controllers/auth.controller")

router.get("/", auth.validateToken, workedHoursController.getAllWorkedHours);
router.get("/dashboard", auth.validateToken, workedHoursController.getLast5WorkedHours);

module.exports = router;
