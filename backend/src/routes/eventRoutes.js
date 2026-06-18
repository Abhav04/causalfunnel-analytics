const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/', eventController.trackEvent);
router.get('/', eventController.getEvents);

module.exports = router;
