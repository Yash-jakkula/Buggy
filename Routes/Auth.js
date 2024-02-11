const express = require('express');
const {
     registerNewUser, login, getMe, forgotPassword, resetPassword, updateUser, updatePassword, logout 
    } = require('../controllers/Auth');
const {protect} = require('../Middleware/auth');

const router = express.Router();

router.post('/newuser',registerNewUser);

router.post('/login',login);

router.get('/me',protect,getMe);

router.post('/forgotpass',forgotPassword);

router.put('/resetpassword/:resetToken',resetPassword);

router.put('/updateuser',protect,updateUser);

router.put('/updatePassword',protect,updatePassword);

router.get('/logout',logout);

module.exports = router;