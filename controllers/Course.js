
const CourseSchema = require('../Models/course');
const Bootcamp = require('../Models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const advancedResults = require('../Middleware/advancedResults');

exports.getAllcourses = async(req,res,next)=>{
    try{
     
    if(req.params.bootcampId){
        const course =await CourseSchema.find({bootcamp:req.params.bootcampId});
      return res.status(200).json({
            success:true,
            count:course.length,
            data:course
        })
    }
    else{
       return res.status(200).json(res.advancedResults);
    }
    
}
catch(err){
    next(err);
}
}

exports.getCourseById = async(req,res,next) => {
    try{
        const course = await CourseSchema.findById(req.params.id);
        
        if(!course){
            return next(
                new ErrorResponse(`No course found with id ${req.params.id}`,404)
            )
        }

        return res.status(200).json({
            success:true,
            data:course
        })
    }
    catch(err){
        next(err);
    }
}

exports.addNewCourse = async(req,res,next)=>{
    try{
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp){
    return next(new ErrorResponse(`bootcamp not found with id${req.params.bootcampId}`),404);
    }

    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponse(`user with id ${req.user.id} cannot add courses to this bootcamp`,403)
        )
    }

    
    const newcourse = await CourseSchema.create(req.body);
    return res.status(201).json({
        success:true,
        message:newcourse
    })
}
catch(err){
    next(err);
}

}


exports.updateCourseById = async (req,res,next)=>{
  try{
    let course = await CourseSchema.findById(req.params.id);
    
    if(!course){
        return next(
            new ErrorResponse(`no course found with id ${req.params.id}`,404)
        )
    }
    if(course.user.toString()!==req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponse(`only the owner of this course can update this`,403)
        )
    }

    course = await CourseSchema.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })

    return res.status(200).json({success:true,data:course});
  }
  catch(err){
     next(err);
  }
}


exports.delteCourseById = async (req,res,next)=>{
    try{
    const course = await CourseSchema.findById(req.params.id);
    if(!course){
        return next(
            new ErrorResponse(`no course to delte with id${req.params.id}`,404)
        )
    }
    
    if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponse(`unauthorized to delete the course`,403)
        )
    }

    await course.deleteOne();
    return res.status(200).json({
        success:true,
        data:{}
    })
    }
    catch(err){
        next(err);
    }

}
