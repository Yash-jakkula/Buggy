const express = require('express');
const advancedResults = require('../Middleware/advancedResults');
const { getReview, getSingleReview, addReview } = require('../controllers/Review');
const Review = require('../Models/Reviews');
const {protect,authorize} = require('../Middleware/auth');
const router = express.Router({mergeParams:true});

router.route('/')
.get(advancedResults(Review,{
    path:'bootcamp',
    select:'name description'}),getReview)
.post(protect,authorize('user','admin'),addReview);


router.route('/:id').get(getSingleReview);

module.exports = router;