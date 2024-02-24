const geocoder = require('../utils/geoCoder');
const mongoose = require('mongoose');


const Point = new mongoose.Schema({
  coordinates:{
    type:[Number],
    index:'2dsphere',
    required:true
  },
  name:{
    type:String,
  }  
});



module.exports = mongoose.model('Point',Point);