const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Driver = require('./Models/Driver');
const Point = require('./Models/Point');

dotenv.config({path:'./config/config.env'});

mongoose.connect(process.env.MONGODB_CONN_URI)

const coordinates = JSON.parse(fs.readFileSync(`${__dirname}/_data/points.json`));
const drivers = JSON.parse(fs.readFileSync(`${__dirname}/_data/drivers.json`));




const insertData = async() => {
    
    try{
        await Point.create(coordinates);
        await Driver.create(drivers);
        
        console.log("Data inserted succesfully");
        process.exit();
    }
    catch(err){
        console.log(err)
    }
}

const deleteData = async ()=>{
    try{
        await Point.deleteMany();
        await Driver.deleteMany();
        console.log("Data deleted");
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

