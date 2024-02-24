const express = require('express');
const { getRoute } = require('../controllers/Map');

const router = express.Router();

router.post('/getroute',getRoute);

module.exports = router;