const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Bootcamp = require('./Models/Bootcamp');
const CourseSchema = require('./Models/course');
const UserSchema = require('./Models/User');
const ReviewSchema = require('./Models/Reviews');

dotenv.config({path:'./config/config.env'});

mongoose.connect(process.env.MONGODB_CONN_URI)

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`));


const insertData = async() => {
    
    try{
        await CourseSchema.create(courses);
        await Bootcamp.create(bootcamps);
        await UserSchema.create(users);
        await ReviewSchema.create(reviews);
        console.log("bootcamps inserted succesfully");
        process.exit();
    }
    catch(err){
        console.log(err)
    }
}

const deleteData = async ()=>{
    try{
        await Bootcamp.deleteMany();
        await CourseSchema.deleteMany();
        await UserSchema.deleteMany();
        await ReviewSchema.deleteMany();
        console.log("bootcamps deleted");
        process.exit();
    }
    catch(err){
        console.log(err)
    }
}

if(process.argv[2] == '-i'){
    insertData();
}
else if(process.argv[2] == '-d'){
    deleteData();
}

