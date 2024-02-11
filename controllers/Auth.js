
const User = require('../Models/User');
const UserSchema = require('../Models/User');
const sendEmail  = require('../utils/sendEmail');
const crypto = require('crypto');



const ErrorResponse = require('../utils/ErrorResponse');


exports.registerNewUser = async(req,res,next)=>{
    try{
        const {name,email,password,role} = req.body;
        
        const newUser = await UserSchema.create({
            name,
            email,
            password,
            role
        })
      sendTokenRes(201,newUser,res);
    }
    catch(err){
        next(err);
    }
}

exports.login = async (req,res,next)=>{
    try{
        const {email,password} = req.body;
    
        if(!email || !password){
           return next(new ErrorResponse(`enter valid email and password`,400));
        }

        const user = await UserSchema.findOne({email}).select('+password');
        if(!user){
           return next(new ErrorResponse(`invalid crendentials entered`,400))
        }
   const isMatch = await user.matchPassword(password); 
       if(!isMatch){
       return next(new ErrorResponse(`invalid crendentials entered`,400))
       }
       sendTokenRes(200,user,res);
    }
    catch(err){
        next(err);
    }
}

const sendTokenRes = (statusCode,user,res) => {
    const token = user.getSignedJwtToken();

    options = {
        expires:new Date(Date.now() + 30 * 24 * 60 *60 * 1000),
        httpOnly:true
    }

    return res
    .cookie('token',token,options)
    .status(statusCode).json({
        success:true,
        token
    })
}

exports.logout = async(req,res,next) => {
    try{
        return res.cookie('token','none',{
            expires:new Date(Date.now() + 10 * 1000),
            httpOnly:true
        }).status(200).json({
            success:true,
            data:{}
        })
       
    }
    catch(err){
        next(err);
    }
}

exports.getMe = async(req,res,next) => {
    try{
        const user = await User.findById(req.user.id);
        return res.status(200).json({
            success:true,
            user
        })
    }
    catch(err){
        next(err);
    }
}

exports.forgotPassword = async(req,res,next)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        
        if(!user){
            return next(
                new ErrorResponse(`user not found with the email ${req.body.email}`,404)
            )
        }

        const resetToken = user.getResetPasswordToken();

    await user.save({
        validateBeforeSave:false
    })

    const restUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
   try{
    
    await sendEmail({
        to:user.email,
        message:`reset password request was succesfully follow the link below to reset your password 
        ${restUrl}`,
        subject:'password reset'
    })

   return res.status(200).json({
        success:true,
        resetToken
    })
}
catch(err){
    console.log(err);

    await user.save({validateBeforeSave:false});
    return next(new ErrorResponse(`email cannot be sent`,500))

}
    }
    catch(err){
        next(err);
    }
}


exports.resetPassword = async (req,res,next) => {
    try{
        
        const resetPassword = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex')
        
        const user =  await User.findOne({
             resetPasswordToken:resetPassword,
             resetPasswordExpire:{$gt:Date.now()}
         })


        if(!user){
            return next(
                new ErrorResponse(`user not found`,404)
            )
        }

        user.password = req.body.password; 

        await user.save();
        return res.status(200).json({
        success:true,
        message:'password changed succesfully'
        })
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

exports.updateUser = async (req,res,next)=>{
    try{
        const details = {
            name:req.body.name,
            email:req.body.email
        }

        const user = await UserSchema.findByIdAndUpdate(req.user.id,details,{
            new:true,
            runValidators:true
        })

        await user.save();

        return res.status(201).json({
            success:true,
            data:'updated succesfully'
        })
    }
    catch(err){
        next(err);
    }
}

exports.updatePassword = async(req,res,next) => {
    try{
        const user = await UserSchema.findById(req.user.id).select("+password");

        if(!(await user.matchPassword(req.body.currentPassword))){
            return next(new ErrorResponse(`password didnot match please enter the correct password`,401))
        }

        req.user.password = req.body.newPassword;
        await user.save();
        return res.status(200).json({
            success:true,
            message:'password updated succesfully'
        })
    }
    catch(err){
        next(err);
    }
}
