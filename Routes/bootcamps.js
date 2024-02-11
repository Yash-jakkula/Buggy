const express = require('express')

const { createBootcamp,
     getAllBootcamp, 
     getBootcampById, 
     updateBootcamp, 
     deleteBootcamp, 
     getBootcampInRadius, 
     getBootcampQuery, 
     bootcampFileupload} = require('../controllers/Bootcamp');
const Bootcamp = require('../Models/Bootcamp');

const advancedResults = require('../Middleware/advancedResults');

const courseRouter = require('./courseRouter');
const ReviewRouter = require('./review');
const {protect,authorize} = require('../Middleware/auth');

const router = express.Router();

router.use('/:bootcampId/courses',courseRouter);
router.use('/:bootcampId/reviews',ReviewRouter);

router.route('/').get(advancedResults(Bootcamp,'Courses'),getAllBootcamp);

router.get('/:id',getBootcampById);

router.post('/createBootcamp',protect,authorize('publisher','admin'),createBootcamp )

router.post('/:id',protect,authorize('publisher','admin'),updateBootcamp);

router.delete('/:id',protect,authorize('publisher','admin'),deleteBootcamp);

router.get('/radius/:zipcode/:distance',getBootcampInRadius);

router.put('/:id',protect,bootcampFileupload);

module.exports = router;