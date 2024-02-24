const express = require('express');
const dotenv = require('dotenv');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongosanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoose = require('mongoose');
const ErrorHandler = require('./Middleware/ErrorHandler');
const geocoder = require('./utils/geoCoder');
const connectDB = require('./config/db');
const student = require('./Routes/student');
const auth = require('./Routes/Auth');
const driver = require('./Routes/Driver');
const Ride = require('./Routes/Ride');
const Map = require('./Routes/Map');
// const Buggy = require('./Routes/Buggy');
const cors = require('cors');
//load env

dotenv.config({path:'./config/config.env'});

connectDB();

const app = express();


app.use(express.json());
// getting port

const PORT = process.env.PORT || 5000;
 

app.listen(PORT,console.log(`database connected running on port ${process.env.PORT}`))

app.use(fileupload());
app.use(cookieParser());
app.use(mongosanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());

const limiter = rateLimit({
    windowsMs:10 * 60 * 1000,
    max:100
})

app.use(limiter);


app.use('/api/v1/user',student);
app.use('/api/v1/user',driver);
app.use('/api/v1/auth',auth);
app.use('/api/v1/rides',Ride);
app.use('/api/v1/route',Map);



app.use(ErrorHandler);


