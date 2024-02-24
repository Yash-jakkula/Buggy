const express = require('express');
const router = express.Router();
const {protect,authorize} = require('../Middleware/auth')

const { createStudent, updateStudent, getStudent, deleteStudent, nearestDrivers } = require('../controllers/student');


router.post('/newStudent',createStudent);

router.put('/updateStudent/:id',protect,authorize('student','admin'),updateStudent);

router.get('/getStudent/:id',protect,authorize('admin','student'),getStudent);

router.delete('/deleteStudent/:id',protect,authorize('student','admin'),deleteStudent);

router.post('/nearestdrivers',nearestDrivers);



module.exports = router;