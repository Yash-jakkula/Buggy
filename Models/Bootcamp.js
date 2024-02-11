const geocoder = require('../utils/geoCoder');
const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const course = require('./course');


const Bootcamp = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide a name"],
    maxlength: [50, "name must be less than 50 characters"],
    trim: true,
    unique: true,
  },
  slug: String,
  description: {
    type: String,
    required: [true, "please add a discription"],
    maxlength: [500, "description must me less than 500 characters"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  phone: {
    type: String,
    maxlength: [20, "mobile number must be lesser than 20 characters"],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    // Array of strings
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must can not be more than 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
  }
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
});

//creating a slug

Bootcamp.pre('save',function(next){
  this.slug = slugify(this.name,{lower:true});
  next();
})

Bootcamp.pre('save',async function(next){
  try{
  const loc = await geocoder.geocode(this.address);
 
  const lat = loc[0].latitude;
  const lon = loc[0].longitude;
if(lat && lon){
  this.location = {
    type: "point",
    coordinates: [lon,lat],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    state: loc[0].state,
    zipcode: loc[0].zipcode,
    country: loc[0].country,
  };
}
else{
  console.log('failed');
}
}
catch(err){
  console.log(err);
}
  
  next();
})
//deleting bootcamp with the no courses
Bootcamp.pre('remove',async function(next){
  console.log('courses being deleted');
  await course.deleteMany({bootcamp:this._id});
  console.log('courses delted');
  next();
})
// creating a vertuals

Bootcamp.virtual('Courses',{
  ref:'course',
  localField:'_id',
  foreignField:'bootcamp',
  justOne:false
})



module.exports = mongoose.model('Bootcamp',Bootcamp);