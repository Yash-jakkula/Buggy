const ErrorResponse = require("../utils/ErrorResponse");


const ErrorHandler = (err,req,res,next) => {
    let error = { ...err };
    error.message = err.message;
    if (err.name === "CastError") {
      let message = `resource not found with id ${err.value}`;
      error = new ErrorResponse(message, 404);
    }
    res.status(error.statusCode || 500).json({success:false,message:error.message || "resource not found"});
    
}

module.exports = ErrorHandler;