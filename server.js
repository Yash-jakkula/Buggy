const express = require('express');
const dotenv = require('dotenv');
const bootcamps  = require('./Routes/bootcamps');
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
const courseRouter = require('./Routes/courseRouter');
const authRouter = require('./Routes/Auth');
const userRouter = require('./Routes/user');
const ReviewRouter = require('./Routes/review');
const cors = require('cors');
//load env

dotenv.config({path:'./config/config.env'})

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

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses',courseRouter);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/auth/user',userRouter);
app.use('/api/v1/review',ReviewRouter);


app.use(ErrorHandler);


