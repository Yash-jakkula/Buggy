const express = require('express');
const router = express.Router();
const {authorizeD, protectD} = require('../Middleware/auth')

const { createDriver, updateDriver, getDriver, deleteDriver, getActiveDrivers } = require('../controllers/Driver');


router.post('/newDriver',createDriver);

router.put('/updateDriver/:id',protectD,authorizeD('driver','admin'),updateDriver);

router.get('/getDriver/:id',protectD,authorizeD('admin','driver'),getDriver);

router.get('/getactive',getActiveDrivers);

router.delete('/deleteDriver/:id',protectD,authorizeD('driver','admin'),deleteDriver);



module.exports = router;