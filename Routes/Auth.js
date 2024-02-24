const express = require('express');
const router = express.Router();
const {  studentLogin, studentLogout, driverLogin, driverLogout, getallStudents, getallDrivers } = require('../controllers/Auth');
const{protect,authorize} = require('../Middleware/auth');


router.post('/studentlogin',studentLogin);

router.get('/studentlogout',studentLogout);

router.post('/driverlogin',driverLogin);

router.get('/driverlogout',driverLogout);

router.get('/getallstudents',getallStudents);

router.get('/getalldrivers',getallDrivers);

module.exports = router;