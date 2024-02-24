
const express = require('express');
const ErrorResponse = require('../utils/errorResponse');
const Ride = require('../Models/Ride');
const Driver = require('../Models/Driver');
const Student = require('../Models/Student');





exports.sendRideRequest = async(req,res,next)=>{
try{
        const {pickup,drop} = req.query;
        const student = await Student.findById(req.params.id);
        if(student){
       res.status(200).json({
            success:true,
            studentId:student._id,
            studentname:student.studentName,
            pickup:pickup,
            drop:drop
        })
    }
        else{
            res.status(404).json({
                success:false,
                message:'driver not in active state'
            })
        }
}
catch(err){
    next(err);
}
}


exports.acceptRideRequest = async(req,res,next)=>{
    try{
        const {student,pickupPoint,dropPoint,driver} = req.body;
        const newRide = await Ride.create({
        student:student,
        driver:driver,
        pickupPoint:pickupPoint,
        dropPoint:dropPoint,
        rideStatus:'success',       
        })
        return res.status(200).json({
            success:true,
            message:'ride confirmed your ride will reach you soon',
            rideDetails:newRide
        })

    }
    catch(err){
        next(err);
    }
}


exports.cancelRide = async (req,res,next)=>{
    try{
        await Ride.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success:true,
            data:{}
        })
    }
    catch(err){
        next(err);
    }
}