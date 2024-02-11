const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../Models/User')

exports.getUsers = async (req, res, next) => {
  try{
    res.status(200).json(res.advancedResults);
  }
  catch(err){
    next(err)
  }
};


exports.getUser = async (req, res, next) => {
    try{
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorResponse(`No user with the id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
}
catch(err){
    next(err)
}
};


exports.createUser = async (req, res, next) => {
 try{
    const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
}
catch(err){
    next(err)
}
};


exports.updateUser = async (req, res, next) => {
 try{
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
}
catch(err){
    next(err)
}
};


exports.deleteUser = async (req, res, next) => {
    try{
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
}
catch(err){
    next(err)
}
};
