
const mongoose = require('mongoose');



const Ride = new mongoose.Schema({
    time:{
        type:String,
        default:'10min'
    },
    distance:{
      type:String,
    },
    rideStatus:{
        type:String,
        required:[true],
        enum:['waiting','rejected','success']
    },
    pickupPoint:{
        type:String,
        required:true
        
    },
    dropPoint:{
      type:String,
      required:true
    },
    driver:{
      type:String,
      required:true,
      unique:true
    },
    student:{
      type:String,
      required:true,
      unique:true
    }
  
})

module.exports = mongoose.model('Ride',Ride);
