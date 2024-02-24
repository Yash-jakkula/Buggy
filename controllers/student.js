const Student = require('../Models/Student');
const Driver = require('../Models/Driver');
const ErrorResponse = require('../utils/errorResponse');
const geoCoder = require('../utils/geoCoder');


exports.createStudent = async (req, res,next) => {
    try{
        const student = await Student.create(req.body);
        return res.status(201).json({
            success:true,
            student
        })
    }
    catch(err){
      next(err);
    }
};

exports.updateStudent = async (req,res,next)=>{
    try{
        if(await Student.findById(req.params.id)){
        const student = await Student.findByIdAndUpdate(req.params.id,req.body);
        return res.status(200).json({success:true,data:student})
        }
        else{
            return new next(new ErrorResponse(`student not found with id ${req.params.id}`,404));
        }
    }
    catch(err){
        next(err)
    }
}

exports.getStudent = async(req,res,next) => {
    try{
        const student = await Student.findById(req.params.id);
        if(!student){
            return next(new ErrorResponse(`no student found with id ${req.params.id}`,404))
        }
        return res.status(200).json({
            success:true,
            data:student
        })
    }
    catch(err){
        next(err);
    }
}


exports.deleteStudent = async (req,res,next)=>{
    try{
        if(await Student.findById(req.params.id)){
        const student = await Student.findByIdAndDelete(req.params.id);
        return res.status(200).json({success:true,data:{}})
        }
        else{
            return new next(new ErrorResponse(`student not found with id ${req.params.id}`,404));
        }
    }
    catch(err){
        next(err)
    }
}

exports.nearestDrivers = async (req,res,next) => {
    try{
        const {lat,lon} = req.body;
        const maxDistance = 1000;
        const drivers = await Driver.findNearestDrivers(lat, lon, maxDistance);
        const activeDrivers = drivers.filter(driver => driver.status === true);
        res.status(200).json({
            success:true,
            activeDrivers
        })
}   
    catch(err){
        next(err);
    }
}

