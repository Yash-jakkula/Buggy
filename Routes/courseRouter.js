const express = require('express');
const { getAllcourses, addNewCourse ,getCourseById, updateCourseById, delteCourseById} = require('../controllers/Course');
const course = require('../Models/course');
const advancedResults = require('../Middleware/advancedResults');
const courseRouter = express.Router({mergeParams:true});
const { protect,authorize } = require('../Middleware/auth');


courseRouter.route('/')
.get(advancedResults(course,{
    path:'bootcamp',
    select:'name description'
}),getAllcourses)

.post(protect,authorize('publisher','admin'),addNewCourse);

courseRouter.route('/:id')
.get(getCourseById)
.put(protect,authorize('publisher','admin'),updateCourseById)
.delete(protect,authorize('publisher','admin'),delteCourseById)

module.exports = courseRouter;