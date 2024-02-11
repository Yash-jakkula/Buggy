const ErrorResponse = require('../utils/ErrorResponse');
const bootcamp = require('../Models/Bootcamp');
const ReviewSchema = require('../Models/Reviews');
const advancedResults = require('../Middleware/advancedResults');
const Bootcamp = require('../Models/Bootcamp');


exports.getReview = async(req,res,next) => {
    try{
       
        if(!req.params.bootcampId){
            return res.status(200).json(res.advancedResults);
        }
        else{
            const reviews = await ReviewSchema.find({bootcamp:req.params.bootcampId});
            return res.status(200).json({
                success:true,
                data:reviews
            })
        }
    }
    catch(err){
        next(err);
    }
}


exports.getSingleReview = async(req,res,next)=>{
    try{
       const review = await ReviewSchema.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
       });
       if(!review){
        return next(new ErrorResponse(`review not found with id ${req.params.id}`,404))
       }
       else{
        return res.status(200).json({
            success:true,
            data:review
        })
       }
    }
    catch(err){
        next(err);
    }
}

exports.addReview = async(req,res,next)=>{
    try{
        req.body.bootcamp = req.params.bootcampId;
        req.body.user = req.user.id;
        const bootcamp = await Bootcamp.findById(req.params.bootcampId);
        if(!bootcamp){
            return next(new ErrorResponse(`no bootcamp found with id ${req.params.bootcmapId}`,404))
        }

        const review = await ReviewSchema.create(req.body);
        return res.status(201).json({
            success:true,
            review
        })
    }
    catch(err){
        next(err);
    }
}