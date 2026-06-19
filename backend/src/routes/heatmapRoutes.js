const express = require('express');
const router = express.Router();
const { getHeatmapData } = require('../controllers/eventController');

router.get('/', getHeatmapData);

module.exports = router;
