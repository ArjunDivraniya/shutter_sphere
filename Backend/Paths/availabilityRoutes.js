const express = require('express');
const router = express.Router();
const availabilityController = require('../Handlers/availabilityController');

router.get('/', availabilityController.getAvailability);
router.post('/block', availabilityController.updateBlock);
router.delete('/:signupId/:date', availabilityController.deleteBlock);
router.get('/recurring', availabilityController.getRecurringSchedule);
router.put('/recurring', availabilityController.updateRecurringSchedule);

module.exports = router;
