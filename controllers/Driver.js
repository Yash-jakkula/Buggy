const ErrorResponse = require('../utils/errorResponse');
const geoCoder = require('../utils/geoCoder');
const Driver = require('../Models/Driver');

exports.createDriver = async (req, res,next) => {
    try{
        const driver = await Driver.create(req.body);
        return res.status(201).json({
            success:true,
            driver
        })
    }
    catch(err){
      next(err);
    }
};

exports.updateDriver = async (req,res,next)=>{
    try{
        if(await Driver.findById(req.params.id)){
        const driver = await Driver.findByIdAndUpdate(req.params.id,req.body);
        return res.status(200).json({success:true,data:driver})
        }
        else{
            return new next(new ErrorResponse(`Driver not found with id ${req.params.id}`,404));
        }
    }
    catch(err){
        next(err)
    }
}

exports.getDriver = async(req,res,next) => {
    try{
        const driver = await Driver.findById(req.params.id);
        if(!driver){
            return next(new ErrorResponse(`no Driver found with id ${req.params.id}`,404))
        }
        return res.status(200).json({
            success:true,
            data:driver
        })
    }
    catch(err){
        next(err);
    }
}


exports.deleteDriver = async (req,res,next)=>{
    try{
        if(await Driver.findById(req.params.id)){
        const Driver = await Driver.findByIdAndDelete(req.params.id);
        return res.status(200).json({success:true,data:{}})
        }
        else{
            return new next(new ErrorResponse(`Driver not found with id ${req.params.id}`,404));
        }
    }
    catch(err){
        next(err)
    }
}

exports.getActiveDrivers = async(req,res,next) => {
    try{
        const active = await Driver.find({status:true});
        res.status(200).json({
            success:true,
            active
        })
    }
    catch(err){
        next(err);
    }
}
