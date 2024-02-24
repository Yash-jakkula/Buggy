const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { decrypt } = require('dotenv');
const crypto = require('crypto');
const geoCoder = require('../utils/geoCoder')

const Student = new mongoose.Schema({
    studentName:{
        type:String,
        required:[true,'please add a name']
    },
    role:{
        type:String,
        enum:['student'],
        default:'student'
    },
    
    studentLocation: {
        
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
    studentEmail: {
        type: String,
        required:[true,'please add a email'],
        unique:[true,'email already exists'],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please add a valid email",
        ],
      },
    
    studentPassword:{
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


Student.pre('save',async function(next){
    try{
        if(!this.isModified('password')){
            next();
        }
    const salt = await bcrypt.genSalt(10);
    this.studentPassword = await bcrypt.hash(this.studentPassword,salt);
    }
    catch(err){
        next(err)
    }
    next();
})

Student.methods.getSignedJwtToken = function() {
   return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE_IN
    })
    
}

Student.methods.matchPassword =async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.studentPassword);
}

Student.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}


module.exports = mongoose.model('Student',Student);