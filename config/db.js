const express = require("express");
const app = express();
const mongoose = require("mongoose");

const connectDB = async () =>{
    try{
        
        const conn = await mongoose.connect(process.env.MONGODB_CONN_URI)
        console.log("database connected");
    }
    catch(err){
        console.log(err);
    }
}


module.exports = connectDB;