const express = require('express');
const router = express.Router();
const { createEvent, getPages } = require('../controllers/eventController');

router.post('/', createEvent);
router.get('/pages', getPages);

module.exports = router;
