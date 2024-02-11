
const mongoose = require('mongoose');
const Bootcamp = require('./Bootcamp');


const CourseSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,"please add a titile"]
    },
    description:{
        type:String,
        required:[true,"please add a description"],
    },
    weeks:{
        type:String,
        required:[true,"please add the duration in weeks"]
    },
    tuition:{
        type:Number,
        required:[true,"please add the cost of the course"]
    },
    mimimumSkill:{
        type:String,
        enum:['Beginner',"Intermediate","advanced"],
        
    },
    scholarshipsAvailable:{
        type:Boolean,
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        required:[true,"enter a bootcamp"],
        ref:'Bootcamp'
    },
    user:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'
    }

})

module.exports = mongoose.model('course',CourseSchema);
