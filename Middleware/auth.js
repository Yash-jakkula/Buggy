const user = require('../Models/User');
const ErrorResponse = require('../utils/ErrorResponse');
const jwt = require('jsonwebtoken');


exports.protect = async(req,res,next) => {
    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
   
        else if(req.cookies.token){
        token = req.cookies.token;
    }
        if(!token){
            return next(
                new ErrorResponse(`not authorized to use this operation`,401)
            )
        }

        try{
            const verify = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await user.findById(verify.id);
            next();            
        }
        catch(err){
            return next(
                new ErrorResponse(`user not authorized`,401)
            )
        }

    }
    catch(err){
        next(err);
    }
}

exports.authorize = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role))
        return next(
        new ErrorResponse(`cannot access the request with the ${req.user.role} role`,403) 
        )
      
        next();
    }
}