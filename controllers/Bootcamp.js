const geocoder  = require('../utils/geoCoder');
const Bootcamp = require('../Models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const CourseSchema = require('../Models/course');
const path = require('path');


exports.createBootcamp = async (req,res,next) => {
    try{
        req.body.user = req.user.id;
        
        const published = await Bootcamp.findOne({user:req.user.id});

        if(published && req.user.role != 'admin'){
            return next(
                new ErrorResponse(`user with id ${req.user.id} has already published a bootcamp`,400)
            )
        }

        await Bootcamp.create(req.body);
        return res.status(201).json({success:true,Message:'Bootcamp added succesfully'})
    }
    catch(err){
      next(err);
    }
    
}


exports.getAllBootcamp = async (req,res,next) =>{
    try{
        res.status(200).json(res.advancedResults);   
    }
    catch(err){
        next(err)
    }
}

exports.getBootcampById = async (req,res,next) => {
    try{
        const {id} = req.params;
        console.log(id);
        const bootcamp = await Bootcamp.findById(id);
        if(!bootcamp)
        {
            return next(new ErrorResponse(`bootcamp is not found with the id ${req.params.id}`,404))
        }
        res.status(200).json({success:true,bootcamp:bootcamp})
        
    }
    catch(err){
        console.log(err.name);
        next(err);

// res.status(404).json({succes:false,bootcamp:"not found"})
    }
}

exports.updateBootcamp = async(req,res,next) => {
    try{
        let bootcamp = await Bootcamp.findById(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        if(!bootcamp){
           return res.status(400).json({succes:false,message:'bad request'})
        }
        
        if(bootcamp.user !== req.user.id && req.user.role !== 'admin')
        return next(
    new ErrorResponse(`user with id ${req.user.id} is not authorized`,403))

        bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new : true,
            runValidators:true
        })
            res.status(200).json({succes:true,message:bootcamp})
    }
    catch(err){
        next(err);
    }
}


exports.deleteBootcamp = async (req,res,next) => {
    try{
        const bootcamp = await Bootcamp.findById(req.params.id);
        
        if(!bootcamp){
            return res.status(404).json({success:false,message:'NOt found'})
        }

        if(bootcamp.user !== req.user.id && req.user.role!=='admin'){
            return next(
                new ErrorResponse(`user with id ${req.user.id} is not authorized to delete this bootcamp`,403)
            )
        }
        await Bootcamp.remove();
            return res.status(200).json({succes:true,message:'Deleted bootcamp and courses succesfully'})
    }
    catch(err){
       next(err);
    }
}


exports.getBootcampInRadius = async (req, res, next) => {
    try {
      const { zipcode, distance } = req.params;
      const loc = await geocoder.geocode(zipcode);
      const lat = loc[0].latitude;
      const log = loc[0].longitude;
      const radius = distance / 3963;
    
        res.status(200).json({
          success: true,
          data: await Bootcamp.find({
            location: { $geoWithin: { $centerSphere: [[log, lat], radius] } }
          })
        });
     
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
  

exports.getBootcampQuery = async (req,res,next) => {
    
    try{
        const bootcamp = await Bootcamp.find();
        res.status(200).json({
            success:true,
            count:bootcamp.length,
            data:bootcamp
        })
    }
    catch(err){
        next(err);
    }
}

exports.bootcampFileupload = async (req,res,next)=>{
    try{
        
        
        if(!req.files){
            return next(new ErrorResponse(`please upload a file`,400))
        }

        const file = req.files.file;
    
        if(!file.mimetype.startsWith('image')){
            return next(
                new ErrorResponse(`please upload a image file`,400)
            )
        }

        if(file.size > process.env.FILE_IMAGE_SIZE){
            return next(
                new ErrorResponse(`please upload image less than size of ${process.env.FILE_IMAGE_SIZE}`,400)
            )
        }

        file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

        file.mv(`${process.env.FILE_PATH_FOLDER}/${file.name}`, async err => {
            if(err){
                next(
                    new ErrorResponse(`Error in uploading file`,500)
                )
            }
        });

      const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,{photo : file.name});

        return res.status(200).json({
            succes:true,
            data:bootcamp
        })
        
    }
    catch(err){
        next(err);
    }
}