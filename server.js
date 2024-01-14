const express = require('express');
const dotenv = require('dotenv');

//load env

dotenv.config({path:'./config/config.env'})

const app = express();

// getting port

const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`process running in ${process.env.NODE_ENV} on port ${PORT}`));
