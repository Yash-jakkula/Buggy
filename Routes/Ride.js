const express = require('express');
const {
    onRide,cancelRide, sendRideRequest, acceptRideRequest
} = require('../controllers/Ride');
const {protectD,authorizeD,protect} = require('../Middleware/auth');
const router = express.Router();

router.delete('/cancelRide/:id',protect,cancelRide);

router.post('/requestride/:id',sendRideRequest);

router.post('/acceptride',protectD,authorizeD('driver'),acceptRideRequest);


module.exports = router;