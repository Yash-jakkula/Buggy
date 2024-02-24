const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { decrypt } = require('dotenv');
const crypto = require('crypto');
const geoCoder = require('../utils/geoCoder');

const Driver = new mongoose.Schema({
    driverName:{
        type:String,
        required:[true,'please add a name']
    },
    role:{
        type:String,
        enum:['driver'],
        default:'driver'
    },
    driverLocation: {
       
        type: {
          type: String,
          enum: ["Point"],
        },
        coordinates: {
          type: [Number],
          index: "2dsphere",
          default:[12.968599154614157,79.16013297793172]
        },
      },
    driverEmail: {
        type: String,
        required:[true,'please add a email'],
        unique:[true,'email already exists'],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please add a valid email",
        ],
      },
      status:{
        type:Boolean,
        default:false,
      },
    
    driverPassword:{
        type:String,
        select:false,
        minlength:6,
        required:[true,'please add a password']
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now,

    }
    
})


Driver.pre('save',async function(next){
    try{
        if(!this.isModified('password')){
            next();
        }
    const salt = await bcrypt.genSalt(10);
    this.driverPassword = await bcrypt.hash(this.driverPassword,salt);
    }
    catch(err){
        next(err)
    }
    next();
})



Driver.methods.getSignedJwtToken = function() {
   return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE_IN
    })
  }


// Define a static method in the Driver model to find the nearest drivers
Driver.statics.findNearestDrivers = async function(latitude, longitude, maxDistance) {
  return this.find({
      "driverLocation.coordinates": {
          $near: {
              $geometry: {
                  type: "Point",
                  coordinates: [latitude, longitude]
              },
              $maxDistance: maxDistance, 
          }
      }
  });
};


Driver.methods.matchPassword =async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.driverPassword);
}

Driver.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}


module.exports = mongoose.model('Driver',Driver);