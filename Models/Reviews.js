
const mongoose = require('mongoose');
const Bootcamp = require('./Bootcamp');


const ReviewSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        maxlength:100,
        required:[true,"please add a titile"]
    },
    text:{
        type:String,
        required:[true,"please add text"],
    },
    rating:{
        type:Number,
        min:1,
        max:10,
        required:[true,"please add a rating between 1 and 10"]
    },
   createdAt:{
    type:Date,
    default:Date.now()
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

ReviewSchema.statics.getAvgRating = async function(bootcampId){
   const obj = await this.aggregate([{
        $match: { bootcamp:bootcampId } 
    },
    {
        $group:{
            _id:'$bootcamp',
            averageRating:{$avg:'$rating'}
        }
    }]);
    try{
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId,
            {averageRating : obj[0].averageRating} )
    }
    catch(err){
        console.log(err);
    }
};

ReviewSchema.post('save',function(){
    this.constructor.getAvgRating(this.bootcamp);
})

ReviewSchema.pre('remove',function(){
    this.constructor.getAvgRating(this.bootcamp);
});

module.exports = mongoose.model('Review',ReviewSchema);
